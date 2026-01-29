const db = require('../db');

// --- PUBLIC: Get Only Published ---
exports.getPublicResults = async (req, res) => {
    try {
        const query = "SELECT * FROM annual_company_results WHERE status = 'Published' ORDER BY financial_year DESC";
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};

// --- ADMIN: Get All ---
exports.getAllResults = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM annual_company_results';
        let params = [];
        if (search) {
            query += ' WHERE financial_year LIKE ? OR document_type LIKE ?';
            params = [`%${search}%`, `%${search}%`];
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};

// --- ADMIN: Create ---
exports.createResult = async (req, res) => {
    try {
        const { financialYear, documentType, status } = req.body;
        const pdfPath = req.file ? req.file.filename : null;
        if (!financialYear || !documentType) return res.status(400).json({ error: "Missing fields" });

        const [result] = await db.query(
            'INSERT INTO annual_company_results (financial_year, document_type, status, pdf_path) VALUES (?, ?, ?, ?)',
            [financialYear, documentType, status || 'Draft', pdfPath]
        );
        res.json({ message: "Created", id: result.insertId });
    } catch (err) { res.status(500).json({ error: "Error creating" }); }
};

// --- ADMIN: Update ---
exports.updateResult = async (req, res) => {
    try {
        const { financialYear, documentType, status } = req.body;
        let query = 'UPDATE annual_company_results SET financial_year=?, document_type=?, status=?';
        let params = [financialYear, documentType, status];
        if (req.file) { query += ', pdf_path=?'; params.push(req.file.filename); }
        query += ' WHERE id=?'; params.push(req.params.id);
        await db.query(query, params);
        res.json({ message: "Updated" });
    } catch (err) { res.status(500).json({ error: "Error updating" }); }
};

// --- ADMIN: Delete ---
exports.deleteResult = async (req, res) => {
    try {
        await db.query('DELETE FROM annual_company_results WHERE id = ?', [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Error deleting" }); }
};