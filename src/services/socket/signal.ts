import * as signalR from "@microsoft/signalr";
import { getAuthFromStorage } from "@/utils/lib";

const BASE = "https://bugtrackerapi.onrender.com/hubs";
const CHAT_HUB_URL = `${BASE}/chat`;
const DM_HUB_URL = `${BASE}/dm`;

export const DM_HUB = {
  // client to server (confirmed)
  join: "JoinConversation",
  leave: "LeaveConversation",
  send: "SendDm",
  edit: "EditMessage",
  remove: "DeleteMessage",
  typing: "Typing",

  // server to client (NOT confirmed, check the WS frames in DevTools)
  receive: ["ReceiveDm", "ReceiveDirectMessage", "DmReceived", "ReceiveMessage"],
  edited: ["MessageEdited", "DmMessageEdited"],
  deleted: ["MessageDeleted", "DmMessageDeleted"],
  typingEvent: ["DmTyping", "UserTypingDm", "UserTyping"],
};

const getAccessToken = () => getAuthFromStorage()?.accessToken ?? "";

/* ───────────── generic hub helper ───────────── */

type Hub = {
  get: () => signalR.HubConnection;
  ensure: () => Promise<signalR.HubConnection>;
  onRejoin: (fn: () => void) => void;
};

const createHub = (url: string): Hub => {
  let conn: signalR.HubConnection | null = null;
  let startPromise: Promise<void> | null = null;
  const rejoinHandlers: (() => void)[] = [];

  const get = () => {
    if (!conn) {
      conn = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => getAccessToken() })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Server-side group membership is lost on reconnect
      conn.onreconnected(() => rejoinHandlers.forEach((fn) => fn()));
    }
    return conn;
  };

  const ensure = async () => {
    const c = get();
    if (c.state === signalR.HubConnectionState.Connected) return c;

    if (c.state === signalR.HubConnectionState.Disconnected && !startPromise) {
      startPromise = c.start().finally(() => {
        startPromise = null;
      });
    }
    if (startPromise) await startPromise;
    return c;
  };

  return { get, ensure, onRejoin: (fn) => rejoinHandlers.push(fn) };
};

const chatHub = createHub(CHAT_HUB_URL);
const dmHub = createHub(DM_HUB_URL);

/* ───────────── group chat connection ───────────── */

export const getChatConnection = chatHub.get;
export const ensureConnected = chatHub.ensure;

const joinedRooms = new Set<string>();

chatHub.onRejoin(() => {
  joinedRooms.forEach((id) =>
    chatHub.get().invoke("JoinRoom", id).catch(console.error)
  );
});

export const joinRoom = async (projectId: string) => {
  const c = await chatHub.ensure();
  await c.invoke("JoinRoom", projectId);
  joinedRooms.add(projectId);
};

export const leaveRoom = async (projectId: string) => {
  if (!joinedRooms.has(projectId)) return;
  joinedRooms.delete(projectId);
  const c = chatHub.get();
  if (c.state === signalR.HubConnectionState.Connected) {
    await c.invoke("LeaveRoom", projectId).catch(console.error);
  }
};

/* ───────────── DM connection ───────────── */

export const getDmConnection = dmHub.get;
export const ensureDmConnected = dmHub.ensure;

const joinedConversations = new Map<string, Promise<void>>();

dmHub.onRejoin(() => {
  const ids = [...joinedConversations.keys()];
  joinedConversations.clear();
  ids.forEach((id) => joinConversation(id).catch(console.error));
});

export const joinConversation = (conversationId: string): Promise<void> => {
  let p = joinedConversations.get(conversationId);
  if (!p) {
    p = dmHub
      .ensure()
      .then((c) => c.invoke(DM_HUB.join, conversationId))
      .then(() => undefined)
      .catch((e) => {
        joinedConversations.delete(conversationId); // allow a retry
        throw e;
      });
    joinedConversations.set(conversationId, p);
  }
  return p;
};

export const leaveConversation = async (conversationId: string) => {
  if (!joinedConversations.has(conversationId)) return;
  joinedConversations.delete(conversationId);
  const c = dmHub.get();
  if (c.state === signalR.HubConnectionState.Connected) {
    await c.invoke(DM_HUB.leave, conversationId).catch(console.error);
  }
};