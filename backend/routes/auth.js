const express = require("express");
const bcrypt  = require("bcryptjs");
const Customer = require("../models/Customer");

const router = express.Router();


// ── POST /register ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { Customer_name, Address, contact, Contact, Password } = req.body;

  const finalContact = contact || Contact;

  // Validation
  if (!Customer_name || !Address || !finalContact || !Password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!/^\d{10}$/.test(finalContact)) {
    return res.status(400).json({ error: "Enter a valid 10-digit contact number." });
  }

  if (Password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check if user already exists
    const existing = await Customer.findOne({ contact: finalContact });

    if (existing) {
      return res.status(409).json({
        error: "An account with this contact number already exists."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user (✅ FIXED — includes contact)
    const newCustomer = new Customer({
      Customer_Id: Date.now(),
      Customer_name,
      Address,
      contact: finalContact,   // 🔥 IMPORTANT FIX
      Password: hashedPassword
    });

    await newCustomer.save();

    return res.status(201).json({
      data: {
        Customer_Id: newCustomer.Customer_Id,
        Customer_name,
        Address,
        contact: finalContact
      }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});


// ── POST /login ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { contact, Contact, Password } = req.body;

  const finalContact = contact || Contact;

  if (!finalContact || !Password) {
    return res.status(400).json({ error: "Contact and password are required." });
  }

  try {
    const customer = await Customer.findOne({ contact: finalContact });

    if (!customer) {
      return res.status(401).json({ error: "Invalid contact or password." });
    }

    const match = await bcrypt.compare(Password, customer.Password);

    if (!match) {
      return res.status(401).json({ error: "Invalid contact or password." });
    }

    // Remove password before sending
    const { Password: _, ...safe } = customer.toObject();

    return res.json({ data: safe });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;