// ─── routes/bookings.js ───────────────────────────────────────────────────────
// GET  /getBookings?customerId=X  → SELECT from Booking + Booking_Service
// POST /addBooking                → INSERT into Booking + Booking_Service
// PATCH /updateBookingStatus/:id  → UPDATE Booking status to Completed

const express = require("express");
const pool    = require("../db");

const router = express.Router();

// ── GET /getBookings ─────────────────────────────────────────────────────────
// Query param: ?customerId=X   (required — each customer sees only their own)
router.get("/getBookings", async (req, res) => {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: "customerId query param is required." });
  }

  try {
    // Join Booking with Booking_Service to get Service_Id
    const [rows] = await pool.query(
      `SELECT
         b.Booking_Id,
         b.Booking_date,
         b.Booking_Status,
         b.Customer_Id,
         b.Professional_Id,
         bs.Service_Id
       FROM Booking b
       LEFT JOIN Booking_Service bs ON b.Booking_Id = bs.Booking_Id
       WHERE b.Customer_Id = ?
       ORDER BY b.Booking_Id DESC`,
      [customerId]
    );

    // Format dates to YYYY-MM-DD strings so frontend date logic works
    const formatted = rows.map(r => ({
      ...r,
      Booking_date: r.Booking_date
        ? new Date(r.Booking_date).toISOString().split("T")[0]
        : null,
    }));

    return res.json({ data: formatted });
  } catch (err) {
    console.error("GET /getBookings error:", err);
    return res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

// ── POST /addBooking ──────────────────────────────────────────────────────────
// Body: { Booking_Id, Customer_Id, Professional_Id, Service_Id, Booking_date, Booking_Status }
// Inserts a row into Booking AND a row into Booking_Service
router.post("/addBooking", async (req, res) => {
  const {
    Booking_Id,
    Customer_Id,
    Professional_Id,
    Service_Id,
    Booking_date,
    Booking_Status = "Pending",
  } = req.body;

  if (!Customer_Id || !Professional_Id || !Service_Id || !Booking_date) {
    return res.status(400).json({ error: "Customer_Id, Professional_Id, Service_Id and Booking_date are required." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert into Booking
    // If Booking_Id is provided use it, otherwise let AUTO_INCREMENT decide
    let bookingId = Booking_Id;
    if (bookingId) {
      await conn.query(
        "INSERT INTO Booking (Booking_Id, Booking_date, Booking_Status, Customer_Id, Professional_Id) VALUES (?, ?, ?, ?, ?)",
        [bookingId, Booking_date, Booking_Status, Customer_Id, Professional_Id]
      );
    } else {
      const [result] = await conn.query(
        "INSERT INTO Booking (Booking_date, Booking_Status, Customer_Id, Professional_Id) VALUES (?, ?, ?, ?)",
        [Booking_date, Booking_Status, Customer_Id, Professional_Id]
      );
      bookingId = result.insertId;
    }

    // Insert into Booking_Service (junction table)
    await conn.query(
      "INSERT INTO Booking_Service (Booking_Id, Service_Id) VALUES (?, ?)",
      [bookingId, Service_Id]
    );

    await conn.commit();

    return res.status(201).json({
      data: {
        Booking_Id:      bookingId,
        Booking_date,
        Booking_Status,
        Customer_Id,
        Professional_Id,
        Service_Id,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error("POST /addBooking error:", err);
    // Duplicate primary key means the frontend sent a Booking_Id already in use
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Booking ID already exists. Please try again." });
    }
    return res.status(500).json({ error: "Failed to create booking." });
  } finally {
    conn.release();
  }
});

// ── PATCH /updateBookingStatus/:id ───────────────────────────────────────────
// Marks a booking as Completed after payment is recorded.
// Body: { status }  (defaults to "Completed")
router.patch("/updateBookingStatus/:id", async (req, res) => {
  const bookingId = req.params.id;
  const status    = req.body.status || "Completed";

  try {
    const [result] = await pool.query(
      "UPDATE Booking SET Booking_Status = ? WHERE Booking_Id = ?",
      [status, bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Booking ${bookingId} not found.` });
    }

    return res.json({ data: { Booking_Id: Number(bookingId), Booking_Status: status } });
  } catch (err) {
    console.error("PATCH /updateBookingStatus error:", err);
    return res.status(500).json({ error: "Failed to update booking status." });
  }
});

module.exports = router;
