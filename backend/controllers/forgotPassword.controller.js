const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../mailer/sendEmail");
const emailHtml = require("../mailer/templates/resetPasswordEmail");

exports.forgotPassword = async (req, res) => {
    try {
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

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset your wesnap password",
            html: emailHtml(resetUrl , user.name),
        }).catch(err =>  {
            console.error("Email send failed!" , err);
        });

        return res.status(200).json({ message: "Reset link sent" });

    } catch (err) {
        console.error("FORGOT PASSWORD ERROR MESSAGE:", err.message);
        console.error("FORGOT PASSWORD ERROR STACK:", err.stack);
        res.status(500).json({ message: "Server error" });
    }
};
