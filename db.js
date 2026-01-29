const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
});

// 🔍 Startup connection test
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(">>> ✅ MySQL Connected");
    conn.release();
  } catch (err) {
    console.error(">>> ❌ Database Connection Failed:", err.message);
  }
})();

module.exports = pool;
