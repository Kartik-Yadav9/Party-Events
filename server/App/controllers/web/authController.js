const user = require("../models/UserModel");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../../utils/email");

//register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  let userExists = await user.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await user.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // Hardcoded to prevent frontend passing role
      isVerified: false,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });

    //otp generation and sending logic will go here
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`otp for ${email} is ${otp}`);
    await Otp.create({ email, otp, action: "account_verification" });
    await sendOtpEmail(email, otp, "account_verification"); //otp and email will be sent to the user for account verification
   
    res
      .status(201)
      .json({
        message:
          "User registered successfully, please check your email for otp",
        email: user.email,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};
