//todo import de mongoose
const mongoose = require("mongoose");

//todo création d'un modèle
const User = mongoose.model("User", {
	email: { type: String, required: true },
	account: {
		username: { type: String, default: `PseudoSympa` },
		avatar: Object, // nous verrons plus tard comment uploader une image
	},
	newsletter: { type: Boolean, default: true },
	token: String,
	hash: String,
	salt: String,
});

//! export du modèle
module.exports = User;
