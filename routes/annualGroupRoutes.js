const express = require('express');
const router = express.Router();
const controller = require('../controllers/annualGroupController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log(">>> ✅ Annual Group Routes Loaded");

router.get('/', verifyToken, controller.getAllResults);
router.post('/', verifyToken, upload.single('pdfFile'), controller.createResult);
router.put('/:id', verifyToken, upload.single('pdfFile'), controller.updateResult);
router.delete('/:id', verifyToken, controller.deleteResult);

module.exports = router;