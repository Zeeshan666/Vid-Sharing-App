import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async function (localPath) {
  try {
    if (!localPath) return null;
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log(response.url);
    fs.unlinkSync(localPath);
    return response;
  } catch (err) {
    fs.unlinkSync(localPath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export default uploadOnCloudnary;
