import { Router } from "express";
import { login, signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup); // "When someone makes a POST request to /signup, run the signup controller function"

// creating login route
authRoutes.post("/login", login);

export default authRoutes;