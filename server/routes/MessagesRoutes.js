import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";

const messagesRoutes = Router();

// using the multer package to get  the files
const upload = multer({dest:"uploads/files",
    limits: { 
        fileSize: 10 * 1024 * 1024  // 10MB limit
    }});

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default messagesRoutes;