const bcrypt = require('bcryptjs');  // Make sure bcrypt is imported
const User = require('../Models/user.Models');

// Signup Controller
// const signup = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if the user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the password before saving it
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user
//         user = new User({
//             email,
//             password: hashedPassword,  // Save hashed password
//         });

//         // Save the user to the database
//         await user.save();

//         res.status(201).json({ message: 'User registered successfully', user });
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Sign in successful', user });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, signin };
