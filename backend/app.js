const http = require("http");
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
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const apiConversationRoutes = require("./routes/conversation.routes");
const apiForgotPasswordRoutes = require("./routes/apiReset");
const apiDeletePostRoutes = require("./routes/apiDeletePost");

const cookieParser = require('cookie-parser');
require('dotenv').config();

const { initSocket } = require("./socket/socket");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", apiAuthRoutes);
app.use("/api/reset", apiForgotPasswordRoutes);
app.use("/api/users", apiUserRoutes);
app.use("/api/posts", apiPostRoutes);
app.use("/api/posts", apiLikeRoutes);
app.use("/api/posts", apiDeletePostRoutes);
app.use("/api/search", apiSearchRoutes);
app.use("/api/follow", apiFollowRoutes);
app.use("/api/feed", apiFeedRoutes);
app.use("/api/comments", apiCommentRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", apiConversationRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Vibely API running 🚀");
});

const server = http.createServer(app);

// initialize socket.io
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server + Socket.IO running on port ${PORT}`);
});
