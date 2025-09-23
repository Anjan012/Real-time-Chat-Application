// controllers are the actual code whenever we signup what should happer is written here

import User from "../models/UserModel.js";
import { sign } from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge }); // creating the token using the sign method from jsonwebtoken package
};

export const signup = async (request, response, next) => {
  try {
    // we will get the email, password from the request body
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and Password are required");
    }

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
