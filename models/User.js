//todo import de mongoose
const mongoose = require("mongoose");

//todo création d'un modèle
const User = mongoose.model("User", {
	email: { type: String, unique: true }, // `email` must be unique
	account: {
		username: { type: String, required: true },
		//avatar: Object, 
	},
	newsletter: { type: Boolean, default: false },
	token: String,
	hash: String,
	salt: String,
});

//! export du modèle
module.exports = User;
