const jwt = require('jsonwebtoken');
const User = require('../Models/user.Models'); // Ensure this path matches your project structure
const { sendEmail } = require('../Controllers/userVerification'); // Utility to send emails

// Signup Controller with Email Verification
const signup = async (req, res) => {
    const { username, email, password, role, fullName, phoneNumber } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({
            username,
            email,
            password,
            role: role || 'user',
            phoneNumber,
            fullName,
            isVerified: false, // New users are not verified by default
        });

        await user.save();

          // Generate email verification token
          const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });
          const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
  
          // Send verification email
          await sendEmail(email, 'Verify Your Email', `
              <p>Hello ${fullName},</p>
              <p>Please verify your email by clicking the link below:</p>
              <a href="${verificationLink}" target="_blank">Verify Email</a>
          `);
  
          res.status(201).json({ message: 'Registration successful! Please verify your email.' });
      } catch (error) {
          console.error('Signup Error:', error);
          res.status(500).json({ message: 'Server error. Please try again.' });
      }
  };
  



// Signin Controller with Verification Check
const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
        }

        // Validate the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Sign in successful',
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin Signup Controller
const adminSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if admin already exists
        let admin = await User.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create a new admin
        admin = new User({
            username,
            email,
            password,
            role: 'admin',
        });

        await admin.save();

        res.status(201).json({
            message: 'Admin registered successfully',
            userId: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
        });
    } catch (error) {
        console.error('Error during admin signup:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin Signin Controller
const adminSignin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin by email and check role
        const admin = await User.findOne({ email });
        if (!admin || admin.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate the password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Admin sign in successful',
            userId: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            token,
        });
    } catch (error) {
        console.error('Error during admin signin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, signin, adminSignup, adminSignin };
