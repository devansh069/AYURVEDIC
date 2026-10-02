// BACKEND/scripts/generate_complete_migration.js
// Exports the entire MySQL database schema + data to a complete self-contained SQL migration file.
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function generateCompleteMigration() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Gandhi@2005';
  const database = process.env.DB_NAME || 'ayurveda';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log(`📡 Connecting to MySQL database "${database}" at ${host}:${port}...`);
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port,
    multipleStatements: true
  });

  try {
    const [tableRows] = await conn.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    const tableKey = Object.keys(tableRows[0])[0];
    const tables = tableRows.map(r => r[tableKey]);

    console.log(`Found ${tables.length} tables in database:`, tables);

    // Preferred table dependency order to avoid foreign key errors on creation/insertion
    const preferredOrder = [
      'stats',
      'testimonials',
      'disease_categories',
      'diseases',
      'treatment_categories',
      'treatments',
      'treatment_bookings',
      'clinics',
      'clinic_stories',
      'doctors',
      'doctor_consultations',
      'doctor_appointments',
      'doctor_reviews',
      'doctor_messages',
      'patients',
      'patient_wellness',
      'patient_health_goals',
      'patient_medical_records',
      'patient_diet_plans',
      'patient_recovery_tracker',
      'notifications',
      'ai_chat_messages',
      'symptom_checker_data'
    ];

    // Order tables based on preferredOrder, then any remaining
    const orderedTables = [
      ...preferredOrder.filter(t => tables.includes(t)),
      ...tables.filter(t => !preferredOrder.includes(t))
    ];

    let sqlOutput = `-- ============================================================================\n`;
    sqlOutput += `-- AyurVeda Platform - Complete Master Database Migration & Data Seed\n`;
    sqlOutput += `-- Target RDBMS: MySQL 8.0+\n`;
    sqlOutput += `-- Database: ${database}\n`;
    sqlOutput += `-- Generated: ${new Date().toISOString()}\n`;
    sqlOutput += `-- Contains full DDL schemas and complete baseline seed data for all tables\n`;
    sqlOutput += `-- ============================================================================\n\n`;
    sqlOutput += `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sqlOutput += `USE \`${database}\`;\n\n`;
    sqlOutput += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // Drop tables in reverse order
    sqlOutput += `-- Drop existing tables\n`;
    for (const tbl of [...orderedTables].reverse()) {
      sqlOutput += `DROP TABLE IF EXISTS \`${tbl}\`;\n`;
    }
    sqlOutput += `\n`;

    // DDL and Inserts for each table
    for (const tbl of orderedTables) {
      console.log(`Processing table: ${tbl}`);
      const [[createRow]] = await conn.query(`SHOW CREATE TABLE \`${tbl}\``);
      let createSql = createRow['Create Table'];
      
      sqlOutput += `-- --------------------------------------------------------\n`;
      sqlOutput += `-- Table: \`${tbl}\`\n`;
      sqlOutput += `-- --------------------------------------------------------\n`;
      sqlOutput += `${createSql};\n\n`;

      // Fetch all rows
      const [rows] = await conn.query(`SELECT * FROM \`${tbl}\``);
      if (rows && rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const colsFormatted = columns.map(c => `\`${c}\``).join(', ');
        
        sqlOutput += `-- Baseline seed data for \`${tbl}\` (${rows.length} rows)\n`;
        sqlOutput += `INSERT INTO \`${tbl}\` (${colsFormatted}) VALUES\n`;
        
        const valueRows = rows.map((row, rowIdx) => {
          const vals = columns.map(col => {
            const val = row[col];
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val ? 1 : 0;
            if (val instanceof Date) {
              return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
            }
            if (typeof val === 'object') {
              return conn.escape(JSON.stringify(val));
            }
            return conn.escape(val);
          });
          return `  (${vals.join(', ')})`;
        });

        sqlOutput += valueRows.join(',\n') + ';\n\n';
      }
    }

    sqlOutput += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;
    sqlOutput += `-- Migration complete.\n`;

    // Write to schema_migration.sql and root db_migration.sql
    const schemaPath = path.resolve(__dirname, '..', 'migrations', 'schema_migration.sql');
    const rootPath = path.resolve(__dirname, '..', '..', 'db_migration.sql');

    fs.writeFileSync(schemaPath, sqlOutput, 'utf8');
    fs.writeFileSync(rootPath, sqlOutput, 'utf8');

    console.log(`✅ Successfully generated master migration files:`);
    console.log(`   - ${schemaPath}`);
    console.log(`   - ${rootPath}`);
    console.log(`   File size: ${(Buffer.byteLength(sqlOutput, 'utf8') / 1024).toFixed(2)} KB`);
  } finally {
    await conn.end();
  }
}

generateCompleteMigration().catch(err => {
  console.error('❌ Error generating migration:', err);
  process.exit(1);
});
