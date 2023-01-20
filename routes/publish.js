const express = require("express"); //? import de express
//const uid2 = require("uid2");
//const SHA256 = require("crypto-js/sha256");
//const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload"); // Import de fileupload qui nous permet de recevoir des formdata
const cloudinary = require("cloudinary").v2; // Import de cloudinary

const router = express.Router(); //? déclarer les routes

//* import du model 'User'
const User = require("../models/User");
//* import du model 'Offer'
const Offer = require("../models/Offer");
//! import du middleware isAuthenticated
const isAuthenticated = require("../middlewares/isAuthenticated");
const convertToBase64 = require("../utils/convertToBase64");
//const { countDocuments } = require("../models/User");

//! Données à remplacer avec les vôtres :
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});
//!
//todo création d'une route pour publier une annonce  url http://127.0.0.1:3000/user/publish

//! On positionne le middleware `fileUpload` dans la route `/publish`
router.post(
	"/user/publish",
	isAuthenticated,
	fileUpload(),
	async (req, res) => {
		try {
			//console.log(req.files); //! uploader la photo sur Cloudinary
			const pictureToUpload = req.files.picture;
			const result = await cloudinary.uploader.upload(
				convertToBase64(pictureToUpload) // {folder: "./pictures",}
			);

			// afficher les fichiers reçus
			//console.log(req.body); // Les champs textuels du body sont disponibles dans req.body
			// Les fichiers reçus sont dans req.files : renvoie un objet ou un tableau si plusieurs images
			// J'ai accès à req.user. Clef que j'ai stockée dans req dans le middleware isAuthenticated
			//console.log(req.user);

			// Je converti le fichier reçu en base64 et j'envoie l'image sur cloudinary dans un dossier image-andromeda23
			//todo je vais vérifier si l'utilisateur est inscrit et loggué
			// const user = User.findOne({token});
			// console.log(user);

			//* destructuring
			const { title, description, price, brand, size, color, city, condition } =
				req.body;

			//todo je crée une nouvelle annonce
			const newOffer = new Offer({
				product_name: title,
				product_description: description,
				product_price: price,
				product_city: city,
				product_details: {
					product_brand: brand,
					product_size: size,
					product_color: color,
					product_condition: condition,
				},
				product_image: result,
				owner: req.user, // Mongoose comprend que c'est une réf et n'enregistre que l'_id  = req.user._id

				date_of_offer: new Date(),
			});

			//console.log(newOffer);

			await newOffer.save();
			res.json(newOffer);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}
);

router.get("/offers", async (req, res) => {
	//? url http://127.0.0.1:3000/offers
	try {
		//// Afficher toutes les offres : const results = await Offer.find();
		//! Afficher les produits qui contienne le nom "sac" :
		//const results = await Offer.find({product_name: new RegExp("sac", "i")});
		//! Afficher un prix minimum et maximum
		//const results = await Offer.find({ product_price: { $gte: 80, $lte: 150 } });
		//! Trier les résultats ds l'ordre croissant
		//const results = await Offer.find().sort({product_price: 1}).select("product_name product_price"); // select () pour n'afficher que certains éléments

		//   SKIP ET LIMIT
		//.skip(10) // = sauter l'affichage des 10 premières annonces
		const myResearch = await Offer.find(
			{ product_name: new RegExp("sac", "i") },
			{ product_price: { $gte: 50, $lte: 150 } }
		)
			.sort({ product_price: 1 })
			.select("product_name product_price")
			.limit(2)
			.select("product_name product_price")
			.populate("owner", "account");
		//.countDocuments();
		//si countDocuments < limit log myResearch> skip nbr de docs en limit
		// if (myResearch > 1) {
		// 	console.log("if", myResearch.countDocuments);
		// }
		console.log(myResearch);
		res.json(myResearch);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/offer/:id", async (req, res) => {
	//? url http://127.0.0.1:3000/offers/:id   
	try {
		const id = req.params.id    // ne pas noter les : dans Postman
		//console.log(id);

		const myResearchById = await Offer.findById(id)
			//.select("_id product_details owner")
			.populate("owner", "account");

		//console.log(myResearchById);
		res.json(myResearchById);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//! export de mes routes
module.exports = router;
