import { Router } from "express";
import { login, signup, updateProfile, addProfileImage, removeProfileImage } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getUserInfo } from "../controllers/AuthController.js";
import multer from "multer";
import { logout } from "../controllers/AuthController.js";


const authRoutes = Router();
const upload = multer({dest: "uploads/profiles/"});

authRoutes.post("/signup", signup); // "When someone makes a POST request to /signup, run the signup controller function"

// creating login route
authRoutes.post("/login", login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
authRoutes.post("/logout", logout);

export default authRoutes;