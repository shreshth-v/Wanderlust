const axios = require('axios');


const Listing = require("../models/listing");


module.exports.showAllListings = async (req, res) => {

    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings })

}


module.exports.showCategoryWiseListings = async (req, res) => {

    let { category } = req.params;

    let allListings = await Listing.find({category : category});
    res.render("listings/index.ejs", { allListings });

}



module.exports.showCounrtyWiseListings = async (req, res) => {

    let { country } = req.query;

    let allListings = await Listing.find({country : country});
    res.render("listings/index.ejs", { allListings });

}



module.exports.getCreateListingForm = (req, res) => {
    res.render("listings/new.ejs");
}



module.exports.showListing = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}



module.exports.createListing = async (req, res, next) => {    
    
    try {

        const location = req.body.listing.location;

        const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: location, format: 'json', limit: 1 }
            
        });

        if (geoResponse.data.length === 0) {
            req.flash("error", "Location not found.");
            return res.redirect("/listings");
        }

        // Get the latitude and longitude from the geocoding response
        let { lat, lon } = geoResponse.data[0];
        let geometry = { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] };

        // Get the image stored
        let image = { url: req.file.path, filename: req.file.filename };

        let newListing = new Listing({ ...req.body.listing });
        newListing.owner = req.user._id;
        newListing.image = image;
        newListing.geometry = geometry;
        
        await newListing.save();

    } catch (error) {
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings");
    }

    req.flash("success", "New listing created!!");
    res.redirect("/listings"); 
}



module.exports.getEditListingForm = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findById(id);

    let originalUrl = listing.image.url;
    modifiedUrl = originalUrl.replace("/upload", "/upload/w_250");

    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing , modifiedUrl });
}



module.exports.updatedListing = async (req, res) => {

    try {

        const location = req.body.listing.location;

        const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: location, format: 'json', limit: 1 }
            
        });

        if (geoResponse.data.length === 0) {
            req.flash("error", "Location not found.");
            return res.redirect("/listings");
        }

        let { lat, lon } = geoResponse.data[0];
        let geometry = { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] };



        let { id } = req.params;
        
        let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        updatedListing.geometry = geometry;
        await updatedListing.save();

        if (req.file) {
            let filename = req.file.filename;
            let url = req.file.path;
            
            updatedListing.image = { url, filename };
            await updatedListing.save();
        }


        req.flash("success", "Lisitng updated!");
        res.redirect(`/listings/${id}`);

    } catch (error) {
        req.flash("error", "Something went wrong while updating the listing.");
        res.redirect("/listings");
    }

    
}



module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Lisitng deleted!");
    res.redirect("/listings");
}