const express = require("express");
const bookingRoutes = express.Router();
const { protect, admin } = require("../../middleware/auth");
const { bookEvent, sendBookingOtp, getUserBookings, confirmBooking, cancelBooking } = require("../../controllers/web/bookingController");

bookingRoutes.post("/", protect, bookEvent);
bookingRoutes.post('/send-otp', protect, sendBookingOtp);
bookingRoutes.get("/my", protect, getMyBookings);
bookingRoutes.put("/:id/confirm", protect, admin, confirmBooking);
bookingRoutes.delete("/:id", protect, cancelBooking);

module.exports = bookingRoutes;