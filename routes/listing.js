const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");

router.route("/")
    .get(wrapAsync(listingController.showAllListing))
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new", isLoggedIn, listingController.newListing);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    );

router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.getListingData));

router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

module.exports = router;