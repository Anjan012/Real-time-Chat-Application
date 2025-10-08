// controllers are the actual code whenever we signup what should happen is written here

import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import {renameSync, unlinkSync} from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // // 3 days in MILLISECONDS
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge }); // creating the token using the sign method from jsonwebtoken package
};

export const signup = async (request, response, next) => {
  try {
    // we will get the email, password from the request body -- request.body → contains the data the frontend sent (email + password).
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and Password are required");
    }

    // Uses the User model to insert a new user in MongoDB. The password will be hashed first, because of the userSchema.pre("save") middleware we wrote earlier.
    const user = await User.create({ email, password });
    // return as cookie
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      httpOnly: true,
      secure: false,     // Must be false on localhost
      sameSite: "lax",   // Safe and works with localhost
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request, response, next) => {
  try {
    // we will get the email, password from the request body -- request.body → contains the data the frontend sent (email + password).
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and Password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).send("User with the given email does not exist");
    }

    const auth = await compare(password, user.password); // comparing the plain text password with the hashed password (bycrypt package returns a boolean)
    if (!auth) {
      return response.status(400).send("Incorrect Password");
    }

    // if everything is fine then create a token and send it as cookie
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      httpOnly: true,
      secure: false,     // Must be false on localhost
      sameSite: "lax",   // Safe and works with localhost
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {

    const userData = await User.findById(request.userId);

    if(!userData){
      return response.status(404).send("User with the given id is not found!");
    }

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const {userId} = request;
    // getting data from body
    const {firstName, lastName, color} = request.body;

    if(!firstName || !lastName){
      return response.status(400).send("Firstname lastname and color is required.");
    }

    // update the data 
    const userData = await User.findByIdAndUpdate(userId, {
      firstName, lastName, color, profileSetup:true
    }, {new:true, runValidators:true}) // new: true tells mongodb query to return the new data so that we can send it to the frontend. runValidators:true validate if error it returns the error

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};


export const addProfileImage = async (request, response, next) => {
  try {
    if(!request.file) {
      return response.status(400).send("File is required.");
    }

    const data = Date.now();
    let fileName = "upload/profiles/" + date + request.file.originalName;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findOneAndUpdate(request.userId, {image:fileName}, {new:true, runValidators:true});

    return response.status(200).json({
      image: updatedUser.image
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const {userId} = request;
    // getting data from body
    const {firstName, lastName, color} = request.body;

    if(!firstName || !lastName){
      return response.status(400).send("Firstname lastname and color is required.");
    }

    // update the data 
    const userData = await User.findByIdAndUpdate(userId, {
      firstName, lastName, color, profileSetup:true
    }, {new:true, runValidators:true}) // new: true tells mongodb query to return the new data so that we can send it to the frontend. runValidators:true validate if error it returns the error

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};