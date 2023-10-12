import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { API_KEY, API_SECRET, CLOUD_NAME } from "../config";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true, //SSL as default
});

export async function uploadImage(
  filePath: string
): Promise<UploadApiResponse> {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder: "socialNetwork",
      resource_type: "image",
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
}
