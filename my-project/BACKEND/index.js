// BACKEND/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// Import Routes
const statsRoutes = require("./routes/statsRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const patientRoutes = require("./routes/patientRoutes");
const recoveryRoutes = require("./routes/recoveryRoutes");
const recordRoutes = require("./routes/recordRoutes");
const doshaRoutes = require("./routes/doshaRoutes");
const dietRoutes = require("./routes/dietRoutes");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow requests from Frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API Routes Mounting
app.use("/api", statsRoutes);
app.use("/api", diseaseRoutes);
app.use("/api", treatmentRoutes);
app.use("/api", doctorRoutes);
app.use("/api", clinicRoutes);
app.use("/api", patientRoutes);
app.use("/api", recoveryRoutes);
app.use("/api", recordRoutes);
app.use("/api", doshaRoutes);
app.use("/api", dietRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5174;

app.listen(PORT, () => {
  console.log(`AyurVeda Connect Express server listening on port ${PORT}`);
});