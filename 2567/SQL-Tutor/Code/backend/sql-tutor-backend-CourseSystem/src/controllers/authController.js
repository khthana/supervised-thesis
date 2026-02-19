const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSecret, jwtExpiresIn } = require("../config/configauth");
const {
  createUser,
  getUserByEmail,
  getUserByUsername,
  requestPasswordReset,
  resetPasswordService,
  updateUserProfile,
  getUserById,
  getAllUsers,
  deleteUser,
} = require("../services/userService");

// login fuction
const login = async (req, res) => {
  const { email, hashedPassword } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log("ไม่มีuser");
      return res.status(401).json({ message: "Invalid user" });
    }

    if (hashedPassword !== user.Password) {
      console.log("password ไม่ถูก");
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.Email, role: user.Permission, accountID: user.Account_ID , username: user.Username},
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
    return res
      .status(200)
      .json({
        token,
        role: user.Permission,
        username: user.Username,
        accountID: user.Account_ID,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// register function
const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    const existingEmail = await getUserByEmail(email);
    const existingUsername = await getUserByUsername(username);

    if (existingEmail || existingUsername) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    const newUser = await createUser({
      Firstname: firstname,
      Lastname: lastname,
      Username: username,
      Email: email,
      Password: password,
      Permission: 1,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await requestPasswordReset(email);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUser = async (req, res) => {
  const { accountId } = req.params;

    try {
        const user = await getUserById(accountId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
  const userId = req.user.accountID;
  const { currentPassword, newPassword } = req.body;

  try {
      const user = await getUserById(userId);
      if (!user) {
          return res.status(404).json({ message: "ไม่พบผู้ใช้" });
      }

      const isMatch = bcrypt.compareSync(currentPassword, user.Password);
      if (!isMatch) {
          return res.status(400).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });
      }

      const response = await resetPasswordService(userId, newPassword);
      res.status(200).json(response);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const isAdmin = req.user && req.user.role === 0;
  const userId = isAdmin && req.body.userId ? req.body.userId : req.user.accountID;

  const { firstname, lastname, email } = req.body;

  try {
    const result = await updateUserProfile(userId, { firstname, lastname, email });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserController = async (req, res) => {
  const userId = req.params.accountId || req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const result = await deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  updateProfile,
  getUser,
  getAllUsersController,
  deleteUserController
};
