const express = require('express');
const router = express.Router();
const controller = require('../controllers/industryReportController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Industry Report Routes Loaded");

// Public Route
router.get('/public', controller.getAllReports);

// Admin Routes
router.get('/', verifyToken, controller.getAllReports);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createReport);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updateReport);
router.delete('/:id', verifyToken, controller.deleteReport);

module.exports = router;