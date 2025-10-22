// server.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");
const bcrypt = require("bcrypt"); // Để mã hóa mật khẩu

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Cho phép truy cập file tĩnh

// --- 1. API Endpoint cho Form Liên Hệ ---
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Vui lòng điền đủ thông tin." });
  }

  try {
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    await db.execute(sql, [name, email, message]);
    res.status(200).json({ message: "Yêu cầu liên hệ đã được gửi." });
  } catch (error) {
    console.error("Lỗi khi lưu liên hệ:", error);
    res.status(500).json({ message: "Lỗi server khi gửi yêu cầu." });
  }
});

// --- 2. Tuyến đường (Routes) Frontend ---
// Phục vụ các file HTML tĩnh
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// (Tạo thêm các routes cho /services, /portfolio nếu cần)

// --- 3. Tuyến đường Quản Trị (Admin - Cần bảo mật) ---
// Tạm thời chỉ là một trang login mẫu, sau này cần thêm Session/JWT để bảo vệ
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html")); // Cần tạo tệp này
});

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`Server Sĩ Triết đang chạy tại http://localhost:${PORT}`);
});
