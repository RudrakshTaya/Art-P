const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator'); // Import the validator library

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Please provide a valid email address'], // Email format validation
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], // Define allowed roles
        default: 'user' 
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the update date
    },
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    // Check if password is modified or if it's a new user
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next(); // Proceed with the save operation
    } catch (error) {
        return next(error); // Pass the error to the next middleware
    }
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // Compare hashed password with candidate password
};

// Create user model
const User = mongoose.model('User', UserSchema);

module.exports = User;
