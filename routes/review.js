const express = require("express");
const router = express.Router({mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const controllerReview = require("../controller/review.js")
const { validateReview, isLoggedIn, iscreatedByOwner } = require("../middleware.js")



//Create POST review
router.post("/",isLoggedIn , validateReview, wrapAsync(controllerReview.createReview))

//delete post review
router.delete("/:reviewId",isLoggedIn,iscreatedByOwner,validateReview, wrapAsync(controllerReview.destroyReview))

module.exports = router ;