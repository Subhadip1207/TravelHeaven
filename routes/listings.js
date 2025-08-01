const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");  //for asynchronous error handling
const {listingSchema} = require("../schema.js");     //schema validation
const Listing = require("../models/listing.js"); //requiring listing schema
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {cloudinary , storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))        //Index Route
.post(isLoggedIn , upload.single('listing[image][url]') , validateListing , wrapAsync(listingController.createListing));  //Create Route


//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))       //show route
.put(isLoggedIn , isOwner , upload.single('listing[image][url]') ,validateListing,wrapAsync(listingController.updateListing))  //Update route
.delete(isLoggedIn ,isOwner , wrapAsync(listingController.destroyListing));  //delete route

//Edit Route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(listingController.renderEditForm))

module.exports = router;