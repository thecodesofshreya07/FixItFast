// ─── db.js ────────────────────────────────────────────────────────────────────
// Creates a shared MySQL connection pool that all route handlers reuse.
// Uses mysql2/promise so every query returns a real Promise (async/await ready).

const mysql  = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "localhost",
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || "root",
  password:           process.env.DB_PASSWORD || "",
  database:           process.env.DB_NAME     || "fixitfast",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  // Return JS Date objects instead of strings for DATE columns
  dateStrings:        false,
});

// Quick connectivity test on startup
pool.getConnection()
  .then(conn => {
    console.log("✅  MySQL connected →", process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error("❌  MySQL connection failed:", err.message);
    console.error("    Check your .env DB_* values and make sure MySQL is running.");
  });

module.exports = pool;
