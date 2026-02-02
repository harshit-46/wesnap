const express = require('express');
const router = express.Router();
const postModel = require('../models/post');
const userModel = require('../models/user');
const commentModel = require('../models/comment');
const isLoggedIn = require("../middlewares/isLoggedin");

router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const activities = [];

        const posts = await postModel
            .find({ userId })
            .select("_id content likeCount commentCount createdAt");

        for (const post of posts) {
            activities.push({
                entityId: post._id,
                type: "post",
                action: "published",
                title: post.content,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                timestamp: post.createdAt
            });
        }

        const likedposts = await postModel
            .find({ likes: userId })
            .select("_id content createdAt");

        for (const post of likedposts) {
            activities.push({
                entityId: post._id,
                type: "like",
                action: "liked",
                title: post.content,
                timestamp: post.createdAt
            });
        }

        const commentPosts = await commentModel
            .find({ userId })
            .select("content postId createdAt");

        for (const comment of commentPosts) {
            activities.push({
                entityId: comment.postId,
                type: "comment",
                action: "commented on",
                title: comment.content,
                timestamp: comment.createdAt
            });
        }

        activities.sort((a, b) => b.timestamp - a.timestamp);

        res.status(200).json({ activities });

    } catch (err) {
        console.error("Activity route error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;