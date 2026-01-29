const express = require("express");
const {
  getPageBySlug,
  savePageBySlug
} = require("../controllers/pageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/:slug", getPageBySlug);

// ADMIN
router.put("/admin/:slug", authMiddleware, savePageBySlug);

module.exports = router;
