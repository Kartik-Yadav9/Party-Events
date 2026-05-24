const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail, // recipient's email
      subject: `Event Booking Confirmation : ${eventTitle}`,
      html: `
      <h2>Event Booking Confirmation</h2>
      <p>Dear ${userName},</p>
      <p>Your booking for the event "<strong>${eventTitle}</strong>" has been confirmed.</p>
      <p>Thank you for choosing our service!</p>
    `,
    };

    await transporter.sendMail(mailOptions); // Sending the email to the user
    console.log(`Booking email sent to ${userEmail} `);
  } catch (error) {
    console.error("Error sending booking email: ", error);
  }
};

//send otp email
const sendOtpEmail = async (userEmail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify Your Account"
        : "Event Booking Verification";
    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new account:"
        : "Please use the following OTP to verify and confirm your event booking:";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail, // recipient's email
      subject: title,
      html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
        `,
    };
    await transporter.sendMail(mailOptions); // Send the email to the user
    console.log(`OTP email sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error("Error sending OTP email: ", error);
  }
};

module.exports = {
  sendBookingEmail,
  sendOtpEmail,
};
//This function sends a normal booking confirmation email.
// This function sends an OTP inside the email.