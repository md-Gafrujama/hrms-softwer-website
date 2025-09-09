
import fs from "fs";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});


const testCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary connected successfully!");
  } catch (error) {
    console.error("Cloudinary connection failed:", error.message);
  }
};


testCloudinaryConnection();


const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    console.log("No file to upload to Cloudinary");
    return next();
  }

  try {
    console.log("Uploading to Cloudinary...");
    
    const base64String = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64String}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "user-profile-photos",
      resource_type: "auto",
    });

    req.cloudinaryUrl = result.secure_url;
    req.cloudinaryPublicId = result.public_id;
    
    console.log("File uploaded to Cloudinary successfully");
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file to Cloudinary",
      error: error.message,
    });
  }
};

export { upload, uploadToCloudinary };