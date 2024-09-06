const bcrypt = require('bcryptjs');
const User = require('../Models/user.Models'); // Ensure this path matches your project structure

// Signup Controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

        // Create a new user
        user = new User({
            username,
            email,
            password, // Store the hashed password
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during signup:', error); // Log the error for debugging
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

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Sign in successful', user });
    } catch (error) {
        console.error('Error during signin:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, signin };
