const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title:{
        type: String,
        required : true
    },
    description: String,
    image:{
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["Trending","Rooms","Iconic Cities","Mountains","Castles","Amezing Pools","Camping","Farms","Arctic","Sea Beach","Boats","Forests"]
    },
    
});

ListingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        let res = await Review.deleteMany({_id : {$in: listing.reviews}})  //delete all reviews whose id is inside the listings reviews array.
    }
  
})
const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;