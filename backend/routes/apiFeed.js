const express = require("express");
const router = express.Router();
const Follow = require("../models/follow");
const Post = require("../models/post");
const isLoggedIn = require("../middlewares/isLoggedin");

router.get("/", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const { cursor } = req.query;

        const follows = await Follow.find({
            follower: userId
        }).select("following");

        const followingIds = follows.map(f => f.following);
        followingIds.push(userId);

        const query = {
            userId: { $in: followingIds }
        };

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("userId", "username name")
            .lean();

        const enrichedPosts = posts.map(post => ({
            ...post,
            likedByMe: post.likes.some(
                id => id.toString() === userId.toString()
            ),
        }));

        res.json({ posts: enrichedPosts });
    } catch (err) {
        console.error("FEED ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;