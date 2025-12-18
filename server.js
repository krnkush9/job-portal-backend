// import packages
const express = require("express");
require("dotenv").config();
const PORT  = process.env.PORT || 8080;

const app = express();

// middlewares
app.use(express.json());

// import files
const dbConnect = require("./config/database");
const authRoutes = require("./routes/authRouter");
const userRoutes = require("./routes/userRouter");
const jobRoutes = require("./routes/jobRouter");

// DB connection
dbConnect();

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on the port no: ${PORT}`);
})