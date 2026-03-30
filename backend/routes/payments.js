// ─── routes/payments.js ───────────────────────────────────────────────────────
// POST /addPayment   → INSERT into Payment + UPDATE Booking status to Completed
// GET  /getPayments  → SELECT all payments (optionally filtered by Booking_Id list)

const express = require("express");
const pool    = require("../db");

const router = express.Router();

// ── POST /addPayment ──────────────────────────────────────────────────────────
// Body: { Payment_Id, Booking_Id, Amount, Payment_mode, Payment_date }
// Also marks the linked Booking as Completed in one DB transaction.
router.post("/addPayment", async (req, res) => {
  const {
    Payment_Id,
    Booking_Id,
    Amount,
    Payment_mode,
    Payment_date,
  } = req.body;

  if (!Booking_Id || !Amount || !Payment_mode || !Payment_date) {
    return res.status(400).json({ error: "Booking_Id, Amount, Payment_mode and Payment_date are required." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert the payment
    let paymentId = Payment_Id;
    if (paymentId) {
      await conn.query(
        "INSERT INTO Payment (Payment_Id, Amount, Payment_mode, Payment_date, Booking_Id) VALUES (?, ?, ?, ?, ?)",
        [paymentId, Amount, Payment_mode, Payment_date, Booking_Id]
      );
    } else {
      const [result] = await conn.query(
        "INSERT INTO Payment (Amount, Payment_mode, Payment_date, Booking_Id) VALUES (?, ?, ?, ?)",
        [Amount, Payment_mode, Payment_date, Booking_Id]
      );
      paymentId = result.insertId;
    }

    // 2. Mark the linked booking as Completed
    await conn.query(
      "UPDATE Booking SET Booking_Status = 'Completed' WHERE Booking_Id = ?",
      [Booking_Id]
    );

    await conn.commit();

    return res.status(201).json({
      data: {
        Payment_Id:   paymentId,
        Booking_Id,
        Amount,
        Payment_mode,
        Payment_date,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error("POST /addPayment error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Payment ID already exists. Please try again." });
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: `Booking ${Booking_Id} does not exist.` });
    }
    return res.status(500).json({ error: "Failed to record payment." });
  } finally {
    conn.release();
  }
});

// ── GET /getPayments ──────────────────────────────────────────────────────────
// Optional query: ?bookingIds=301,302,303  (comma-separated)
// Returns payments for those booking IDs so each user sees only their own.
router.get("/getPayments", async (req, res) => {
  const { bookingIds } = req.query;

  try {
    let rows;
    if (bookingIds) {
      // Parse comma-separated list and cast to numbers
      const ids = bookingIds.split(",").map(Number).filter(Boolean);
      if (ids.length === 0) return res.json({ data: [] });

      // mysql2 handles IN (?) with an array correctly
      [rows] = await pool.query(
        "SELECT * FROM Payment WHERE Booking_Id IN (?) ORDER BY Payment_date DESC",
        [ids]
      );
    } else {
      [rows] = await pool.query(
        "SELECT * FROM Payment ORDER BY Payment_date DESC"
      );
    }

    // Format Payment_date as YYYY-MM-DD string
    const formatted = rows.map(p => ({
      ...p,
      Payment_date: p.Payment_date
        ? new Date(p.Payment_date).toISOString().split("T")[0]
        : null,
    }));

    return res.json({ data: formatted });
  } catch (err) {
    console.error("GET /getPayments error:", err);
    return res.status(500).json({ error: "Failed to fetch payments." });
  }
});

module.exports = router;
