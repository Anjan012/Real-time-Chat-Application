import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => { // we will get the server from index.js
    // defining the new socket io server 
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Creates a Map to track which user is connected to which socket
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`client disconnected: ${socket.id}`);
        // loops through all the entries in the map
        for (const [userId, socketId] of userSocketMap.entries()) {
            // Find which userId has this socketId
            if(socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        // getting sender and recipient id 
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);

        // to send the message details to the user we need to populate the sender and recipient
        const messageData = await Message.findById(createMessage._id).populate("sender", "id email firstName lastName image color").populate("recipient", "id email firstName lastName image color");

        if(recipientSocketId) { // if the reciver is online then we need to emit the event 
            io.to(recipientSocketId).emit('recieveMessage', messageData);
        }

        if(senderSocketId){
            io.to(senderSocketId).emit('recieveMessage', messageData);
        }
    }

    // Creating the connection handler (main logic) 
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId; // whenever we are making the connection we will send the userId from the frontend 
        if(userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`user connected: ${userId} with socket Id: ${socket.id}`)
        }
        else{
            console.log("user id not provided");
        }

        // writing an event
        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    })

}

export default setupSocket;