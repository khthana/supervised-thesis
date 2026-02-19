const User = require("../models/User");
const { Sequelize } = require("sequelize");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const fs = require("fs");
const path = require("path");
const Post = require("../models/Posts");
const Comment = require("../models/Comment");
const Reply = require("../models/Reply");
const Progress = require("../models/Progress");

const generateResetToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
      service: 'gmail', // หรือใช้บริการอีเมลอื่นๆ
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });

  const resetLink = `http://localhost:3000/resetpassword/${token}`;
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: [
      "Account_ID",
      "Username",
      "Firstname",
      "Lastname",
      "Email",
      "Permission",
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM Posts
          WHERE Posts.Account_ID = accounts.Account_ID
        )`),
        "postCount"
      ],
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM Progress
          WHERE Progress.Account_id = accounts.Account_ID AND Progress.P_state = 'pass'
        )`),
        "progressCount"
      ]
    ]
  });
  return users;
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { Email: email } });
};

const getUserByUsername = async (username) => {
  return await User.findOne({ where: { Username: username } });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
      throw new Error('User not found');
  }

  const resetToken = generateResetToken(user);
  await sendResetPasswordEmail(email, resetToken);
};

const getUserById = async (accountId) => {
  try {
      const user = await User.findOne({
          where: { Account_ID: accountId },
          attributes: ["Account_ID", "Username", "Firstname", "Lastname", "Email", "Permission"]
      });

      if (!user) {
          throw new Error("User not found");
      }

      return user;
  } catch (error) {
      throw new Error(error.message);
  }
};

const resetPasswordService = async (userId, newPassword) => {
  try {
      const user = await User.findByPk(userId);
      if (!user) {
          throw new Error("User not found");
      }
      
      user.Password = newPassword;
      await user.save();

      return { message: "เปลี่ยนรหัสผ่านสำเร็จ" };
  } catch (error) {
      console.log(error);
      throw new Error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
  }
};

const updateUserProfile = async (userId, updateData) => {
  const updates = {};
  if (updateData.firstname) updates.Firstname = updateData.firstname;
  if (updateData.lastname) updates.Lastname = updateData.lastname;
  if (updateData.email) {

      const existingUser = await User.findOne({
          where: { Email: updateData.email, Account_ID: { [Op.ne]: userId } },
      });
      if (existingUser) {
          throw new Error("Email นี้ถูกใช้ไปแล้ว");
      }
      updates.Email = updateData.email;
  }

  if (Object.keys(updates).length === 0) {
      throw new Error("ไม่มีข้อมูลที่ต้องอัปเดต");
  }

  await User.update(updates, { where: { Account_ID: userId } });
  return { message: "อัปเดตข้อมูลสำเร็จ" };
};

const deleteFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
    }
  }
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const posts = await Post.findAll({ where: { Account_ID: userId } });
  const postUploadDir = path.join(__dirname, "..", "imgPostContent");
  for (const post of posts) {
    const images = post.Image ? JSON.parse(post.Image) : [];
    images.forEach(imageName => {
      const filePath = path.join(postUploadDir, imageName);
      deleteFileIfExists(filePath);
    });
  }

  const comments = await Comment.findAll({ where: { Account_ID: userId } });
  const commentUploadDir = path.join(__dirname, "..", "imgCommentContent");
  for (const comment of comments) {
    const images = comment.Image ? JSON.parse(comment.Image) : [];
    images.forEach(imageName => {
      const filePath = path.join(commentUploadDir, imageName);
      deleteFileIfExists(filePath);
    });
  }

  const replies = await Reply.findAll({ where: { Account_ID: userId } });
  const replyUploadDir = path.join(__dirname, "..", "imgReplyContent");
  for (const reply of replies) {
    const images = reply.Image ? JSON.parse(reply.Image) : [];
    images.forEach(imageName => {
      const filePath = path.join(replyUploadDir, imageName);
      deleteFileIfExists(filePath);
    });
  }

  await Progress.destroy({ where: { Account_id: userId } });

  await User.destroy({ where: { Account_ID: userId } });

  return { message: "User and all associated data deleted successfully" };
};

module.exports = {
  getUserByEmail,
  getUserByUsername,
  createUser,
  requestPasswordReset,
  resetPasswordService,
  updateUserProfile,
  getUserById,
  getAllUsers,
  deleteUser
};
