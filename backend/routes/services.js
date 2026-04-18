const express = require("express");

const Service = require("../models/Service");
const Professional = require("../models/Professional");

const router = express.Router();


// same metadata (unchanged)
const SERVICE_META = {
  "Plumbing": { icon: "🔧", description: "Fix leaks, clogs, pipe repairs & installations" },
  "Electrical": { icon: "⚡", description: "Wiring, switchboards, fan & fixture fitting" },
  "Cleaning": { icon: "🧹", description: "Deep home cleaning" },
  "AC Repair": { icon: "❄️", description: "AC servicing" },
  "Carpentry": { icon: "🪚", description: "Furniture repair" },
  "Painting": { icon: "🎨", description: "Painting services" },
  "Pest Control": { icon: "🐛", description: "Pest removal" },
  "Appliance Repair": { icon: "🔌", description: "Appliance fixing" },
  "Water Purifier Service": { icon: "💧", description: "RO service" },
  "Home Sanitization": { icon: "🧴", description: "Sanitization" }
};


// ── GET /getServices ─────────────────────────
router.get("/getServices", async (req, res) => {
  try {
    const services = await Service.find().sort({ Service_Id: 1 });

    const enriched = services.map(s => ({
      ...s.toObject(),
      icon: SERVICE_META[s.Service_type]?.icon || "🔧",
      description: SERVICE_META[s.Service_type]?.description || ""
    }));

    res.json({ data: enriched });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});


// ── GET /getProfessionals ─────────────────────
router.get("/getProfessionals", async (req, res) => {
  try {
    const professionals = await Professional.find()
      .sort({ Professional_Id: 1 });

    res.json({ data: professionals });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch professionals" });
  }
});

module.exports = router;