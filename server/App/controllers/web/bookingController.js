const Booking = require("../../models/BookingModel");
const OTP = require("../../models/OtpModel");
const { sendOtpEmail, sendBookingEmail } = require("../../../utils/email");
const Event = require("../../models/EventModel");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for booking confirmation
exports.sendBookingOtp = async (req, res) => {
  try {
    const otp = generateOTP();
    await OTP.findOneAndDelete({
      email: req.user.email,
      action: "booking_confirmation",
    }); // Remove any existing OTP for booking confirmation
    await OTP.create({
      email: req.user.email,
      otp,
      action: "booking_confirmation",
    }); // Create new OTP for booking confirmation
    await sendOtpEmail(req.user.email, otp, "booking_confirmation"); // Send OTP email for booking confirmation
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Book an event
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    //verify otp explicitly before proceeding
    const validOtp = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "booking_confirmation",
    });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Check if user has already booked the event and booking is not cancelled
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      event: eventId,
    });
    if (existingBooking && existingBooking.status !== "cancelled") {
      return res
        .status(400)
        .json({ message: "You have already booked or pending." });
    }

    const booking = new Booking.create({
      user: req.user._id,
      eventId,
      status: "pending",
      paymentstatus: "not_paid",
      amount: event.ticketPrice,
    });

    await OTP.deleteOne({ _id: validOtp._id }); // Remove OTP after successful booking, cleanup
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//confirm booking after payment success
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body; //paymentStatus can be 'paid' or 'not_paid'
    const booking = await Booking.findById(req.params.id)
      .populate("userId")  //here populate will replace userId with actual full user document from User collection
      .populate("eventId");  //here populate will replace eventId with actual full event document from Event collection
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ message: "Booking is already confirmed" });
    }

    const event = await Event.findById(booking.eventId);
    if (event.availableSeats <= 0) {
      return res
        .status(404)
        .json({ message: "no seats available to confirm the booking" });
    }

    booking.status = "confirmed";
    if (paymentStatus) {
      booking.paymentstatus = paymentStatus;
    }
    await booking.save(); // Save the updated booking status

    // Decrease available seats in the event
    event.availableSeats -= 1;
    await event.save();

    //send email on admin confirmation
    await sendBookingEmail(
        booking.userId.email,
        booking.userId.name,
        booking.eventId.title,
    );

    res.json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


//for populate, {
//    _id: "b101",

//    userId: {
//       _id: "u501",
//       name: "Kartik",
//       email: "kartik@gmail.com"
//    },

//    eventId: {
//       _id: "e901",
//       title: "Music Concert",
//       location: "Delhi"
//    },

//    amount: 1000,
//    status: "booked"
// }