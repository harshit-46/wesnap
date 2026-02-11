const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const isLoggedIn = require("../middlewares/isLoggedin");
const { googleLogin, googleCallback } = require("../controllers/googleAuth.controller");
const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            username,
            email,
            password: hash,
            providers: ["local"]
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
});

/* LOGIN */
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "Please sign in using Google"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

/* LOGOUT */
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.json({ message: "Logged out" });
});

/* ME */
router.get("/me", isLoggedIn, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;