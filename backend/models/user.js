const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/vibely");

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
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    avatar: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);