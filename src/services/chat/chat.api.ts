/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiInstance } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export type GroupChatResponse={
   projectId: string
  projectName: string
  projectStatus: string
  memberCount: number
  lastMessage?: LastMessage
  lastActivityAt: string
}

export interface LastMessage {
  id: string
  projectId: string
  sender: Sender
  content: string
  isEdited: boolean
  isDeleted: boolean
  replyTo: any
  sentAt: string
  editedAt: any
  isMine: boolean
}

export interface Sender {
  userId: string
  fullName: string
  email: string
}

export type GroupMessages={
    id: string
  projectId: string
  sender: Sender
  content: string
  isEdited: boolean
  isDeleted: boolean
  replyTo: any
  sentAt: string
  editedAt: any
  isMine: boolean
}

export type UserChats={
    id: string
  otherParticipant: OtherParticipant
  sender: Sender
  lastMessageSnippet: string
  lastMessageAt: string
  lastMessageIsMine: boolean
}

export interface OtherParticipant {
  userId: string
  fullName: string
  email: string
}

export type dmMessages = {
    messages: Message[]
  totalCount: number
  olderCursor: any
}

export interface Message {
  id: string
  conversationId: string
  sender: Sender
  content: string
  isEdited: boolean
  isDeleted: boolean
  replyTo: any
  isMine: boolean
  sentAt: string
  editedAt: any
}

export const authInstance = createApiInstance("CHAT");

export async function getGroupChats(): Promise<GroupChatResponse[]> {
  const res = await authInstance.get("/rooms");
  return res.data.data;
}

export async function getChatMessages(projectId:string):Promise<GroupMessages[]> {
  const res = await authInstance.get(`/projects/${projectId}`)
  console.log(res.data, "this is response coming get chats")
  return res.data.data
}


export async function getUserChats(): Promise<UserChats[]> {
  const res = await authInstance.get("/dm/conversations");
  return res.data.data;
}


export async function getUserDmMessages(conversationId:string):Promise<dmMessages> {
  const res = await authInstance.get(`/dm/conversations/${conversationId}`)
  console.log(res.data, "this is response coming get chats")
  return res.data.data
}

