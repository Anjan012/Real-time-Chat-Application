import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  // we will get the server from index.js
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
      if (socketId === socket.id) {
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
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      // if the reciver is online then we need to emit the event
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendchannelMessage = async (message) => {
    const { channelId, sender, content, messageType, file } = message;

    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      file,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = {
      ...messageData._doc,
      channelId: channel._id,
    };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
    }
  };

  // Creating the connection handler (main logic)
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId; // whenever we are making the connection we will send the userId from the frontend
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected: ${userId} with socket Id: ${socket.id}`);
    } else {
      console.log("user id not provided");
    }

    // writing an event
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendchannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
