import { Router } from "express";
import { login, signup } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getUserInfo } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup); // "When someone makes a POST request to /signup, run the signup controller function"

// creating login route
authRoutes.post("/login", login);
authRoutes.get('/user-info', verifyToken, getUserInfo);

export default authRoutes;