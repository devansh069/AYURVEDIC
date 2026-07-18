const mysql = require('mysql2/promise');

async function test() {
  const cred = { host: 'localhost', user: 'root', password: 'Princy@1979' };
  try {
    console.log(`Testing root@localhost with password: "Princy@1979"`);
    const connection = await mysql.createConnection(cred);
    console.log('SUCCESS CONNECTED!');
    const [rows] = await connection.query('SHOW DATABASES');
    console.log('Databases:', rows.map(r => r.Database));
    await connection.end();
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
}

test();
