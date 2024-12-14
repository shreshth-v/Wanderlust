const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewsController = require("../controllers/reviews.js");



// CREATE REVIEW ROUTE
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewsController.createReview))


// DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview))


module.exports = router;