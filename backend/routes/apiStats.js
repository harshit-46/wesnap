const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const isLoggedIn = require("../middlewares/isLoggedin");

router.get("/:id" , isLoggedIn , async (req,res) => {
    const userId = req.params.id;

    const user = await userModel.findById(userId).select("followersCount");
    const followersCount = user ? user.followersCount : 0;

    const postsCount = await postModel.countDocuments({ userId });

    const likesCount = await postModel.countDocuments({
        likes : userId
    });

    const commentsCount = await commentModel.countDocuments({ userId });

    const stats = {
        followersCount,
        likesCount,
        commentsCount,
        postsCount
    };

    res.json({
        success: true,
        stats
    })

});

module.exports = router;