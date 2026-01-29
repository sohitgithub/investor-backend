const db = require('../db');

// 1. GET ALL
exports.getAllMembers = async (req, res) => {
    try {
        const query = 'SELECT * FROM committee_members ORDER BY committee_name, role ASC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

// 2. CREATE
exports.createMember = async (req, res) => {
    try {
        const { committee_name, member_name, designation, role } = req.body; // Added role

        if (!committee_name || !member_name || !designation || !role) {
             return res.status(400).json({ error: "All fields are required" });
        }

        const [result] = await db.query(
            'INSERT INTO committee_members (committee_name, member_name, designation, role) VALUES (?, ?, ?, ?)',
            [committee_name, member_name, designation, role]
        );
        res.json({ message: "Member added successfully", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add member" });
    }
};

// 3. UPDATE
exports.updateMember = async (req, res) => {
    try {
        const id = req.params.id;
        const { committee_name, member_name, designation, role } = req.body; // Added role

        const query = 'UPDATE committee_members SET committee_name=?, member_name=?, designation=?, role=? WHERE id=?';
        
        await db.query(query, [committee_name, member_name, designation, role, id]);
        res.json({ message: "Member updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update member" });
    }
};

// 4. DELETE (No changes needed)
exports.deleteMember = async (req, res) => {
    try {
        await db.query('DELETE FROM committee_members WHERE id = ?', [req.params.id]);
        res.json({ message: "Member deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete member" });
    }
};