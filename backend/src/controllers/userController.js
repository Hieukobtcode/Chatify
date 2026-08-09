import User from "../models/User.js";
export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const searchUserByUserName = async (req, res) => {
  try {
    const {username} = req.query;
    if(!username || username.trim() === ""){
      return res.status(400).json({message:"Hay nhap username"})
    }

    const user = await User.findOne({username}).select("_id displayName userName avartarUrl");

    return res.status(200).json({user});
  } catch (error) {
      console.error("Loi xay ra khi search user by username:",error);
      return res.status(500).json({message:"Loi he thong"})
  }
};
