const express = require("express");
const router = express.Router();
const sendOtpEmail = require("../utils/sendOtp");
const bcrypt = require("bcryptjs");

const otpStore = new Map();

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN = 60 * 1000;
const Customer = require("../models/Customer");

setInterval(() => {
    const now = Date.now();
    for (const [key, value] of otpStore.entries()) {
        if (value.expiresAt < now) {
            otpStore.delete(key);
        }
    }
}, 60 * 1000);

router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const normalizedEmail = email.toLowerCase().trim();

        // 1️⃣ CHECK IF USER ALREADY EXISTS (IMPORTANT FIX)
        const existingUser = await Customer.findOne({
            Email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                error: "User already registered. Please login instead."
            });
        }

        // 2️⃣ OTP cooldown check
        const existingOtp = otpStore.get(normalizedEmail);

        if (existingOtp && Date.now() - existingOtp.lastSent < RESEND_COOLDOWN) {
            return res.status(429).json({
                error: "Please wait before requesting another OTP"
            });
        }

        // 3️⃣ Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore.set(normalizedEmail, {
            otp,
            expiresAt: Date.now() + OTP_EXPIRY_TIME,
            attempts: 0,
            lastSent: Date.now(),
        });

        // 4️⃣ Send email
        await sendOtpEmail(email, otp);

        return res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to send OTP"
        });
    }
});

router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const key = email.toLowerCase().trim();
    const record = otpStore.get(key);
    if (!record) {
        return res.status(400).json({
            error: "OTP expired or not found",
        });
    }
    if (Date.now() > record.expiresAt) {
        otpStore.delete(key);
        return res.status(400).json({
            error: "OTP expired",
        });
    }
    if (String(record.otp) !== String(otp)) {
        record.attempts += 1;

        if (record.attempts >= MAX_ATTEMPTS) {
            otpStore.delete(key);
            return res.status(429).json({
                error: "Too many attempts. OTP blocked.",
            });
        }

        otpStore.set(key, record);

        return res.status(400).json({
            error: "Invalid OTP",
        });
    }

    // ✅ success
    otpStore.delete(key);

    return res.json({
        success: true,
        verified: true,
    });
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const user = await Customer.findOne({
            Email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const key = email.toLowerCase().trim();
        otpStore.set(key, {
            otp,
            expiresAt: Date.now() + OTP_EXPIRY_TIME,
            attempts: 0,
            lastSent: Date.now()
        });
        await sendOtpEmail(email, otp);

        res.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to send OTP",
        });
    }
});

router.post("/reset-password", async (req, res) => {

    try {

        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }
        const key = email.toLowerCase().trim();
        const user = await Customer.findOne({ Email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const record = otpStore.get(key);
        if (!record) {
            return res.status(400).json({ error: "OTP expired or not requested" });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(key);
            return res.status(400).json({ error: "OTP expired" });
        }

        if (String(record.otp) !== String(otp)) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await Customer.updateOne(
            { Email: email.toLowerCase() },
            {
                $set: {
                    Password: hashedPassword,
                },
            }
        );
        // REMOVE OTP
        otpStore.delete(key);
        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to reset password",
        });
    }
});

module.exports = router;