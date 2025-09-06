const Listing = require("./models/listing");
const Review = require("./models/reviews.js");

const expressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;    //redirectUrl is user defined and req is an object 
        req.flash("error", "logged or signup to create a new listing !");
        return res.redirect("/login");
    } next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {    //is user is not logged in and try to access any route/path we simply save this current in out res.locals
        res.locals.redirectUrl = req.session.redirectUrl
    } next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the owner of the listing");
         return res.redirect(`/listings/${id}`);
    }next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(400, msg);
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((ele) => ele.message).join(",");
        throw new expressError(400, errmsg);
    }
    else {
        next();
    }
}


module.exports.iscreatedByOwner = async (req, res, next) => {
    const { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!Review.createdBy.equals(res.locals.currentUser._id)) {
        req.flash("error", "You have no access to delete this review");
         return res.redirect(`/listings/${id}`);
    }next();
}