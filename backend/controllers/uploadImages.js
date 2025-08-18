import fs from "fs";
import path from "path";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import Resume from "../models/resumeModel.js";

export const uploadResumeImages = asyncHandler(async (req, res, next) => {
  // call multer middleware and forward errors to `next`
  upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
    req,
    res,
    async (err) => {
      if (err) {
        // Multer error (file size, invalid type, etc.)
        // forward to asyncHandler via next(err)
        res.status(400);
        return next(err);
      }

      try {
        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          res.status(404);
          return next(new Error("Resume not found"));
        }

        // debug helper — remove in prod
        console.log("Uploaded files:", req.files);

        const uploadFolder = path.join(process.cwd(), "uploads");
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const newThumbnail = req.files?.thumbnail?.[0];
        const newProfileImage = req.files?.profileImage?.[0];

        // ensure profileInfo object exists
        if (!resume.profileInfo) resume.profileInfo = {};

        if (newThumbnail) {
          // delete old thumbnail if exists
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) {
              try {
                fs.unlinkSync(oldThumbnail);
              } catch (unlinkErr) {
                console.warn("Failed to unlink old thumbnail:", unlinkErr);
              }
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
              try {
                fs.unlinkSync(oldProfile);
              } catch (unlinkErr) {
                console.warn("Failed to unlink old profile image:", unlinkErr);
              }
            }
          }
          resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
        }

        await resume.save();

        return res.status(200).json({
          message: "Image uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      } catch (err2) {
        // any other runtime error -> forward to asyncHandler
        return next(err2);
      }
    }
  );
});
