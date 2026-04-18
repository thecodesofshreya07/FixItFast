const express = require("express");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const router = express.Router();


// ── POST /addPayment ─────────────────────────
router.post("/addPayment", async (req, res) => {
  const { Booking_Id, Amount, Payment_mode, Payment_date } = req.body;

  if (!Booking_Id || !Amount || !Payment_mode || !Payment_date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const paymentId = Date.now();

    const payment = new Payment({
      Payment_Id: paymentId,
      Booking_Id,
      Amount,
      Payment_mode,
      Payment_date
    });

    await payment.save();

    // update booking status
    await Booking.updateOne(
      { Booking_Id },
      { Booking_Status: "Completed" }
    );

    res.status(201).json({
      data: {
        Payment_Id: paymentId,
        Booking_Id,
        Amount,
        Payment_mode,
        Payment_date
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
});


// ── GET /getPayments ─────────────────────────
router.get("/getPayments", async (req, res) => {
  const { bookingIds } = req.query;

  try {
    let payments;

    if (bookingIds) {
      const ids = bookingIds.split(",").map(Number);
      payments = await Payment.find({ Booking_Id: { $in: ids } })
        .sort({ Payment_date: -1 });
    } else {
      payments = await Payment.find()
        .sort({ Payment_date: -1 });
    }

    const formatted = payments.map(p => ({
      ...p.toObject(),
      Payment_date: p.Payment_date
        ? new Date(p.Payment_date).toISOString().split("T")[0]
        : null
    }));

    res.json({ data: formatted });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;