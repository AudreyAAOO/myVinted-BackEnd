//todo import de mongoose
const mongoose = require("mongoose");

//todo création d'un modèle
const Offer = mongoose.model("Offer", {
	product_name: { type: String, required: true, maxLength: 50 },
	product_description: { type: String, required: true, maxLength: 500 },
	product_price: { type: Number, min: 0, max: 100000 },

	product_details: {
		product_brand: String,
		product_size: String,
		product_color: String,
		product_condition: {
			type: String,
			enum: [
				"neuf avec étiquette",
				"neuf sans étiquette",
				"comme neuf",
				"occasion",
				"légèrement abimé",
				"médiocre",
			],
		},
	},
	// manque emplacement
	product_city: String,
	product_image: Object,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	date_of_offer: String,
});

//! export du modèle
module.exports = Offer;
