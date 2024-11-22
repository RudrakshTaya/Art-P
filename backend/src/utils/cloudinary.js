const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

// Configuration for Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcuxrnwk8',
    api_key: process.env.CLOUDINARY_API_KEY || '226295283996662',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'htlUD916K5u82m5tHNpICrrLzmY',
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath, retries = 10) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided.");
            return null;
        }

        // Check if the file exists
        try {
            await fs.access(localFilePath);
            
        } catch (err) {
            console.error("Local file does not exist:", localFilePath);
            return null;
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            timeout: 6000000, 
        });

        if (response && response.secure_url) {
            await fs.unlink(localFilePath);
            return {
                url: response.secure_url,
                public_id: response.public_id,
                ...response 
            };
        } else {
            console.error("Failed to upload the file. No secure URL returned.");
            throw new Error("No secure URL returned.");
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message || error);

        // Check for specific ENOTFOUND error
        if (error.code === 'ENOTFOUND' && retries > 0) {
            console.log("Network error detected. Retrying...");
        }

        // Retry logic if retries are available
        if (retries > 0) {
            console.log(`Retrying upload... Attempts left: ${retries}`);
            await sleep(3000); // Delay before retry
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

        return null;
    }
};

module.exports = { uploadOnCloudinary };
