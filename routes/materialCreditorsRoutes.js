const express = require('express');
const router = express.Router();
const controller = require('../controllers/materialCreditorsController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Material Creditors Routes Loaded");

// Public Route
router.get('/public', controller.getAllDocuments);

// Admin Routes
router.get('/', verifyToken, controller.getAllDocuments);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createDocument);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updateDocument);
router.delete('/:id', verifyToken, controller.deleteDocument);

module.exports = router;