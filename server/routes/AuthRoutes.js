import { Router } from "express";
import { signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup); // "When someone makes a POST request to /signup, run the signup controller function"

export default authRoutes;