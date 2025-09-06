const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new expressError(404, "Listing not found");
    }
    let newReview = new Review(req.body.review);
    console.log("New review:", newReview);
    newReview.createdBy = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review updated");
    console.log("Updated listing:", listing);
    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
        throw new expressError(404, "Review not found");
    }
        req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}