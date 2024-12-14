const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    }
 });


// INDEX ROUTE 
// CREATE ROUTE 
router
.route("/")
.get(wrapAsync(listingsController.showAllListings))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.createListing));



// NEW ROUTE
router.get("/new", isLoggedIn, listingsController.getCreateListingForm);


// FILTER ON CATEGORY ROUTE 
router.get("/filter/:category", listingsController.showCategoryWiseListings);


// FILTER ON COUNTRY ROUTE 
router.get("/country", listingsController.showCounrtyWiseListings)


// SHOW ROUTE 
// UPDATE ROUTE
// DELETE ROUTE 
router
.route("/:id")
.get(wrapAsync(listingsController.showListing))
.patch(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updatedListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));



// EDIT ROUTE 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.getEditListingForm));



module.exports = router;