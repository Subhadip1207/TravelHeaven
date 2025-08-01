const Review = require("../models/review.js"); //requiring review schema
const Listing = require("../models/listing.js"); //requiring listing schema
module.exports.createReview = async (req,res)=>{
    console.log(req.params);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New review created successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    console.log("hello");
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/listings/${id}`)
}