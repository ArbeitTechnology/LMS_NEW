require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const Adminrouter = require("./routes/Adminrouter");
const Studnetauth = require("./routes/Studentauth");

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth/student", Studnetauth);
app.use("/api/admin", Adminrouter);

// DB Connection
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
