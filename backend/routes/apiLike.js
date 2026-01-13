const express = require("express");
const router = express.Router();
const postModel = require("../models/post");
const isLoggedIn = require("../middlewares/isLoggedin");

router.post("/:postId/like", isLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const hasLiked = post.likes.some(
            id => id.toString() === userId.toString()
        );

        if (hasLiked) {
            post.likes = post.likes.filter(
                id => id.toString() !== userId.toString()
            );
            post.likeCount = Math.max(0, post.likeCount - 1);
        } else {
            post.likes.push(userId);
            post.likeCount += 1;
        }

        await post.save();

        return res.json({
            liked: !hasLiked,
            likeCount: post.likeCount,
        });
    } catch (err) {
        console.error("LIKE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;