// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Khởi tạo bảng nếu chưa có (Chỉ chạy 1 lần đầu)
async function initDB() {
  try {
    const connection = await pool.getConnection();

    // Bảng users (Admin)
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'admin'
            );
        `);

    // Bảng portfolio (Sản phẩm)
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS portfolio (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(255),
                link_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Bảng contacts (Liên hệ)
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100),
                message TEXT,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    console.log("Database Tables initialized successfully.");
    connection.release();
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDB();
module.exports = pool;
