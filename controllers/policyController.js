const db = require('../db');

// 1. GET ALL
exports.getAllPolicies = async (req, res) => {
    try {
        const query = 'SELECT * FROM policies ORDER BY created_at DESC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// 2. CREATE (Upload PDF)
exports.createPolicy = async (req, res) => {
    try {
        const { title } = req.body;
        const pdfPath = req.file ? req.file.filename : null;

        if (!title || !pdfPath) {
             return res.status(400).json({ error: "Title and PDF file are required" });
        }

        const [result] = await db.query(
            'INSERT INTO policies (title, pdf_path) VALUES (?, ?)',
            [title, pdfPath]
        );
        res.json({ message: "Policy added successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add policy" });
    }
};

// 3. UPDATE (Edit Title or File)
exports.updatePolicy = async (req, res) => {
    try {
        const id = req.params.id;
        const { title } = req.body;
        
        let query = 'UPDATE policies SET title=?';
        let params = [title];

        if (req.file) {
            query += ', pdf_path=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Policy updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update policy" });
    }
};

// 4. DELETE
exports.deletePolicy = async (req, res) => {
    try {
        await db.query('DELETE FROM policies WHERE id = ?', [req.params.id]);
        res.json({ message: "Policy deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete policy" });
    }
};