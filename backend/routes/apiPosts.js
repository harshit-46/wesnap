const express = require("express");
const router = express.Router();
const postModel = require("../models/post");
const userModel = require("../models/user");
const upload = require("../middlewares/upload");
const isLoggedIn = require("../middlewares/isLoggedin");

router.get("/user/:userId", isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const posts = await postModel.find({ userId })
            .populate("userId", "username name avatar")
            .sort({ createdAt: -1 });

        const postsWithLikeInfo = posts.map(post => ({
            ...post.toObject(),
            likedByMe: post.likes.includes(currentUserId),
        }));

        res.status(200).json({
            success: true,
            posts: postsWithLikeInfo,
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
        });
    }
});

router.post(
    "/",
    isLoggedIn,
    upload("posts").single("media"),
    async (req, res) => {
        try {
            const postData = {
                content: req.body.content,
                userId: req.user._id,
            };

            if (req.file) {
                postData.imageUrl = req.file.path;
                postData.imagePublicId = req.file.filename;
            }

            const post = await postModel.create(postData);

            res.status(201).json({
                success: true,
                post,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to create post" });
        }
    }
);

router.put(
    "/update-profile",
    isLoggedIn,
    upload("avatars").single("avatar"),
    async (req, res) => {
        const updates = {
            name: req.body.name,
            username: req.body.username,
            bio: req.body.bio
        };

        if (req.file) {
            updates.avatar = req.file.path; // Cloudinary URL
            updates.avatarPublicId = req.file.filename; // optional
        }

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true }
        );

        res.json({ user });
    }
);


module.exports = router;