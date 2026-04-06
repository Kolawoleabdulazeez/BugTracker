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


export const authInstance = createApiInstance("CHAT");

export async function getGroupChats(): Promise<GroupChatResponse[]> {
  const res = await authInstance.get("/rooms");
  console.log(res)
  return res.data.data;
}

export async function getChatMessages(projectId:string):Promise<GroupMessages[]> {
  const res = await authInstance.get(`/projects/${projectId}`)
  console.log(res.data, "this is response coming get chats")
  return res.data.data
}

