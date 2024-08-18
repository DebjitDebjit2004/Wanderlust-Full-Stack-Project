const express = require("express")
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedin, isReviewAuthor } = require("../middlewares.js");

const reviewController = require("../Controller/review.js");

//Review Route(Post Route)
router.post("/reviews", isLoggedin, wrapAsync(reviewController.reviewRoute));

//Delete Review Roue
router.delete("/reviews/:reviewID", isLoggedin, isReviewAuthor, wrapAsync(reviewController.deleteRoute))

module.exports = router;