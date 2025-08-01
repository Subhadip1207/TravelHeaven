const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: String,
    uniqueId:String,
    numberOfPeople: Number,
    startDate: Date,
    endDate: Date,
    numberOfDays: Number,
});

module.exports = mongoose.model("Booking", bookingSchema);
