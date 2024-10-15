const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

// Configuration for Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcuxrnwk8',
    api_key: process.env.CLOUDINARY_API_KEY || '226295283996662',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'htlUD916K5u82m5tHNpICrrLzmY',
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath, retries = 3) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided.");
            return null; // If no file path is provided, return null
        }

        // Check if the file exists
        try {
            await fs.access(localFilePath);
        } catch (err) {
            console.error("Local file does not exist:", localFilePath);
            return null; // Return null if the file doesn't exist
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect file type (image, video, etc.)
            timeout: 120000, 
        });

        // Check if the URL exists in the response
        if (response && response.secure_url) {
            // Delete the local file after successful upload
            await fs.unlink(localFilePath);
           
            // Return relevant data from the response
            return {
                url: response.secure_url, // Return the URL of the uploaded image
                public_id: response.public_id, // Return the public ID for further operations
                ...response // Include other response data if needed
            };
        } else {
            console.error("Failed to upload the file. No secure URL returned.");
            throw new Error("No secure URL returned."); // Throw error to trigger retry
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message || error);

        // Retry logic if retries are available
        if (retries > 0) {
            console.log(`Retrying upload... Attempts left: ${retries}`);
            return await uploadOnCloudinary(localFilePath, retries - 1);
        } else {
            // If all retries are exhausted, delete the local file
            try {
                await fs.unlink(localFilePath);
                console.log(`Deleted local file: ${localFilePath} after all retries failed.`);
            } catch (err) {
                console.error("Error deleting local file:", err);
            }
        }

        return null; // Return null if retries exhausted
    }
};

module.exports = { uploadOnCloudinary };
