const express = require('express');
const router = express.Router();
const controller = require('../controllers/shareholdingPatternController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Shareholding Pattern Routes Loaded");

// Public Route
router.get('/public', controller.getAllPatterns);

// Admin Routes
router.get('/', verifyToken, controller.getAllPatterns);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createPattern);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updatePattern);
router.delete('/:id', verifyToken, controller.deletePattern);

module.exports = router;