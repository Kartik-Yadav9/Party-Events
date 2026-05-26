const express = require("express");
const { registerUser, loginUser, verifyOTP } = require("../../controllers/web/authController");
const authRoutes = express.Router()

authRoutes.post("register",registerUser);
authRoutes.post("login",loginUser);
authRoutes.post("verify-otp",verifyOTP);

module.exports= authRoutes
