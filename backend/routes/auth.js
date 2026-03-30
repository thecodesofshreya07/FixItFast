// ─── routes/auth.js ───────────────────────────────────────────────────────────
// POST /register  → INSERT into Customer
// POST /login     → SELECT from Customer, verify bcrypt password

const express = require("express");
const bcrypt  = require("bcryptjs");
const pool    = require("../db");

const router = express.Router();

// ── POST /register ────────────────────────────────────────────────────────────
// Body: { Customer_name, Address, Contact, Password }
// Returns the new customer row (without Password)
router.post("/register", async (req, res) => {
  const { Customer_name, Address, Contact, Password } = req.body;

  // Basic validation
  if (!Customer_name || !Address || !Contact || !Password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!/^\d{10}$/.test(Contact)) {
    return res.status(400).json({ error: "Enter a valid 10-digit contact number." });
  }
  if (Password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check for duplicate contact number
    const [existing] = await pool.query(
      "SELECT Customer_Id FROM Customer WHERE contact = ?",
      [Contact]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this contact number already exists." });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insert new customer — let MySQL AUTO_INCREMENT handle the ID
    const [result] = await pool.query(
      "INSERT INTO Customer (Customer_name, Address, contact, Password) VALUES (?, ?, ?, ?)",
      [Customer_name, Address, Contact, hashedPassword]
    );

    const newCustomerId = result.insertId;

    return res.status(201).json({
      data: {
        Customer_Id:   newCustomerId,
        Customer_name,
        Address,
        Contact,
      },
    });
  } catch (err) {
    console.error("POST /register error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ── POST /login ───────────────────────────────────────────────────────────────
// Body: { Contact, Password }
// Returns the customer row (without Password) on success
router.post("/login", async (req, res) => {
  const { Contact, Password } = req.body;

  if (!Contact || !Password) {
    return res.status(400).json({ error: "Contact and password are required." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Customer WHERE contact = ?",
      [Contact]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid contact number or password." });
    }

    const customer = rows[0];

    // Compare submitted password against stored bcrypt hash
    const match = await bcrypt.compare(Password, customer.Password);
    if (!match) {
      return res.status(401).json({ error: "Invalid contact number or password." });
    }

    // Return safe customer object (never send the password hash back)
    const { Password: _, ...safe } = customer;
    return res.json({ data: safe });
  } catch (err) {
    console.error("POST /login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
