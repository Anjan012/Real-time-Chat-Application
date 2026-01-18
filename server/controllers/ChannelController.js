import ChaCipher from "../utils/ChaCipher.js";
import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";
const cipher = new ChaCipher(
  process.env.ENCRYPTION_SECRET_KEY
);

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;

    const userId = request.userId;

    const admin = await User.findById(userId);

    if (!admin) {
      return response.status(400).send("Admin user not found");
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return response.status(400).send("Some members are not valid users.");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return response.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    const admin = await User.findById(userId);

    return response.status(201).json({ channels });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};
export const getChannelMessages = async (request, response, next) => {
  try {
    const { channelId } = request.params;

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return response.status(201).send("Channel not found!");
    }

    // 🔓 Decrypt only text messages
    const messages = channel.messages.map((msg) => {
      const message = msg.toObject(); // avoid mutating mongoose doc

      if (message.messageType === "text" && message.content) {
        message.content = cipher.decrypt(message.content);
      }

      return message;
    });

    return response.status(201).json({ messages });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getChannelMembers = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId)
      .populate("members", "firstName lastName email image color")
      .populate("admin", "_id");

    if (!channel) return res.status(404).send("Channel not found");

    return res.status(200).json({
      members: channel.members,
      adminId: channel.admin._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};


export const addChannelMember = async (req, res) => {
  try {
    const { channelId, userIdToAdd } = req.body;
    const requesterId = req.userId;

    const channel = await Channel.findById(channelId);

    if (!channel) return res.status(404).send("Channel not found");

    if (channel.admin.toString() !== requesterId) {
      return res.status(403).send("Only admin can add members");
    }

    if (channel.members.includes(userIdToAdd)) {
      return res.status(400).send("User already in channel");
    }

    channel.members.push(userIdToAdd);
    await channel.save();

    res.status(200).send("Member added");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};


export const removeChannelMember = async (req, res) => {
  try {
    const { channelId, userIdToRemove } = req.body;
    const requesterId = req.userId;

    const channel = await Channel.findById(channelId);

    if (!channel) return res.status(404).send("Channel not found");

    if (channel.admin.toString() !== requesterId) {
      return res.status(403).send("Only admin can remove members");
    }

    channel.members = channel.members.filter(
      (id) => id.toString() !== userIdToRemove
    );

    await channel.save();

    res.status(200).send("Member removed");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export const leaveChannel = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;

    const channel = await Channel.findById(channelId);

    if (!channel) return res.status(404).send("Channel not found");

    channel.members = channel.members.filter(
      (id) => id.toString() !== userId
    );

    await channel.save();

    res.status(200).send("Left channel");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const requesterId = req.userId;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).send("Channel not found");
    }

    if (channel.admin.toString() !== requesterId) {
      return res.status(403).send("Only admin can delete channel");
    }

    // Delete the channel
    await Channel.findByIdAndDelete(channelId);

    return res.status(200).json({ 
      success: true,
      channelId 
    });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message 
    });
  }
};
