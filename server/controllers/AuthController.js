// controllers are the actual code whenever we signup what should happen is written here

import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
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
      secure: true,
      sameSite: "none",
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

    // Uses the User model to insert a new user in MongoDB. The password will be hashed first, because of the userSchema.pre("save") middleware we wrote earlier.
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
      secure: true,
      sameSite: "none",
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