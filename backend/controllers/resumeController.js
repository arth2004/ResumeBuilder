import { asyncHandler } from "../middlewares/asyncHandler.js";
import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

export const createResume = asyncHandler(async (req, res) => {
  const { title } = req.body;

  //Default template
  const defaultResumeData = {
    profileInfo: {
      profileImg: null,
      previewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: "",
      },
    ],
    interests: [""],
  };
  console.log("Requested user->",req.user);
  const newResume = await Resume.create({
    ...defaultResumeData,
    ...req.body,
    title,  
    userId: req.user._id,
  });
  console.log(newResume);
  if (newResume) res.status(201).json(newResume);
  else {
    res.status(401);
    throw new Error("Failed to create resume");
  }
});

export const getUserResume = asyncHandler(async (req, res) => {
  console.log(req.user);
  const resumes = await Resume.find({ userId: req.user._id }).sort({
    updatedAt: -1,
  });
  if (!resumes || resumes.length === 0) {
    res.status(404);
    throw new Error("No resumes found");
  }

  res.json(resumes);
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!resume) {
    res.status(404);
    throw new Error("No resume found with this id");
  }
  res.json(resume);
});

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!resume) {
    res.status(404);
    throw new Error("No resume found with this id");
  }
  Object.assign(resume, req.body);
  const savedResume = await resume.save();
  res.json(savedResume);
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    res.status(404);
    throw new Error("No resume found with this id");
  }

  const uploadsFolder = path.join(process.cwd(), "uploads");

  // Collect files to delete
  const filesToDelete = [];
  if (resume.thumbnailLink) {
    filesToDelete.push(
      path.join(uploadsFolder, path.basename(resume.thumbnailLink))
    );
  }
  if (resume.profileInfo?.profilePreviewUrl) {
    filesToDelete.push(
      path.join(
        uploadsFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      )
    );
  }

  // Delete files if they exist
  filesToDelete.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.promises.unlink(filePath);
    }
  });

  // Delete the resume document
  await resume.deleteOne();

  res.json({ message: "Resume deleted successfully" });
});
