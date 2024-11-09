const jwt = require('jsonwebtoken');
const User = require('../Models/user.Models'); // Ensure this path matches your project structure

// Signup Controller
const signup = async (req, res) => {
    const { username, email, password,  role, fullName, phoneNumber } = req.body; 

    try {
        
        let user = await User.findOne({ 
            $or: [{ email: email }, { phoneNumber: phoneNumber }] 
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
            fullName: fullName,
        });

        await user.save(); 

        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id, 
            username: user.username,
            email: user.email,
            role: user.role, 
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        console.error('Error during signup:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
















// Signin Controller
const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Use the comparePassword method to validate the password
        const isMatch = await user.comparePassword(password); // Use the comparePassword method from the User model
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Return user details and token
        res.status(200).json({
            message: 'Sign in successful',
            userId: user._id, // Include userId for further use
            username: user.username,
            email: user.email,
            role: user.role, // Return role for client-side role-based redirection
            token, // Send the token back to the client
        });
    } catch (error) {
        console.error('Error during signin:', error); // Log the error for debugging
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
            role: admin.role 
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

        // Return admin details and token
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
