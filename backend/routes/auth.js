const express = require("express");
const bcrypt  = require("bcryptjs");
const Customer = require("../models/Customer");

const router = express.Router();


// ── POST /register ─────────────────────────────────────────
router.post("/register", async (req, res) => {

  const {
    Customer_name,
    Address,
    Email,
    Password
  } = req.body;


  // Validation
  if (!Customer_name || !Address || !Email || !Password) {
    return res.status(400).json({
      error: "All fields are required."
    });
  }

  if (Password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters."
    });
  }

  try {
    // Check existing email
    const existingEmail = await Customer.findOne({
      Email: Email.toLowerCase()
    });

    if (existingEmail) {
      return res.status(409).json({
        error: "Email already registered."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user
    const newCustomer = new Customer({
      Customer_Id: Date.now(),
      Customer_name,
      Address,
      Email: Email.toLowerCase(),
      Password: hashedPassword
    });

    await newCustomer.save();

    return res.status(201).json({
      data: {
        Customer_Id: newCustomer.Customer_Id,
        Customer_name: newCustomer.Customer_name,
        Address: newCustomer.Address,
        Email: newCustomer.Email
      }
    });

  } catch (err) {

    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});


// ── POST /login ─────────────────────────────────────────
// ── POST /login ─────────────────────────────────────────
router.post("/login", async (req, res) => {

  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({
      error: "Email and password are required."
    });
  }

  try {

    // Find customer by email
    const customer = await Customer.findOne({
      Email: Email.toLowerCase()
    });

    if (!customer) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    // Compare password
    const match = await bcrypt.compare(
      Password,
      customer.Password
    );

    if (!match) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    // Remove password before sending
    const { Password: _, ...safe } = customer.toObject();

    return res.json({
      data: safe
    });

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: "Server error. Please try again."
    });
  }
});
module.exports = router;