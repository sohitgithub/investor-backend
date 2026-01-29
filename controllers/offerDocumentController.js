const db = require('../db');

// 1. GET ALL
exports.getAllDocuments = async (req, res) => {
    try {
        const query = 'SELECT * FROM offer_documents ORDER BY created_at DESC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// 2. CREATE
exports.createDocument = async (req, res) => {
    try {
        const { title, link } = req.body;
        const pdfPath = req.file ? req.file.filename : null;

        // Either a file OR a link must be present
        if (!title || (!pdfPath && !link)) {
             return res.status(400).json({ error: "Title and File/Link are required" });
        }

        const [result] = await db.query(
            'INSERT INTO offer_documents (title, pdf_path, link) VALUES (?, ?, ?)',
            [title, pdfPath, link || null]
        );
        res.json({ message: "Document added successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add document" });
    }
};

// 3. UPDATE
exports.updateDocument = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, link } = req.body;
        
        let query = 'UPDATE offer_documents SET title=?, link=?';
        let params = [title, link || null];

        // If new file is uploaded, update path
        if (req.file) {
            query += ', pdf_path=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Document updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update document" });
    }
};

// 4. DELETE
exports.deleteDocument = async (req, res) => {
    try {
        await db.query('DELETE FROM offer_documents WHERE id = ?', [req.params.id]);
        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete document" });
    }
};