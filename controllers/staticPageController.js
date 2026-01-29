exports.updatePageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    if (!slug || !title || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      `
      INSERT INTO static_pages (slug, title, content)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        content = VALUES(content)
      `,
      [slug, title, content]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("STATIC PAGE SAVE ERROR:", err);
    res.status(500).json({ message: "Save failed" });
  }
};
