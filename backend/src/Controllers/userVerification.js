const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
const User = require('../Models/user.Models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME , 
        pass: process.env.EMAIL_PASSWORD, 
    },
});

// Send Email Helper
const sendEmail = async (to, subject, html) => {
    return transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html,
    });
};

// Email Verification
const sendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate a verification token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.verificationToken = token;
        await user.save();

        // Send verification email
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        await sendEmail(
            email,
            'Email Verification',
            `<p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`
        );

        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Missing verification token." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded.userId); // Use `userId` since it was set during token creation
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the email is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified." });
        }

        // Mark the user as verified
        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                message: "Verification token has expired. Please request a new verification email.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid verification token." });
        }

        // Handle generic server errors
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};



// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send password reset email
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await sendEmail(
            email,
            'Password Reset',
            `<p>Please click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`
        );

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        


        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update the password and clear reset fields
        user.password = newPassword;
       user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;

        await user.save();
        

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { sendVerificationEmail, verifyEmail, forgotPassword, resetPassword,sendEmail };
