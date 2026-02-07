const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: String,
    profileImage: {
        type: String,
        default: ""
    },
    profileImagePublicId: {
        type: String,
        default: ""
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ""
    },
    postCount: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    avatar: {
        type: String,
        default: ""
    },
    theme : {
        type: String,
        enum: ["light", "dark"],
        default: "light",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);