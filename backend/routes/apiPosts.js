const express = require("express");
const router = express.Router();
const postModel = require("../models/post");
const upload = require("../middlewares/upload");
const isLoggedIn = require("../middlewares/isLoggedin");

router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Fetching posts for user:", userId);

        const posts = await postModel.find({ userId: userId })
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts"
        });
    }
});

router.post(
    "/",
    isLoggedIn,
    upload.single("media"),
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

module.exports = router;