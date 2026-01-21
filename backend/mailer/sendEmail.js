const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async ({ to, subject, html }) => {
    try {
            await resend.emails.send({
            from: "Vibely <onboarding@resend.dev>",
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("RESEND ERROR:", err);
        throw err;
    }
};