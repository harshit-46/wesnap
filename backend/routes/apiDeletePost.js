const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const isLoggedIn = require("../middlewares/isLoggedin");

router.delete('/:postId/discard', isLoggedIn, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();

        const comments = await commentModel.deleteMany({userId , postId});

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Delete post error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;