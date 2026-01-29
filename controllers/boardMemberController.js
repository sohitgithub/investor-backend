const db = require('../db');

// Helper to create slug (URL friendly name)
const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Special chars remove
        .replace(/^-+|-+$/g, '');    // Trim dashes
};

// 1. GET ALL (For List Page)
exports.getAllMembers = async (req, res) => {
    try {
        const query = 'SELECT * FROM board_members ORDER BY created_at ASC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// ✅ 2. GET SINGLE MEMBER (Ye function missing tha ya purana tha)
exports.getMemberBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Database se slug match karke data layenge
        const query = 'SELECT * FROM board_members WHERE slug = ?';
        const [rows] = await db.query(query, [slug]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.json(rows[0]); // Pehla result bhej do
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// 3. CREATE
exports.createMember = async (req, res) => {
    try {
        const { name, designation, status, bio } = req.body;
        const imagePath = req.file ? req.file.filename : null;
        
        if (!name || !designation) {
             return res.status(400).json({ error: "Name and Designation are required" });
        }

        const slug = createSlug(name);

        const [result] = await db.query(
            'INSERT INTO board_members (name, designation, image_path, slug, status, bio) VALUES (?, ?, ?, ?, ?, ?)',
            [name, designation, imagePath, slug, status || 'Active', bio || '']
        );
        res.json({ message: "Member added successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add member" });
    }
};

// 4. UPDATE
exports.updateMember = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, designation, status, bio } = req.body;
        
        const slug = createSlug(name);

        let query = 'UPDATE board_members SET name=?, designation=?, slug=?, status=?, bio=?';
        let params = [name, designation, slug, status, bio];

        if (req.file) {
            query += ', image_path=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Member updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update member" });
    }
};

// 5. DELETE
exports.deleteMember = async (req, res) => {
    try {
        await db.query('DELETE FROM board_members WHERE id = ?', [req.params.id]);
        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete member" });
    }
};