const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

router.get("/u/:username", async (req, res) => {
    try {
        const { username } = req.params;

        const user = await userModel.findOne({ username }).select("-password");
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            message: "Failed to fetch user"
        });
    }
});

module.exports = router;