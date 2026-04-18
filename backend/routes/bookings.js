const express = require("express");

const Booking = require("../models/Booking");
const BookingService = require("../models/BookingService");

const router = express.Router();


// ── GET /getBookings ─────────────────────────
router.get("/getBookings", async (req, res) => {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: "customerId required" });
  }

  try {
    const bookings = await Booking.find({ Customer_Id: Number(customerId) })
      .sort({ Booking_Id: -1 });

    // Get services separately (since no joins)
    const result = [];

    for (let b of bookings) {
      const services = await BookingService.find({ Booking_Id: b.Booking_Id });

      for (let s of services) {
        result.push({
          ...b.toObject(),
          Service_Id: s.Service_Id,
          Booking_date: b.Booking_date
            ? new Date(b.Booking_date).toISOString().split("T")[0]
            : null
        });
      }
    }

    res.json({ data: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});


// ── POST /addBooking ─────────────────────────
router.post("/addBooking", async (req, res) => {
  const {
    Customer_Id,
    Professional_Id,
    Service_Id,
    Booking_date,
    Booking_Status = "Pending"
  } = req.body;

  if (!Customer_Id || !Professional_Id || !Service_Id || !Booking_date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const bookingId = Date.now(); // simple unique id

    // Create booking
    const booking = new Booking({
      Booking_Id: bookingId,
      Booking_date,
      Booking_Status,
      Customer_Id,
      Professional_Id
    });

    await booking.save();

    // Create booking-service relation
    const bs = new BookingService({
      Booking_Id: bookingId,
      Service_Id
    });

    await bs.save();

    res.status(201).json({
      data: {
        Booking_Id: bookingId,
        Booking_date,
        Booking_Status,
        Customer_Id,
        Professional_Id,
        Service_Id
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});


// ── PATCH /updateBookingStatus ─────────────────
router.patch("/updateBookingStatus/:id", async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status || "Completed";

  try {
    const updated = await Booking.updateOne(
      { Booking_Id: id },
      { Booking_Status: status }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ data: { Booking_Id: id, Booking_Status: status } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

module.exports = router;