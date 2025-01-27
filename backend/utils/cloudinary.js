import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
export const uploadToCloudinary = async (localFilePath, originalname) => {
    try {
        if (!localFilePath) return "";

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: originalname.split('.')[0],
        });

        // File uploaded successfully
        console.log("File uploaded to Cloudinary:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
        return null;
    }
};