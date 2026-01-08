const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

router.get("/", async (req, res) => {
    try {
        const query = req.query.query || "";

        if (!query.trim()) {
            return res.json([]);
        }

        const users = await userModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } }
            ]
        }).select("username name bio profileImage");

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Search failed" });
    }
});

module.exports = router;