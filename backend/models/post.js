const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: String,
    imageUrl: String,
    imagePublicId: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
} , {timestamps : true});

postSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("post", postSchema);