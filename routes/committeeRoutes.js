const express = require('express');
const router = express.Router();
const controller = require('../controllers/committeeController');
const verifyToken = require('../middleware/authMiddleware');

console.log(">>> ✅ Committee Routes Loaded");

// Public Route
router.get('/public', controller.getAllMembers);

// Admin Routes
router.get('/', verifyToken, controller.getAllMembers);
router.post('/', verifyToken, controller.createMember);
router.put('/:id', verifyToken, controller.updateMember);
router.delete('/:id', verifyToken, controller.deleteMember);

module.exports = router;