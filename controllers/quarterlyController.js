const db = require('../db');

// --- PUBLIC: Get Only Published Results ---
exports.getPublicResults = async (req, res) => {
    try {
        // Only fetch status = 'Published'
        const query = `
            SELECT *, CONCAT(financial_year, ' ', quarter, ' - ', document_type) as generated_title 
            FROM quarterly_results 
            WHERE status = 'Published' 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// --- ADMIN: Get All Results ---
exports.getAllResults = async (req, res) => {
    try {
        const { search } = req.query;
        let query = `SELECT *, CONCAT(financial_year, ' ', quarter, ' - ', document_type) as generated_title FROM quarterly_results`;
        let params = [];
        if (search) {
            query += ` WHERE financial_year LIKE ? OR quarter LIKE ? OR document_type LIKE ? OR status LIKE ?`;
            const searchParam = `%${search}%`;
            params = [searchParam, searchParam, searchParam, searchParam];
        }
        query += ` ORDER BY created_at DESC`;
        
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};

// --- ADMIN: Create Result ---
exports.createResult = async (req, res) => {
    try {
        const { financialYear, quarter, documentType, status } = req.body;
        const pdfPath = req.file ? req.file.filename : null;

        if (!financialYear || !quarter || !documentType) {
             return res.status(400).json({ error: "Missing required fields" });
        }

        const [result] = await db.query(
            'INSERT INTO quarterly_results (financial_year, quarter, document_type, pdf_path, status) VALUES (?, ?, ?, ?, ?)',
            [financialYear, quarter, documentType, pdfPath, status || 'Draft']
        );
        res.json({ message: "Result created successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create result" });
    }
};

// --- ADMIN: Update Result ---
exports.updateResult = async (req, res) => {
     try {
        const resultId = req.params.id;
        const { financialYear, quarter, documentType, status } = req.body;
        
        let query = 'UPDATE quarterly_results SET financial_year=?, quarter=?, document_type=?, status=?';
        let params = [financialYear, quarter, documentType, status];

        if (req.file) {
            query += ', pdf_path=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(resultId);

        await db.query(query, params);
        res.json({ message: "Result updated successfully" });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Failed to update result" });
    }
};

// --- ADMIN: Delete Result ---
exports.deleteResult = async (req, res) => {
    try {
        await db.query('DELETE FROM quarterly_results WHERE id = ?', [req.params.id]);
        res.json({ message: "Result deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete result" });
    }
};