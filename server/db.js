import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

function parseDbUrl(url) {
  try {
    const u = new URL(url.replace(/^mysql:\/\//, 'https://'));
    return {
      host: u.hostname,
      port: parseInt(u.port || '3306', 10),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname?.slice(1) || 'kodbank',
      ssl: url.includes('ssl') || url.includes('require') ? { rejectUnauthorized: false } : undefined,
    };
  } catch {
    return null;
  }
}

let poolConfig;
if (process.env.DB_URL) {
  const parsed = parseDbUrl(process.env.DB_URL);
  poolConfig = parsed ? { ...parsed } : {};
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'kodbank',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
}

poolConfig.waitForConnections = true;
poolConfig.connectionLimit = 10;
poolConfig.queueLimit = 0;

const pool = mysql.createPool(poolConfig);
export default pool;
