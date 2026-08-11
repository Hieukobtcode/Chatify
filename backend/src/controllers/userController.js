import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
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


export const uploadAvatar = async (req,res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if(!file){
      return res.status(400).json({message:"No file uploaded"})
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = User.findByIdAndUpdate(
      userId,
      {
        avatarUrl:result.secure_url,
        avatarId:result.public_id,
      },{
        new:true,
      }
    ).select("avartarUrl");

    if(!updatedUser.avatarUrl){
      return res.status(400).json({message:"Avatar tra ve null"})
    }

    return res.status(200).json({avatarUrl:updatedUser.avatarUrl});
  } catch (error) {
    console.error("Loi xay ra khi upload avatar:",error)
    return res.status(500).json({message:"Upload failed"})
  }
}