import express from "express";
import {
  getUserResume,
  getResumeById,
  updateResume,
  deleteResume,
  createResume,
} from "../controllers/resumeController.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";
import { protect } from "../middlewares/authmiddleware.js";

const router = express.Router();

// All routes need authentication
router.use(protect);

//CReate Resume
router.post("/", createResume);

// Get all resumes for the logged-in user
router.get("/", getUserResume);

// Get single resume by ID
router.get("/:id", getResumeById);

// Update resume by ID
router.put("/:id", updateResume);

// Delete resume by ID
router.delete("/:id", deleteResume);

// Upload resume images (thumbnail/profile)
router.post("/:id/upload-images", uploadResumeImages);

export default router;
