import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { asyncHandler } from "./asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decoded",decoded.userId)
  req.user = await User.findById(decoded.userId).select("-password");
  next();
});
        