const listing = require("../DatabaseSchema/schema")
const Review = require("../DatabaseSchema/reviewSchema");

module.exports.reviewRoute = async(req, res)=>{
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "New Review Added")
    res.redirect(`/listing/${listings.id}`);
}

module.exports.deleteRoute = async(req, res)=>{
    let { id, reviewID } = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Delete Review")
    res.redirect(`/listing/${id}`);
}