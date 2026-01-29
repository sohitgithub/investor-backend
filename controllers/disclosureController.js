const db = require('../db');

// 1. GET ALL
exports.getAllDisclosures = async (req, res) => {
    try {
        const query = 'SELECT * FROM disclosures ORDER BY created_at DESC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// 2. CREATE (Supports PDF Upload OR Link)
exports.createDisclosure = async (req, res) => {
    try {
        const { title, link } = req.body;
        let finalLink = link;
        let isPdf = false;

        // If file uploaded, use filename as link
        if (req.file) {
            finalLink = req.file.filename;
            isPdf = true;
        }

        if (!title) {
             return res.status(400).json({ error: "Title is required" });
        }

        const [result] = await db.query(
            'INSERT INTO disclosures (title, link, is_pdf) VALUES (?, ?, ?)',
            [title, finalLink, isPdf]
        );
        res.json({ message: "Disclosure added successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add disclosure" });
    }
};

// 3. UPDATE
exports.updateDisclosure = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, link } = req.body;
        
        let query = 'UPDATE disclosures SET title=?';
        let params = [title];

        // Logic: If file uploaded -> update link & set is_pdf=1
        // If link provided -> update link & set is_pdf=0
        // If neither -> keep existing
        if (req.file) {
            query += ', link=?, is_pdf=?';
            params.push(req.file.filename, true);
        } else if (link) {
            query += ', link=?, is_pdf=?';
            params.push(link, false);
        }

        query += ' WHERE id=?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Disclosure updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update disclosure" });
    }
};

// 4. DELETE
exports.deleteDisclosure = async (req, res) => {
    try {
        await db.query('DELETE FROM disclosures WHERE id = ?', [req.params.id]);
        res.json({ message: "Disclosure deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete disclosure" });
    }
};