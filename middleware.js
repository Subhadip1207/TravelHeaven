const Listing = require("./models/listing.js");
const Review = require("./models/review.js"); //requiring review schema
const ExpressError = require("./utils/ExpressError.js");    //for error handling
const {listingSchema,reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // req.originalUrl saves from which url user wants to log in.
        req.flash("error","You must be logged in to create listing")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl; // we stores the url from which user wants to login into locals variable so that it can be use anywhere
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{ //using the schema validation for server side error handling as a middleware function for listing Schema.
    
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); //combine all the error message details.
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{ //using the schema validation for server side error handling as a middleware function for review Schema.
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); //combine all the error message details.
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of the review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}