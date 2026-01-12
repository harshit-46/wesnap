const express = require("express");
const router = express.Router();
const Follow = require("../models/follow");
const Post = require("../models/post");
const isLoggedIn = require("../middlewares/isLoggedin");

router.get("/", isLoggedIn, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

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

        res.json({ posts });
    } catch (err) {
        console.error("FEED ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;