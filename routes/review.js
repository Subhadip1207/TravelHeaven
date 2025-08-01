const express = require("express");
const router = express.Router({mergeParams: true}); //mergeParams is used to access the params of the parent route, in this case, the listing id.
// This is necessary because reviews are nested within listings, and we need to access the listing id when creating or deleting a review.
const wrapAsync = require("../utils/wrapAsync.js");  //for asynchronous error handling
const ExpressError = require("../utils/ExpressError.js");    //for error handling

const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");


//reviews
//Reviews Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//reviews delete route
router.delete("/:reviewId", isLoggedIn , isReviewAuthor , wrapAsync(reviewController.destroyReview))

module.exports = router;