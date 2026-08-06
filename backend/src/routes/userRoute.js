import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-hashedPassword");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi gọi /me", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

export default router;