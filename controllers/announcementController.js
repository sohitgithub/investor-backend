const db = require("../db");

// GET ALL
exports.getAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM announcements ORDER BY announcement_date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET ANNOUNCEMENTS:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// CREATE
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, category, year, announcement_date } = req.body;

    if (!title || !category || !year || !announcement_date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const pdf_url = req.file ? `/uploads/${req.file.filename}` : null;

    await db.query(
      `INSERT INTO announcements 
       (title, category, year, pdf_url, announcement_date)
       VALUES (?, ?, ?, ?, ?)`,
      [title, category, year, pdf_url, announcement_date]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("CREATE ANNOUNCEMENT:", err);
    res.status(500).json({ message: "Save failed" });
  }
};

// UPDATE
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, category, year, announcement_date } = req.body;
    const { id } = req.params;

    let sql = `
      UPDATE announcements
      SET title=?, category=?, year=?, announcement_date=?
    `;
    const params = [title, category, year, announcement_date];

    if (req.file) {
      sql += `, pdf_url=?`;
      params.push(`/uploads/${req.file.filename}`);
    }

    sql += ` WHERE id=?`;
    params.push(id);

    await db.query(sql, params);
    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ANNOUNCEMENT:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE
exports.deleteAnnouncement = async (req, res) => {
  try {
    await db.query("DELETE FROM announcements WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ANNOUNCEMENT:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
