const express = require('express');
const router = express.Router();
const multer = require('multer');
const policyController = require('../controllers/policyController');

// --------- MULTER (PDF UPLOAD) ----------
const storage = multer.diskStorage({
  destination: 'uploads/policies',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// --------- PUBLIC API (FRONTEND) ----------
router.get('/', policyController.getAllPolicies);
router.get('/public', policyController.getAllPolicies);

// --------- ADMIN APIs ----------
router.post('/', upload.single('pdf'), policyController.createPolicy);
router.put('/:id', upload.single('pdf'), policyController.updatePolicy);
router.delete('/:id', policyController.deletePolicy);

module.exports = router;
