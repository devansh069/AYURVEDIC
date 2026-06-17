// BACKEND/config/db.js
// Database connector that handles MySQL connection pool via mysql2.
require("dotenv").config();
const mysql = require("mysql2");

let pool = null;

const connectDB = async () => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT || 3306;

  if (!host || !user || !database) {
    console.warn("⚠️  MySQL configuration (DB_HOST, DB_USER, DB_NAME) is not fully defined in the .env. Using in-memory mock datasets.");
    return null;
  }

  try {
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection using promise wrapper
    const promisePool = pool.promise();
    await promisePool.query("SELECT 1");
    console.log("🚀 MySQL Pool Connected Successfully.");
    return pool;
  } catch (err) {
    console.error(`❌ MySQL Connection Error: ${err.message}`);
    console.warn("⚠️  Falling back to in-memory mock datasets.");
    pool = null;
    return null;
  }
};

const getPool = () => pool;

module.exports = connectDB;
module.exports.getPool = getPool;
