import {io, Socket} from "socket.io-client" ;


let socket : Socket | null  = null ;

export const getSocket = ()=>{
    if(!socket){
        socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:4000", {

            transports:["websocket"],
        });
    }

    return socket;
}

export async function emitSocketEvent(event: string, endpoint:string, data: unknown ) {
  console.log("Using SOCKET_SERVER_URL:", process.env.SOCKET_SERVER_URL)
  try {
   
    const url = process.env.SOCKET_SERVER_URL;
    if (!url) throw new Error("SOCKET_SERVER_URL not defined");


   const res =  await fetch(`${url}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data })
    });

    if(res.ok){
      console.log("Socket emit SUCCESS ")
     
    }else{
      const text = await res.text();
       console.log("Socket emit FAILED ",res.status, text)
    }

  } catch (error) {
    console.error("Socket emit failed:", error);
  }
}

