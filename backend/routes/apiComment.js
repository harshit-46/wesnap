const express = require("express");
const router = express.Router();
const commentModel = require("../models/comment");
const Post = require("../models/post");
const isLoggedIn = require("../middlewares/isLoggedin");

router.post("/", isLoggedIn, async (req, res) => {
    try {
        const { postId, content } = req.body;

        if (!postId || !content?.trim()) {
            return res.status(400).json({ message: "Invalid comment" });
        }

        const comment = await commentModel.create({
            postId,
            userId: req.user._id,
            content
        });

        // increment counter
        await Post.findByIdAndUpdate(postId, {
            $inc: { commentCount: 1 }
        });

        const populated = await comment.populate(
            "userId",
            "username name"
        );

        res.status(201).json({ comment: populated });
    } catch (err) {
        console.error("ADD COMMENT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:postId", async (req, res) => {
    try {
        const comments = await commentModel.find({
            postId: req.params.postId
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("userId", "username name");

        res.json({ comments });
    } catch (err) {
        console.error("GET COMMENTS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:commentId", isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Comment.findByIdAndDelete(comment._id);

        await Post.findByIdAndUpdate(comment.postId, {
            $inc: { commentCount: -1 }
        });

        res.json({ message: "Comment deleted" });
    } catch (err) {
        console.error("DELETE COMMENT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;