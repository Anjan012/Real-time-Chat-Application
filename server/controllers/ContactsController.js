import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    // implement search logic here
    const {searchTerm} = request.body;

    if(searchTerm === undefined || searchTerm === null){
        response.status(400).send("searchTerm is required.");
    }

    // regex to remove special characters and make it case insensitive
    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } }, // if the id is not equal to the logged in user then only search
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
      ],
    });

    // regex to remove special characters and make it case insensitive
    // from that if we found any user then return that user
    return response.status(200).json({contacts});

    // return response.status(200).send("Logout successfull.");  
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getContactsForDMList = async (request, response, next) => {
  try {
    let {userId} = request;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      // pipeline of queries we want to run 
      {
        $match: {
          // matching the sender and the recipient of the message with the userId
          $or: [{sender:userId}, {recipient: userId}],
        }
      },
      // query to sort that data
      {
        $sort: {timestamp: -1},
      },
      {
        $group:{
          _id:{
            $cond:{
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            }
          },
          lastMessageTime: {$first: "$timestamp"},
        },
      },
      {
        // look up query it is for getting the contact info from the messages 
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo"
        }
      },
      {
        $unwind: "$contactInfo",
      },
      {
        // to get the actual details
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        }
      },
      {
        $sort : {lastMessageTime: -1}
      }
    ]);
    
    return response.status(200).json({contacts});

  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find({_id: { $ne: request.userId }}, 
      "firstName lastName _id email"
    );

    const contacts = users.map((user)=> ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email, 
      value: user._id
    }))
    
    return response.status(200).json({contacts});

  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};