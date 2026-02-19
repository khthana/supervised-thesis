const express = require("express");
const authController = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get("/user/:accountId", authController.getUser);

router.post('/forgot-password', authController.forgotPassword);

router.put("/change-password", authenticateToken, authController.resetPassword);

router.put('/update-profile', authenticateToken, authController.updateProfile);

router.get("/users", authController.getAllUsersController);

router.delete("/user/:accountId", authenticateToken, authController.deleteUserController);

module.exports = router;
