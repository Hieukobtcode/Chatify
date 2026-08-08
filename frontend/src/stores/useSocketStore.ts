import {create} from "zustand"
import {io, type Socket} from "socket.io-client"
import { useAuthStore } from "./useAuthStore"
import type { SocketState } from "@/types/store"
import { useChatStore } from "./useChatStore"

const baseURL = import.meta.env.VITE_SOCKET_URL

export const useSocketStore = create<SocketState>((set,get) => ({
    socket:null,
    onlineUsers:[],

    connectSocket: () =>  {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;

        if(existingSocket) return; //tranh tao nhieu socket

        const socket: Socket = io(baseURL,{
            auth:{token:accessToken},
            transports:["websocket"]
        });

        set({socket})

        socket.on("connect", () => {
            console.log("Connected socket")
        })

        //oinline users
        socket.on("online_users", (userIds) => {
            set({onlineUsers:userIds})
        })

        //new message
        socket.on("new-message",({message,conversation,unreadCounts}) => {
            useChatStore.getState().addMessage(message);

            const lastMessage = {
                _id:conversation.lastMessage._id,
                content:conversation.lastMessage.content,
                createAt: conversation.lastMessage.createAt,
                sender:{
                    _id:conversation.lastMessage.senderId,
                    displayName:"",
                    avatarUrl:null
                }
            }

            const updateConversation = {
                ...conversation,
                lastMessage,
                unreadCounts
            }

            if(useChatStore.getState().activeConversationId === message.conversationId){
                //danh dau da doc
            }

            useChatStore.getState().updateConversation(updateConversation)
        })
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if(socket){
            socket.disconnect();
            set({socket:null})
        }
    }
}))