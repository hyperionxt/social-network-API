import { v2 as cloudinary } from "cloudinary";
import { API_KEY, API_SECRET, CLOUD_NAME } from "../config.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export async function uploadImage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "socialNetwork",
    resource_type:"image"
  });
}

export async function deleteImage(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}