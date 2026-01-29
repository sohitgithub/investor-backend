const dotenv = require('dotenv');
dotenv.config(); // MUST be first

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

// -------------------- ROUTES --------------------
const authRoutes = require('./routes/authRoutes');
const quarterlyRoutes = require('./routes/quarterlyRoutes');
const annualCompanyRoutes = require('./routes/annualCompanyRoutes');
const annualSubsidiariesRoutes = require('./routes/annualSubsidiariesRoutes');
const annualGroupRoutes = require('./routes/annualGroupRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const offerDocumentRoutes = require('./routes/offerDocumentRoutes');
const shareholdingPatternRoutes = require('./routes/shareholdingPatternRoutes');
const secretarialComplianceRoutes = require('./routes/secretarialComplianceRoutes');
const materialCreditorsRoutes = require('./routes/materialCreditorsRoutes');
const industryReportRoutes = require('./routes/industryReportRoutes');
const disclosureRoutes = require('./routes/disclosureRoutes');
const announcementRoutes = require("./routes/announcementRoutes");
const pagesRoutes = require("./routes/pages");
const helpCentreRoutes = require("./routes/helpCentreRoutes");
const pressRoutes = require("./routes/pressRoutes");
const policiesRoutes = require('./routes/policiesRoutes');



const app = express();


// -------------------- SECURITY --------------------
app.disable('x-powered-by');
app.set('trust proxy', 1);

// -------------------- MIDDLEWARE --------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://investor.symbiotec.com' 
];

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://investor.symbiotec.com",
    "https://symb.connectbizora.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());



// Add this right after the cors middleware to handle preflight manually if needed
// app.options('*', cors());
// -------------------- STATIC FILES --------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- HEALTH CHECK --------------------
app.get('/', (req, res) => {
  res.send('ROOT OK');
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    time: new Date().toISOString()
  });
});

// -------------------- API ROUTES --------------------
app.use('/api/auth', authRoutes);
app.use('/api/quarterly-results', quarterlyRoutes);
app.use('/api/annual-company', annualCompanyRoutes);
app.use('/api/annual-subsidiaries', annualSubsidiariesRoutes);
app.use('/api/annual-group', annualGroupRoutes);
app.use('/api/board-members', boardMemberRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/offer-documents', offerDocumentRoutes);
app.use('/api/shareholding-patterns', shareholdingPatternRoutes);
app.use('/api/secretarial-compliance', secretarialComplianceRoutes);
app.use('/api/material-creditors', materialCreditorsRoutes);
app.use('/api/industry-reports', industryReportRoutes);
app.use('/api/disclosures', disclosureRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/help-centre", helpCentreRoutes);
app.use("/api/press", pressRoutes);
app.use('/api/policies', policiesRoutes);





// -------------------- AUTO CREATE ADMIN (SAFE) --------------------
async function createDefaultAdmin() {
  try {
    const email = 'admin@symbiotec.com';

    const [rows] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);

      await db.query(
        `INSERT INTO users 
         (name, email, password, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        ['Admin', email, hashedPassword, 'admin']
      );

      console.log('✅ Admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('⚠️ Admin init skipped:', err.message);
  }
}

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000; // REQUIRED for cPanel

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  createDefaultAdmin(); // non-blocking
});
