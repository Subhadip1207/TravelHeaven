const Listing = require("../models/listing.js"); 
module.exports.index = async (req, res) => {
    const { category, q } = req.query;
    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (q) {
        const regex = new RegExp(q, "i"); 
        filter.$or = [
            { title: regex },
            { location: regex },
            { description: regex }
        ];
    }

    const allListings = await Listing.find(filter);
    res.render("./listings/index.ejs", { allListings, category });
};


module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("./listings/show.ejs", { listing });
    }

}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for is not exist!");
        res.redirect("/listings");
    } else {
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
        res.render("./listings/edit.ejs", { listing, originalImageUrl });
    }

}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listings.")
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findByIdAndDelete(id);
    console.log(data);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}