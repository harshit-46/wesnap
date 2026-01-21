const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

// 🔵 STEP 1: Redirect to Google
exports.googleLogin = (req, res) => {
    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["profile", "email"],
        redirect_uri: process.env.GOOGLE_REDIRECT_URI, // 🔥 REQUIRED
    });

    res.redirect(url);
};

// 🔵 STEP 2: Google callback
exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;

        const { tokens } = await client.getToken({
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI, // 🔥 REQUIRED
        });

        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                username: email.split("@")[0],
                avatar: picture,
                provider: "google",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });

        res.redirect("http://localhost:5173/feed");
    } catch (err) {
        console.error("GOOGLE CALLBACK ERROR:", err);
        res.redirect("http://localhost:5173/?error=google");
    }
};