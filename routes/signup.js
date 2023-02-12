const express = require("express"); //? import de express
const uid2 = require("uid2"); //?  package qui génère une chaîne de caractères aléatoires
//? crypto-js est une librairie d'algorithmes cryptographiques.
const SHA256 = require("crypto-js/sha256"); //? package pour encrypter une string
const encBase64 = require("crypto-js/enc-base64"); //? package pour transformer l'encryptage en string

const router = express.Router(); //? déclarer les routes

//! import du model 'User'
const User = require("../models/User");

//! CREATE
//todo création d'une route pour SIGN-UP
// url http://127.0.0.1:3000/user/signup
router.post("/user/signup", async (req, res) => {
	//console.log(req.body);

	try {
		//? Destructuring
		const { username, email, newsletter, password } = req.body;


		//todo cas d'erreur, le username n'est pas renseigné
		// if (username === "" || username === undefined) { 
		// 	return res.status(400).json({ message: "⚠️ Don't forget your username !" });
		// }
		// mieux ainsi :
		if (!username || !email || !password || typeof newsletter !== "boolean") {
			return res.status(400).json({ message: "⚠️  Missing parameter" });
		}

		//! générer un salt
		const salt = uid2(16);
		//console.log("salt: ", salt);

		//! générer un hash
		const hash = SHA256(password + salt).toString(encBase64);
		//console.log("hash: ", hash);

		//! générer un token
		const token = uid2(64);
		//console.log("token: ", token);

		//todo cas d'erreur, l'email renseigné lors de l'inscription existe déjà dans la base de données
		//* chercher l'élément concerné dans la collection USER (que l'on a importé ds le fichier)
		const isEmailAlreadyExist = await User.findOne({ email });
		//console.log(email, isEmailAlreadyExist);
		if (isEmailAlreadyExist) {
			return res.status(409).json({ message: "⚠️ This email is already used" });
		}

		const newUser = new User({
			account: { username },
			email,
			newsletter,
			salt,
			hash,
			token,
		});

		await newUser.save();
		const response = {
			_id: newUser._id,
			account: newUser.account,
			token: newUser.token,
		};
		res.json(response);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//! export de mes routes
module.exports = router;
