import ChaCipher from "../utils/ChaCipher.js";
import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

const cipher = new ChaCipher(process.env.ENCRYPTION_SECRET_KEY );

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    if (!user1 || !user2) {
      return response.status(400).send("Both user ID's are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    // 🔓 DECRYPT TEXT MESSAGES
    const decryptedMessages = messages.map((msg) => {
      const messageObj = msg.toObject();

      if (messageObj.messageType === "text" && messageObj.content) {
        messageObj.content = cipher.decrypt(messageObj.content);
      }

      return messageObj;
    });

    return response.status(200).json({ messages: decryptedMessages });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

// upload files

export const uploadFile = async (request, response, next) => {
  try {
    if (!request.file) {
      response.status(400).send("file is required!");
    }

    const date = Date.now();

    let fileDir = `uploads/files/${date}`;

    let fileName = `${fileDir}/${request.file.originalname}`;

    // making the directory
    mkdirSync(fileDir, { recursive: true });

    renameSync(request.file.path, fileName);

    return response.status(200).json({ filePath: fileName });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};
