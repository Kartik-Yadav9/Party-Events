const express = require("express");
const { registerUser } = require("../../controllers/web/authController");
const authRoutes = express.Router()

authRoutes.post("register",registerUser);
authRoutes.post("login",loginUser);
authRoutes.post("verify-otp",verifyOtp);

module.exports= authRoutes
