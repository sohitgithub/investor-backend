const db = require('../db');

// 1. GET ALL
exports.getAllPatterns = async (req, res) => {
    try {
        const query = 'SELECT * FROM shareholding_patterns ORDER BY created_at DESC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// 2. CREATE
exports.createPattern = async (req, res) => {
    try {
        const { title } = req.body;
        const pdfPath = req.file ? req.file.filename : null;

        if (!title || !pdfPath) {
             return res.status(400).json({ error: "Title and File are required" });
        }

        const [result] = await db.query(
            'INSERT INTO shareholding_patterns (title, pdf_path) VALUES (?, ?)',
            [title, pdfPath]
        );
        res.json({ message: "Shareholding Pattern added successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add pattern" });
    }
};

// 3. UPDATE
exports.updatePattern = async (req, res) => {
    try {
        const id = req.params.id;
        const { title } = req.body;
        
        let query = 'UPDATE shareholding_patterns SET title=?';
        let params = [title];

        if (req.file) {
            query += ', pdf_path=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update pattern" });
    }
};

// 4. DELETE
exports.deletePattern = async (req, res) => {
    try {
        await db.query('DELETE FROM shareholding_patterns WHERE id = ?', [req.params.id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete pattern" });
    }
};