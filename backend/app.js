const express = require('express');
const cors = require('cors');
const apiAuthRoutes = require("./routes/apiAuth");
const apiPostRoutes = require("./routes/apiPosts");
const apiSearchRoutes = require("./routes/apiSearch");
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
app.use("/api/posts", apiPostRoutes);
app.use("/api/search" , apiSearchRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});