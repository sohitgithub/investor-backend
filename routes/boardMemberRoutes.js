const express = require('express');
const router = express.Router();
const controller = require('../controllers/boardMemberController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Board Member Routes Loaded");

// --- PUBLIC ROUTES (No Login Required) ---
router.get('/public', controller.getAllMembers); // List ke liye
router.get('/public/:slug', controller.getMemberBySlug); // ✅ Single Page ke liye (Ye zaroori hai)

// --- ADMIN ROUTES (Login Required) ---
router.get('/', verifyToken, controller.getAllMembers);
router.post('/', verifyToken, upload.single('imageFile'), controller.createMember);
router.put('/:id', verifyToken, upload.single('imageFile'), controller.updateMember);
router.delete('/:id', verifyToken, controller.deleteMember);

module.exports = router;