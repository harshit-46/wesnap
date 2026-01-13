const express = require('express');
const cors = require('cors');
const apiAuthRoutes = require("./routes/apiAuth");
const apiPostRoutes = require("./routes/apiPosts");
const apiUserRoutes = require("./routes/apiUsers");
const apiSearchRoutes = require("./routes/apiSearch");
const apiFollowRoutes = require("./routes/apiFollow");
const apiFeedRoutes = require("./routes/apiFeed");
const apiCommentRoutes = require("./routes/apiComment");
const apiLikeRoutes = require("./routes/apiLike");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", apiAuthRoutes);
app.use("/api/users", apiUserRoutes);
app.use("/api/posts", apiPostRoutes);
app.use("/api/posts" , apiLikeRoutes);
app.use("/api/search" , apiSearchRoutes);
app.use("/api/follow" , apiFollowRoutes);
app.use("/api/feed" , apiFeedRoutes);
app.use("/api/comments" , apiCommentRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Vibely API running 🚀");
});  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});