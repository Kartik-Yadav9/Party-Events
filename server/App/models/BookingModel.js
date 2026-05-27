const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["booked", "cancelled", "pending"],
        default: "pending"
    },
    paymentstatus: {
        type: String,
        enum: ["paid", "not_paid"],
        default: "not_paid"
    },
    amount: {
        type: Number,
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true });  // Add timestamps for createdAt and updatedAt

module.exports = mongoose.model("Booking", bookingSchema);