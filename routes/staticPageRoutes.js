const express = require("express");
const router = express.Router();
const {
  getPageBySlug,
  updatePageBySlug,
} = require("../controllers/staticPageController");

// PUBLIC (frontend)
router.get("/:slug", getPageBySlug);

// ADMIN (backend)
router.put("/:slug", updatePageBySlug);

module.exports = router;
