const express = require("express"); //? import de express
//const uid2 = require("uid2"); //?  package qui génère une chaîne de caractères aléatoires
//? crypto-js est une librairie d'algorithmes cryptographiques.
const SHA256 = require("crypto-js/sha256"); //? package pour encrypter une string
const encBase64 = require("crypto-js/enc-base64"); //? package pour transformer l'encryptage en string

const router = express.Router(); //? déclarer les routes

//! import du model 'User'
const User = require("../models/User");

//! READ
//todo création d'une route pour LOG-IN
// http://127.0.0.1:3000/user/login

router.post("/user/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		//todo Tester l'email:  (pour test :  "email": "antechrist@mail.com", "password": "fuckyou"
		const alreadyUser = await User.findOne({ email: email }); //{ email: req.body.email }
		// attention si valeur nulle, va ds le catch si console.log(`-mail User: `, alreadyUser.email, alreadyUser);
        
		if (!alreadyUser) {
			// 	si la recherche du mail ne renvoie rien
			return res
				.status(401)
				.json({ message: "⚠️ This email doesn't exist, please sign up" });
		}

		//! générer un hash
		const newHash = SHA256(password + alreadyUser.salt).toString(
			encBase64
		);
		console.log(`newHash:`, newHash);

		if (alreadyUser.hash !== newHash) {
			return res.status(400).json({ message: "⚠️ Wrong password" });
		}
		const welcome = `Welcome to Vinted ${alreadyUser.account.username}, here is your token ${alreadyUser.token}`;

		res.json(welcome); //`Welcome ${username}`
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//! export de mes routes
module.exports = router;
