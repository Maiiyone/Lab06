const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Token = require("../models/Token.js");
const RegisterUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    User.create(username, hashedPassword, role, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error creating user", error: err });
      }
      res.status(201).json({
        message: "User created successfully",
        userId: results.insertId,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const LoginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Tìm người dùng theo tên
    User.findByUsername(username, async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const loginTime = new Date().toISOString().slice(0, 19).replace("T", " ");

      const ipAddress = req.ip === "::1" ? "127.0.0.1" : req.ip;
      // Tạo JWT
      const payload = {
        id: user.id,
        username: user.username,
        login_time: loginTime,
        ip_address: user.ip_address || ipAddress,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
      });
      // Lưu token (nếu cần)
      Token.create(user.id, token, loginTime, ipAddress, (err) => {
        if (err) {
          console.log("Error saving token:", err);
        }
      });

      // Phản hồi với JWT
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          loginTime: loginTime,
          ipAddress: ipAddress,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1]; // Lấy phần token sau 'Bearer'

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret"); // Thay 'secret' bằng khóa bí mật thực tế

    // Gắn thông tin giải mã vào request để sử dụng trong các middleware tiếp theo
    req.user = decoded;

    // Chuyển sang middleware tiếp theo
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1]; // Lấy phần token sau 'Bearer'

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret"); // Thay 'secret' bằng khóa bí mật thực tế

    // Gắn thông tin giải mã vào request để sử dụng trong các middleware tiếp theo
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient role permissions" });
    }
    req.user = decoded;
    // Chuyển sang middleware tiếp theo
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};
module.exports = { RegisterUser, LoginUser, verifyToken ,verifyAdmin};
