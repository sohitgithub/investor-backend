const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const db = require("../db");

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/press";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= GET ================= */

router.get("/", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM press ORDER BY created_at DESC"
  );
  res.json(rows);
});

/* ================= CREATE ================= */

router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, type } = req.body;

      if (!title || !type) {
        return res.status(400).json({ message: "Missing fields" });
      }

      /* ---------- VALUE (CRITICAL FIX) ---------- */
      let value = "";

      // PDF / Video → from uploaded file
      if (req.files?.file?.length) {
        value = `/uploads/press/${req.files.file[0].filename}`;
      }
      // YouTube / Link → from text input
      else if (req.body.value) {
        value = req.body.value;
      } else {
        return res.status(400).json({ message: "Value required" });
      }

      /* ---------- LOGO ---------- */
      const logo = req.files?.logo?.length
        ? `/uploads/press/${req.files.logo[0].filename}`
        : null;

      await db.query(
        "INSERT INTO press (title, type, value, logo) VALUES (?, ?, ?, ?)",
        [title, type, value, logo]
      );

      res.json({ message: "Press item created" });
    } catch (err) {
      console.error("PRESS INSERT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= DELETE ================= */

router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM press WHERE id = ?", [req.params.id]);
  res.json({ message: "Deleted" });
});

module.exports = router;
