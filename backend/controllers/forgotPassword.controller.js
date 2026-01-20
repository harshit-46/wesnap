const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../mailer/sendEmail");

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).json({
            message: "If that email exists, a reset link has been sent",
        });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 🔒 Hash token before saving
    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your Vibely password",
        html: `
        <p>You requested a password reset.</p>
        <p>
        <a href="${resetUrl}">Click here to reset your password</a>
        </p>
        <p>This link expires in 10 minutes.</p>
    `,
    });

    res.status(200).json({
        message: "Reset link sent",
    });
};