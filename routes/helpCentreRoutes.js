const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getHelpCentre,
  saveHelpCentre,
} = require("../controllers/helpCentreController");

// ✅ FRONTEND (PUBLIC)
router.get("/", getHelpCentre);

// ✅ ADMIN (PROTECTED)
router.put("/", authMiddleware, saveHelpCentre);

module.exports = router;
