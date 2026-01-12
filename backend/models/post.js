const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: String,
    imageUrl: String,
    imagePublicId: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

postSchema.index({ userId: 1, createdAt: -1 });


module.exports = mongoose.model("post", postSchema);