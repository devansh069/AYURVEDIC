// BACKEND/migrations/migrate.js
// Automated database migration runner for AyurVeda Platform
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Princy@1979';
  const database = process.env.DB_NAME || 'ayurveda';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log(`📡 Connecting to MySQL server at ${host}:${port}...`);

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    port,
    multipleStatements: true
  });

  try {
    console.log(`🚀 Creating database "${database}" if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${database}\``);

    // Read the master SQL migration file
    const rootMigrationPath = path.resolve(__dirname, '..', '..', 'db_migration.sql');
    const localMigrationPath = path.resolve(__dirname, 'schema_migration.sql');
    const sqlPath = fs.existsSync(rootMigrationPath) ? rootMigrationPath : localMigrationPath;

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration SQL file not found at ${sqlPath}`);
    }

    console.log(`📄 Executing migration script from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);
    console.log('✅ Migration executed successfully! All tables and schema structures are up to date.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration().catch(err => {
  console.error('Unexpected error during migration:', err);
  process.exit(1);
});
