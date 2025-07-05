import {io, Socket} from "socket.io-client" ;


let socket : Socket | null  = null ;

export const getSocket = ()=>{
    if(!socket){
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {

            transports:["websocket"],
        });
    }

    return socket;
}

export async function emitSocketEvent(event: string, data: unknown) {
  try {
    await fetch(`${process.env.SOCKET_SERVER_URL}/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
    });
  } catch (error) {
    console.error("Socket emit failed:", error);
  }
}