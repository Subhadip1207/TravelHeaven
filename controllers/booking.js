const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");

router.get("/:id/new", async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("bookings/new", { listing });
});

router.post("/:id", async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const { name, uniqueId, numberOfPeople, startDate, numberOfDays } = req.body.booking;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + parseInt(numberOfDays));

    const existingBooking = await Booking.findOne({
        user: req.user._id,
        listing: listing._id,
    });

    if (existingBooking) {
        req.flash("error", "You already booked this place.");
        return res.redirect(`/listings/${listing._id}`);

    }

    const booking = new Booking({
        listing,
        user: req.user._id,
        name,
        uniqueId,
        numberOfPeople,
        startDate: start,
        endDate: end,
        numberOfDays,
    });

    await booking.save();
    res.redirect(`/listings/${listing._id}`);
});

module.exports = router;
