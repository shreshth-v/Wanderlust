const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");


// LISTING SCHEMA VALIDATION
module.exports.validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if(error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}


// REVIEW SCHEMA VALIDATION
module.exports.validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}



module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next()
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`); 
    }
    next();

}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of the review");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}