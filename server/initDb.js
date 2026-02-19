import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDb() {
  let conn;
  if (process.env.DB_URL) {
    conn = await mysql.createConnection(process.env.DB_URL);
  } else {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };
    conn = await mysql.createConnection(config);
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'kodbank'}`);
    await conn.query(`USE ${process.env.DB_NAME || 'kodbank'}`);
  }

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS KodUser (
        uid VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 100000.00,
        phone VARCHAR(20) NOT NULL,
        role ENUM('Customer', 'manager', 'admin') DEFAULT 'Customer'
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS UserToken (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(500) NOT NULL,
        uid VARCHAR(50) NOT NULL,
        expiry DATETIME NOT NULL,
        FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully');
  } finally {
    await conn.end();
  }
}

initDb().catch((err) => {
  console.error('Database init failed:', err);
  process.exit(1);
});
