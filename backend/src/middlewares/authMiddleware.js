import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Cache user theo userId để tránh query DB mỗi request
const userCache = new Map();
const USER_CACHE_TTL = 60 * 1000; // 60 giây

export const protectedRoute = async (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xác nhận token hợp lệ (sync verify nhanh hơn async callback)
    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Access token hết hạn hoặc không đúng" });
    }

    const userId = decodedUser.userId;

    // Kiểm tra cache trước
    const cached = userCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      req.user = cached.user;
      return next();
    }

    // Chỉ lấy các field cần thiết, dùng lean() để tăng tốc
    const user = await User.findById(userId)
      .select("_id username displayName avatarUrl email bio phone")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "người dùng không tồn tại." });
    }

    // Lưu vào cache
    userCache.set(userId, {
      user,
      expiresAt: Date.now() + USER_CACHE_TTL,
    });

    req.user = user;
    next();
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Hàm xoá cache khi user cập nhật thông tin
export const invalidateUserCache = (userId) => {
  userCache.delete(userId?.toString?.() ?? userId);
};