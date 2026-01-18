import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";
import ChaCipher from "./utils/ChaCipher.js";

const cipher = new ChaCipher(process.env.ENCRYPTION_SECRET_KEY);

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    // 🔐 encrypt only text messages
    if (message.messageType === "text" && message.content) {
      message.content = cipher.encrypt(message.content);
    }

    const createMessage = await Message.create(message);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    // 🔓 decrypt before sending
    const messageToSend = messageData.toObject();
    if (messageToSend.messageType === "text" && messageToSend.content) {
      messageToSend.content = cipher.decrypt(messageToSend.content);
    }

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageToSend);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageToSend);
    }
  };

  const sendchannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, file } = message;

      // ✅ CHECK IF CHANNEL EXISTS FIRST
      const channel = await Channel.findById(channelId).populate("members");

      if (!channel) {
        console.error(`Channel ${channelId} not found - possibly deleted`);
        return; // Exit early if channel doesn't exist
      }

      let encryptedContent = content;

      if (messageType === "text" && content) {
        encryptedContent = cipher.encrypt(content);
      }

      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content: encryptedContent,
        messageType,
        timestamp: new Date(),
        file,
      });

      const messageData = await Message.findById(createdMessage._id).populate(
        "sender",
        "id email firstName lastName image color",
      );

      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const messageToSend = messageData.toObject();
      if (messageToSend.messageType === "text" && messageToSend.content) {
        messageToSend.content = cipher.decrypt(messageToSend.content);
      }

      const finalData = {
        ...messageToSend,
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
    } catch (error) {
      console.error("Error in sendchannelMessage:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected: ${userId} with socket Id: ${socket.id}`);
    } else {
      console.log("user id not provided");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendchannelMessage);

    socket.on("user-removed-from-channel", ({ channelId, removedUserId }) => {
      const removedUserSocketId = userSocketMap.get(removedUserId);
      if (removedUserSocketId) {
        io.to(removedUserSocketId).emit("removed-from-channel", { channelId });
      }
    });

    socket.on("user-left-channel", ({ channelId, userId }) => {
      const userSocketId = userSocketMap.get(userId);
      if (userSocketId) {
        io.to(userSocketId).emit("left-channel", { channelId });
      }
    });

    socket.on("channel-deleted", ({ channelId }) => {
      try {
        socket.broadcast.emit("channel-deleted", { channelId });
        console.log("Channel deleted broadcast:", channelId);
      } catch (error) {
        console.error("Error broadcasting channel deletion:", error);
      }
    });

    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;