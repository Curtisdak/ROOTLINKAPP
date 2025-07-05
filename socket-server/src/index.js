import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"
import { registerSocketEvents } from "./socket.js"
dotenv.config();



const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

registerSocketEvents(io)

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`🚀 Socket server running on http://localhost:${PORT}`)
})