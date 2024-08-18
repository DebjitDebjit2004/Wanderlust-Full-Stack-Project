const mongoose = require("mongoose");
const Review = require("./reviewSchema.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
        await Review.deleteMany({id: {$in: listing.reviews }});
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;