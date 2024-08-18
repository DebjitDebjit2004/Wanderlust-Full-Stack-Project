const listing = require("./DatabaseSchema/schema");
const Review = require("./DatabaseSchema/reviewSchema");
const wrapAsync = require("./utils/wrapAsync");

module.exports.isLoggedin = (req, res, next) =>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must be logged on Wanderlust");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync(async(req, res, next) =>{
    let { id } = req.params;
    let editListing = await listing.findById(id);
    if(!editListing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are the not owner of this listing!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
    
})

module.exports.isReviewAuthor = wrapAsync(async(req, res, next) =>{
    let { id, reviewID } = req.params;
    let review = await Review.findById(reviewID);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are the not owner of this Review!!");
        return res.redirect(`/listing/${id}`);
    }
    next();
    
})