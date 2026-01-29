const db = require("../db");
const sanitizeHtml = require("sanitize-html");

// =======================
// GET PAGE (FRONTEND)
// =======================
exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      "SELECT title, content FROM pages WHERE slug = ?",
      [slug]
    );

    // CMS-safe: never 404
    if (!rows.length) {
      return res.json({ title: "", content: "" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("GET PAGE ERROR:", err);
    return res.status(500).json({ message: "Failed to load page" });
  }
};

// =======================
// SAVE PAGE (ADMIN)
// =======================
exports.savePageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let { title, content } = req.body;

    title = (title || "").trim();
    content = (content || "").trim();

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content || content === "<p><br></p>") {
      return res.status(400).json({ message: "Content is required" });
    }

const cleanContent = sanitizeHtml(content, {
  allowedTags: [
    "h1", "h2", "h3",
    "p", "br",
    "ul", "ol", "li",
    "strong", "em", "b", "i",
    "a", "span", "div"
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    "*": ["class"]
  },
  allowedSchemes: ["http", "https", "mailto"]
});




    const sql = `
      INSERT INTO pages (slug, title, content)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        content = VALUES(content),
        updated_at = NOW()
    `;

    await db.query(sql, [slug, title, cleanContent]);

    return res.json({ success: true, message: "Saved successfully" });

  } catch (err) {
    console.error("SAVE PAGE ERROR:", err);
    return res.status(500).json({ message: "Save failed" });
  }
};
