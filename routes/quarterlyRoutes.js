const express = require('express');
const router = express.Router();
const quarterlyController = require('../controllers/quarterlyController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Quarterly Routes Loaded...");

// --- Public Route (No Token Required) ---
router.get('/public', quarterlyController.getPublicResults); 

// --- Admin Routes (Token Required) ---
router.get('/', verifyToken, quarterlyController.getAllResults);
router.post('/', verifyToken, upload.single('pdfFile'), quarterlyController.createResult);
router.put('/:id', verifyToken, upload.single('pdfFile'), quarterlyController.updateResult);
router.delete('/:id', verifyToken, quarterlyController.deleteResult);

module.exports = router;