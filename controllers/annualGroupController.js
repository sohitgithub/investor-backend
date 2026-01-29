const db = require('../db');

exports.getAllResults = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM annual_group_results';
        let params = [];

        if (search) {
            query += ' WHERE financial_year LIKE ? OR document_type LIKE ? OR status LIKE ?';
            const searchParam = `%${search}%`;
            params = [searchParam, searchParam, searchParam];
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.createResult = async (req, res) => {
    try {
        const { financialYear, documentType, status } = req.body;
        const pdfPath = req.file ? req.file.filename : null;

        if (!financialYear || !documentType) {
             return res.status(400).json({ error: "Missing required fields" });
        }

        const [result] = await db.query(
            'INSERT INTO annual_group_results (financial_year, document_type, status, pdf_path) VALUES (?, ?, ?, ?)',
            [financialYear, documentType, status || 'Draft', pdfPath]
        );
        res.json({ message: "Created successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create result" });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const resultId = req.params.id;
        const { financialYear, documentType, status } = req.body;
        
        let query = 'UPDATE annual_group_results SET financial_year=?, document_type=?, status=?';
        let params = [financialYear, documentType, status];

        if (req.file) {
            query += ', pdf_path=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(resultId);

        await db.query(query, params);
        res.json({ message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update result" });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        await db.query('DELETE FROM annual_group_results WHERE id = ?', [req.params.id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete result" });
    }
};