import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (localFilePath, originalname) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided for upload.");
            return "";
        }

        console.log(`Starting upload for: ${originalname} (${localFilePath})`);

        // Upload the file to Cloudinary with chunked uploads for large files
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: originalname.split('.')[0],
            chunk_size: 6 * 1024 * 1024, // Set chunk size to 6 MB for large files
        });

        // File uploaded successfully
        console.log("✅ File uploaded successfully to Cloudinary:", response.secure_url);

        // Delete the local file after upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("🗑️ Local file deleted successfully:", localFilePath);
        }

        return response;

    } catch (error) {
        console.error("❌ Error uploading to Cloudinary:", error.message);

        // Handle specific Cloudinary errors
        if (error.http_code === 413) {
            console.error("🚨 File too large! Check Cloudinary's max file size limit.");
        } else if (error.name === 'FetchError') {
            console.error("⚠️ Network error while uploading. Check internet connection or try again.");
        }

        // Attempt to delete the local file if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("🗑️ Local file deleted due to failed upload:", localFilePath);
        }

        return null;
    }
};
