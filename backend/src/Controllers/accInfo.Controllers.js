const User = require('../Models/user.Models'); // Adjust the path based on your structure
const { uploadOnCloudinary } = require('../utils/cloudinary');
const fs = require('fs').promises;

// Get Account Info
const getAccountInfo = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the token via authMiddleware
        const user = await User.findById(userId, '-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching account info:', error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Update Username
const updateUsername = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        const user = await User.findByIdAndUpdate(userId, { username }, { new: true });

        return res.status(200).json({ message: 'Username updated successfully.', user });
    } catch (error) {
        console.error('Error updating username:', error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Add/Update Profile Photo
const updateProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const filePath = req.file.path;

        try {
            // Upload to Cloudinary
            const response = await uploadOnCloudinary(filePath);

            if (!response) {
                return res.status(500).json({ message: 'Failed to upload profile photo.' });
            }

            // Update user photo URL
            const user = await User.findByIdAndUpdate(
                userId,
                { photo: response.url },
                { new: true }
            );

           

            return res.status(200).json({ message: 'Profile photo updated successfully.', user });
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            
            return res.status(500).json({ message: 'Failed to update profile photo.' });
        }
    } catch (error) {
        console.error('Error updating profile photo:', error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Add/Update Date of Birth
const updateDOB = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { dateOfBirth } = req.body;

        if (!dateOfBirth) {
            return res.status(400).json({ message: 'Date of birth is required.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { dateOfBirth },
            { new: true }
        );

        return res.status(200).json({ message: 'Date of birth updated successfully.', user });
    } catch (error) {
        console.error('Error updating date of birth:', error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

module.exports = {
    getAccountInfo,
    updateUsername,
    updateProfilePhoto,
    updateDOB,
};
