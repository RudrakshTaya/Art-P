const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'],
        default: 'user',
    },
    phoneNumber: {
        type: String,
        required: true,
    }
    
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
