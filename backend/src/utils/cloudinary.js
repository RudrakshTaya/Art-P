const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configuration for Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcuxrnwk8', 
    api_key: process.env.CLOUDINARY_API_KEY || '226295283996662', 
    api_secret: process.env.CLOUDINARY_API_SECRET || 'htlUD916K5u82m5tHNpICrrLzmY',
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try { 
        if (!localFilePath) {
            console.error("No file path provided.");
            return null; // If no file path is provided, return null
        }
        if (!fs.existsSync(localFilePath)) {
            console.error("Local file does not exist:", localFilePath);
            return null; // Return null if the file doesn't exist
        }
        

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect file type (image, video, etc.)
        });

        console.log("Upload to Cloudinary successful:", response.url);

        // Delete the local file after successful upload
        fs.unlinkSync(localFilePath);
        
        return {
            url: response.secure_url, // Return the URL of the uploaded image
            public_id: response.public_id, // Return the public ID for further operations
            ...response // Include other response data if needed
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message || error);

        // In case of an error, delete the local file to avoid leaving unused files
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

module.exports = { uploadOnCloudinary };
