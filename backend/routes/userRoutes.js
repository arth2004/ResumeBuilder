import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
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
;
router.get("/profile", protect, getUserProfile);

export default router;
