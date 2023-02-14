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
		// Aller chercher le user dont le mail est celui reçu
		const alreadyUser = await User.findOne({ email: email }); //{ email: req.body.email }
		// attention si valeur nulle, va ds le catch si console.log(`-mail User: `, alreadyUser.email, alreadyUser);

		if (!alreadyUser) {// 	si la recherche du mail ne renvoie rien
			return res
				.status(401)
				.json({ message: "⚠️ This email doesn't exist, please sign up" });
		}
		// Si on en trouve on continue
		// Recréer un hash à partir du salt du user trouvé et du MDP reçu
		console.log(alreadyUser);
		//! générer un hash
		const newHash = SHA256(password + alreadyUser.salt).toString(
			encBase64
		);
		console.log(`newHash:`, newHash);
		// Si les hash sont différents on envoie une erreur
		if (alreadyUser.hash !== newHash) {
			return res.status(400).json({ message: "⚠️ Wrong password" });
		}
		// Si ce hash est le même que le hash en BDD on autorise la connexion
		res.status(200).json({
			_id: alreadyUser._id,
			token: alreadyUser.token,
			account: alreadyUser.account,
		})


	} catch (error) {
		console.log("error.response", error.response);
		res.status(400).json(error);
	}
});

//! export de mes routes
module.exports = router;
