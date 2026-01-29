const express = require('express');
const router = express.Router();
const controller = require('../controllers/disclosureController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Disclosure Routes Loaded");

// Public Route
router.get('/public', controller.getAllDisclosures);

// Admin Routes
router.get('/', verifyToken, controller.getAllDisclosures);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createDisclosure);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updateDisclosure);
router.delete('/:id', verifyToken, controller.deleteDisclosure);

module.exports = router;