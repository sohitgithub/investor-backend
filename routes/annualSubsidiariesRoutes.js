const express = require('express');
const router = express.Router();
const controller = require('../controllers/annualSubsidiariesController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/public', controller.getPublicResults); // ✅ Public
router.get('/', verifyToken, controller.getAllResults);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createResult);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updateResult);
router.delete('/:id', verifyToken, controller.deleteResult);

module.exports = router;