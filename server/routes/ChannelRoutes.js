import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getChannelMessages, getUserChannels, getChannelMembers, addChannelMember, removeChannelMember, leaveChannel, deleteChannel } from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);
channelRoutes.get(
  "/:channelId/members",
  verifyToken,
  getChannelMembers
);
channelRoutes.post("/remove-member", verifyToken, removeChannelMember);
channelRoutes.post("/leave", verifyToken, leaveChannel);
channelRoutes.post("/add-member", verifyToken, addChannelMember);
channelRoutes.delete("/:channelId", verifyToken, deleteChannel);



export default channelRoutes;