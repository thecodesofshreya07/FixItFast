const express = require("express");

const Service = require("../models/Service");
const Professional = require("../models/Professional");

const router = express.Router();

// // same metadata (unchanged)
const SERVICE_META = {
  "Plumbing": { icon: "🔧", description: "Fix leaks, clogs, pipe repairs & installations" },
  "Electrical": { icon: "⚡", description: "Wiring, switchboards, fan & fixture fitting" },
  "Cleaning": { icon: "🧹", description: "Deep home cleaning, bathroom & kitchen scrub" },
  "AC Repair": { icon: "❄️", description: "AC servicing, gas refill & cooling issues" },
  "Carpentry": { icon: "🪚", description: "Furniture repair, door hinges & custom work" },
  "Painting": { icon: "🎨", description: "Interior/exterior painting & touch-ups" },
  "Pest Control": { icon: "🐛", description: "Pest removal: Cockroach, termite & rodent treatment" },
  "Appliance Repair": { icon: "🔌", description: "Appliance fixing: Washing machine, refrigerator & microwave fix" },
  "Water Purifier Service": { icon: "💧", description: "RO/UV installation, purifier cleaning & filter change" },
  "Home Sanitization": { icon: "🧴", description: "Full home disinfection & sanitization spray" },
  "Laptop Repair": {
    icon: "💻",
    description: "Screen replacement, keyboard repair & software troubleshooting"
  },

  "CCTV Installation": {
    icon: "📷",
    description: "Security camera setup, DVR installation & maintenance"
  },

  "Gardening": {
    icon: "🌿",
    description: "Lawn care, plant maintenance & garden beautification"
  },

  "Sofa Cleaning": {
    icon: "🛋️",
    description: "Deep sofa shampooing & stain removal service"
  },

  "Curtain Cleaning": {
    icon: "🪟",
    description: "Dust removal, steam wash & fabric care for curtains"
  },

  "Bathroom Cleaning": {
    icon: "🚿",
    description: "Tile scrubbing, stain removal & bathroom sanitization"
  },

  "Tile & Marble Polishing": {
    icon: "✨",
    description: "Floor polishing, scratch removal & shine restoration"
  },

  "Internet & WiFi Setup": {
    icon: "📶",
    description: "Router setup, WiFi optimization & network troubleshooting"
  }
};


// ── GET /getServices ─────────────────────────
router.get("/getServices", async (req, res) => {
  try {
    const services = await Service.find().sort({ Service_Id: 1 });
    // console.log(services);
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
    const professionals = await Professional.find().sort({ Professional_Id: 1 });
    // console.log("DB Professionals:", professionals);
    res.json({ data: professionals });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch professionals" });
  }
});

module.exports = router;