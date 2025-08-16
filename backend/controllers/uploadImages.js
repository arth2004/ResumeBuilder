import fs from "fs";
import path from "path";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import Resume from "../models/resumeModel.js";

export const uploadResumeImages = asyncHandler(async (req, res) => {
  upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
    req,
    res,
    async (err) => {
      if (err) {
        res.status(400);
        throw new Error("File upload failed");
      }
      const resumeId = req.params.id;
      const resume = await Resume.findOne({
        _id: resumeId,
        userId: req.user._id,
      });

      if (!resume) {
        res.status(404);
        throw new Error("Resume not Found");
      }

      const uploadFolder = path.join(process.cwd(), "uploads");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImage?.[0];

      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(
            uploadFolder,
            path.basename(resume.thumbnailLink)
          );
          if (fs.existsSync(oldThumbnail)) {
            fs.unlinkSync(oldThumbnail);
          }
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }
      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(
            uploadFolder,
            path.basename(resume.profileInfo.profilePreviewUrl)
          );
          if (fs.existsSync(oldProfile)) {
            fs.unlinkSync(oldProfile);
          }
        }
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();
      res
        .status(200)
        .json({
          message: "Image uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
    }
  );
});
