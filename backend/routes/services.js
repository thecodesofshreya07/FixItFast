// ─── routes/services.js ───────────────────────────────────────────────────────
// GET /getServices      → SELECT all from Service
// GET /getProfessionals → SELECT all from Professional

const express = require("express");
const pool    = require("../db");

const router = express.Router();

// Emoji + description map for services (not stored in DB, enriched here)
const SERVICE_META = {
  "Plumbing":               { icon: "🔧", description: "Fix leaks, clogs, pipe repairs & installations" },
  "Electrical":             { icon: "⚡", description: "Wiring, switchboards, fan & fixture fitting" },
  "Cleaning":               { icon: "🧹", description: "Deep home cleaning, bathroom & kitchen scrub" },
  "AC Repair":              { icon: "❄️", description: "AC servicing, gas refill & cooling issues" },
  "Carpentry":              { icon: "🪚", description: "Furniture repair, door hinges & custom work" },
  "Painting":               { icon: "🎨", description: "Interior/exterior painting & touch-ups" },
  "Pest Control":           { icon: "🐛", description: "Cockroach, termite & rodent treatment" },
  "Appliance Repair":       { icon: "🔌", description: "Washing machine, refrigerator & microwave fix" },
  "Water Purifier Service": { icon: "💧", description: "RO/UV purifier cleaning & filter change" },
  "Home Sanitization":      { icon: "🧴", description: "Full home disinfection & sanitization spray" },
};

// Skill → Professional_Id mapping (matches your DB insert data)
const SKILL_TO_PROFESSIONAL = {
  "Plumbing":               101,
  "Electrical":             102,
  "Cleaning":               103,
  "AC Repair":              104,
  "Carpentry":              105,
  "Painting":               106,
  "Pest Control":           107,
  "Appliance Repair":       108,
  "Water Purifier Service": 109,
  "Home Sanitization":      110,
};

// Hardcoded ratings (not in DB schema — can be moved to DB later)
const PROFESSIONAL_RATINGS = {
  101: 4.8, 102: 4.7, 103: 4.9, 104: 4.6, 105: 4.8,
  106: 4.7, 107: 4.5, 108: 4.8, 109: 4.6, 110: 4.9,
};

// ── GET /getServices ─────────────────────────────────────────────────────────
router.get("/getServices", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT Service_Id, Service_type, Service_charge FROM Service ORDER BY Service_Id"
    );

    // Enrich each service with icon, description, and Professional_Id
    const enriched = rows.map(s => ({
      ...s,
      icon:          SERVICE_META[s.Service_type]?.icon        || "🔧",
      description:   SERVICE_META[s.Service_type]?.description || "",
      Professional_Id: SKILL_TO_PROFESSIONAL[s.Service_type]  || null,
    }));

    return res.json({ data: enriched });
  } catch (err) {
    console.error("GET /getServices error:", err);
    return res.status(500).json({ error: "Failed to fetch services." });
  }
});

// ── GET /getProfessionals ────────────────────────────────────────────────────
router.get("/getProfessionals", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT Professional_Id, Professional_name, Skill, Contact FROM Professional ORDER BY Professional_Id"
    );

    const enriched = rows.map(p => ({
      ...p,
      Rating: PROFESSIONAL_RATINGS[p.Professional_Id] || 4.5,
    }));

    return res.json({ data: enriched });
  } catch (err) {
    console.error("GET /getProfessionals error:", err);
    return res.status(500).json({ error: "Failed to fetch professionals." });
  }
});

module.exports = router;
