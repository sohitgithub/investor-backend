const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

// MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ROUTES
router.get("/", getAnnouncements);
router.post("/", upload.single("pdf"), createAnnouncement);
router.put("/:id", upload.single("pdf"), updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
