// ─── server.js ────────────────────────────────────────────────────────────────
// FixItFast backend — Express + MySQL
// Run: node server.js  OR  npm run dev  (with nodemon)

require("dotenv").config();

const express  = require("express");
const cors     = require("cors");

// Route modules
const authRoutes     = require("./routes/auth");
const serviceRoutes  = require("./routes/services");
const bookingRoutes  = require("./routes/bookings");
const paymentRoutes  = require("./routes/payments");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());                  // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies too

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "FixItFast API is running ✅", version: "1.0.0" });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/", authRoutes);       // POST /register, POST /login
app.use("/", serviceRoutes);    // GET  /getServices, GET /getProfessionals
app.use("/", bookingRoutes);    // GET  /getBookings, POST /addBooking, PATCH /updateBookingStatus/:id
app.use("/", paymentRoutes);    // POST /addPayment,  GET  /getPayments

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

const connectDB = require("./config/db");
connectDB();

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  FixItFast backend running at http://localhost:${PORT}`);
});
