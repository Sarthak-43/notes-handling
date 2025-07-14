// utils/cloudinaryUpload.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      type: "upload",
      flags: "attachment",
      use_filename: true,
      unique_filename: false
    });

    fs.unlinkSync(filePath); // Clean up local file
    console.log(result);
    return result; // ✅ Return entire object

  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('Error uploading to Cloudinary:', error);
    return null; // Always return something (null)
  }
};

export default uploadOnCloudinary;
