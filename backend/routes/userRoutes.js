import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
// inside authRoutes.js
router.post("/login", loginUser);

router.post("/profile", protect, getUserProfile);
export default router;
