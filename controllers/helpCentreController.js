const db = require("../db");

// GET Help Centre (Frontend)
exports.getHelpCentre = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT content FROM help_centre ORDER BY id DESC LIMIT 1"
    );

    if (!rows.length) {
      return res.json({ cards: [], faqs: [] });
    }

    res.json(JSON.parse(rows[0].content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load Help Centre" });
  }
};

// SAVE Help Centre (Admin)
exports.saveHelpCentre = async (req, res) => {
  try {
    const data = req.body;

    await db.query(
      "INSERT INTO help_centre (content) VALUES (?)",
      [JSON.stringify(data)]
    );

    res.json({ message: "Help Centre saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
};
