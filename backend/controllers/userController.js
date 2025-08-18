import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Store token in HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// inside authRoutes.js
router.post("/login", async (req, res, next) => {
  console.log("Login request received:", req.body);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate cookie
    generateToken(res, user._id);
    console.log("Token set in cookie");

    res.status(200).json({
      success: true,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token:req.cookies.jwt
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
