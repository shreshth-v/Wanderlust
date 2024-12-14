const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String 
    },
    description: {
        type: String 
    },
    image: {
        url: String, 
        filename: String
    },
    price: {
        type: Number 
    },
    location: {
        type: String 
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: { 
            type: [Number], 
            required: true
        }
    },
    category: { 
        type: String, 
        enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Pools', 'Camping', 'Farms', 'Artic', 'Boats'],
        required: true
    }

})

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})


const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;