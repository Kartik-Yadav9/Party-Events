const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtpEmail = async (email, otp, type) => {
  try{
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // recipient's email
    subject: "Your OTP Code",
    text: `Your OTP for  is: ${otp}`
  };

  await transporter.sendMail(mailOptions); // Send the email to the user
  console.log(`OTP email sent to ${email} for ${type}`);} catch(error){
    console.error("Error sending OTP email: ", error);
  }}