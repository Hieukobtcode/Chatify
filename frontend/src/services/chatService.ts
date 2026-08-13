import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

export interface AttachmentPayload {
    fileUrl: string;
    fileName: string;
    fileSize?: number;
    fileType?: string;
}

interface FetchMessageProps {
    messages: Message[];
    cursor?: string
}

const pageLimit = 50;

export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const res = await api.get("/conversations");
        return res.data;
    },

    async fetchMessage(id: string, cursor: string): Promise<FetchMessageProps> {
        const res = await api.get(`/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`)
        return { messages: res.data.messages, cursor: res.data.nextCursor }
    },

    async sendDirectMessage(recipientId: string, content: string = "", imgUrl?:string, conversationId?:string, attachment?: AttachmentPayload){
        const res = await api.post("/messages/direct",{recipientId,content,imgUrl,conversationId,...attachment})
        return res.data.message
    },

    async sendGroupMessage(conversationId:string,content:string = "",imgUrl?:string, attachment?: AttachmentPayload){
        const res = await api.post("/messages/group",{conversationId,content,imgUrl,...attachment})
        return res.data.message
    },

    async markAsSeen(conversationId:string){
        const res = await api.patch(`/conversations/${conversationId}/seen`);
        return res.data;
    },

    async uploadMessageImage(form: FormData): Promise<{ imgUrl: string; imgId: string }> {
        const res = await api.post("/messages/upload", form);
        return res.data;
    },

    async uploadMessageFile(form: FormData): Promise<{
        fileUrl: string;
        fileId: string;
        fileName: string;
        fileSize: number;
        fileType: string;
    }> {
        const res = await api.post("/messages/upload-file", form);
        return res.data;
    },

    async createConversation (type:"direct" | "group",name:string,memberIds:string[]) {
        const res = await api.post("/conversations",{type,name,memberIds});
        return res.data.conversation;
    }


}