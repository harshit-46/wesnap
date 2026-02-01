const express = require('express');
const router = express.Router();
const followModel = require('../models/follow');
const userModel = require('../models/user');
const isLoggedIn = require("../middlewares/isLoggedin");

router.post("/", isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user._id;

        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }

        if (userId === currentUserId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const alreadyFollowing = await followModel.exists({
            follower: currentUserId,
            following: userId,
        });

        if (alreadyFollowing) {
            return res.status(400).json({ message: "Already following" });
        }

        await followModel.create({
            follower: currentUserId,
            following: userId,
        });

        await Promise.all([
            userModel.findByIdAndUpdate(userId, {
                $inc: { followersCount: 1 },
            }),
            userModel.findByIdAndUpdate(currentUserId, {
                $inc: { followingCount: 1 },
            }),
        ]);

        const updatedUser = await userModel.findById(userId)
            .select("followersCount");

        res.status(201).json({
            message: "Followed successfully",
            followersCount : updatedUser.followersCount
        });
    } catch (err) {
        console.error("FOLLOW ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/status/:username", isLoggedIn, async (req, res) => {
    try {
        const profileUser = await userModel.findOne({
            username: req.params.username,
        });

        if (!profileUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = await followModel.exists({
            follower: req.user._id,
            following: profileUser._id,
        });

        res.json({
            isFollowing: !!isFollowing,
            followersCount : profileUser.followersCount,
            followingCount : profileUser.followingCount
        });

    } catch (err) {
        console.error("FOLLOW STATUS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:userId", isLoggedIn, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const deleted = await followModel.findOneAndDelete({
            follower: currentUserId,
            following: targetUserId,
        });

        if (!deleted) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        await Promise.all([
            userModel.findByIdAndUpdate(targetUserId, {
                $inc: { followersCount: -1 },
            }),
            userModel.findByIdAndUpdate(currentUserId, {
                $inc: { followingCount: -1 },
            }),
        ]);

        const updatedUser = await userModel.findById(targetUserId)
            .select("followersCount");

        res.json({
            message: "Unfollowed successfully",
            followersCount : updatedUser.followersCount
        });

    } catch (err) {
        console.error("UNFOLLOW ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;