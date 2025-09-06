const Listing = require('../models/listing');
const expressError = require('../utils/expressError');

module.exports.showAllListing = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.newListing = async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body); // Debugging line
        
        if (!req.body.listing) {
            console.error("No listing data in request body");
            req.flash("error", "Invalid listing data");
            return res.redirect("/listings/new");
        }
        
        const listingData = {
            title: req.body.listing.title,
            description: req.body.listing.description,
            image: req.body.listing.image,
            price: req.body.listing.price,
            location: req.body.listing.location,
            country: req.body.listing.country,
            owner: req.user._id
        };

        // Validate required fields
        if (!listingData.title || !listingData.description || !listingData.image || 
            !listingData.price || !listingData.location || !listingData.country) {
            req.flash("error", "All fields are required");
            return res.redirect("/listings/new");
        }

        // Validate image URL
        if (!listingData.image.startsWith('http')) {
            req.flash("error", "Please provide a valid image URL starting with http or https");
            return res.redirect("/listings/new");
        }

        // Validate price is a number
        if (isNaN(listingData.price)) {
            req.flash("error", "Price must be a number");
            return res.redirect("/listings/new");
        }

        const newListing = new Listing(listingData);
        await newListing.save();
        req.flash("success", "New Listing created successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error in createListing:", err);
        req.flash("error", err.message);
        res.redirect("/listings/new");
    }
}



module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        let showListing = await Listing.findById(id)
            .populate({ 
                path: "reviews", 
                populate: { path: "createdBy" } 
            })
            .populate("owner");
            
        if (!showListing) {
            req.flash("error", "Requested listing does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { showListing });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings");
    }
}

module.exports.getListingData = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings");
    }
}

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listingData = req.body.listing;
        
        // Validate image URL
        if (listingData.image && !listingData.image.startsWith('http')) {
            req.flash("error", "Please provide a valid image URL starting with http or https");
            return res.redirect(`/listings/${id}/edit`);
        }
        
        const updatedListing = await Listing.findByIdAndUpdate(id, listingData);
        if (!updatedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", err.message);
        res.redirect(`/listings/${id}/edit`);
    }
}

module.exports.destroyListing = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings");
    }
}