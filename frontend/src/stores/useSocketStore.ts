import {create} from "zustand"
import {io, type Socket} from "socket.io-client"
import { useAuthStore } from "./useAuthStore"
import type { SocketState } from "@/types/store"

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
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if(socket){
            socket.disconnect();
            set({socket:null})
        }
    }
}))