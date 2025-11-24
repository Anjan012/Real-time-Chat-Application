import { Server as SocketIoServer } from "socket.io";

const setupSocket = (server) => { // we will get the server from index.js
    // defining the new socket io server 
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    

}

export default setupSocket;