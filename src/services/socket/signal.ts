import * as signalR from "@microsoft/signalr";
import { getAuthFromStorage } from "@/utils/lib";
const HUB_URL = "https://bugtrackerapi.onrender.com/hubs/chat" as string;

let connection: signalR.HubConnection | null = null;

const getAccessToken = () => getAuthFromStorage()?.accessToken ?? "";

export const getChatConnection = () => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => getAccessToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  return connection;
};