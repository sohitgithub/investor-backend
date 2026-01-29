const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Filename clean karke timestamp add karte hain taaki unique rahe
    const cleanName = file.originalname.replace(/\s+/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(cleanName));
  }
});

const fileFilter = (req, file, cb) => {
    // ✅ Updated Regex to include Videos (mp4, webm, ogg, mov, avi) along with Images & PDF
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|mp4|webm|ogg|mov|avi/;
    
    // Check extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        // Log error for debugging
        console.error("❌ Multer Rejected File:", file.mimetype, file.originalname);
        cb(new Error('Error: Supported files are Images, PDFs, and Videos only!'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // ✅ Increased Limit to 100MB
});

module.exports = upload;