//todo import de mongoose
const mongoose = require("mongoose");

//todo création d'un modèle
const Offer = mongoose.model("Offer", {
	product_name: { type: String, required: true, maxLength: 50 },
	product_description: { type: String, required: true, maxLength: 500 },
	product_price: { type: Number, required: true, min: 0, max: 100000 },
	product_details: { type: Array, required: true },
	product_city: { type: String, required: true, maxLength: 50 },
	product_image: { type: mongoose.Schema.Types.Mixed, default: {} },
	product_pictures: Array,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	//date_of_offer: String,
	product_date: { type: Date, default: Date.now },
});

//! export du modèle
module.exports = Offer;
