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
router.post(
	"/offer/publish",
	isAuthenticated,
	fileUpload(),   //! On positionne le middleware `fileUpload` dans la route `/publish`
	async (req, res) => {
		try {
			//console.log(req.files); //! uploader la photo sur Cloudinary



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

			if (title && price && req.files.picture) {  //req.files?.picture
				//todo je crée une nouvelle annonce sans l'image
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

					owner: req.user, // Mongoose comprend que c'est une réf et n'enregistre que l'_id  = req.user._id

					date_of_offer: new Date(),
				});

				// Si on ne reçoit qu'une image (req.files.picture n'est donc pas un tableau)
				if (!Array.isArray(req.files.picture)) {
					// On vérifie qu'on a bien affaire à une image
					if (req.files.picture.mimetype.slice(0, 5) !== "image") { // vérifier si les 5 premiers caractères de la clé mimetype forme le mot 'image'
						return res.status(400).json({ message: "You must send images" });
					}

					const result = await cloudinary.uploader.upload(  // Envoi de l'image à cloudinary
						convertToBase64(req.files.picture),
						{
							folder: `Vinted/${newOffer._id}`,
							//folder: `Vinted/`,
							public_id: "preview", // donner un nom par défaut plutôt que la string alatoire générée par Cloudinary
						}
					);

					// ajout de l'image dans newOffer
					newOffer.product_image = result;
					newOffer.product_pictures.push(result);
				} else {
					// Si on a affaire à un tableau = plusieurs images

					for (let i = 0; i < req.files.picture.length; i++) {
						const picture = req.files.picture[i];

						// if (picture.mimetype.slice(0, 5) !== "image") {
						// 	return res.status(400).json({ message: "You must send images" });
						// }

						if (i === 0) {
							// On envoie la première image à cloudinary et on en fait l'image principale (product_image)
							const result = await cloudinary.uploader.upload(  // Envoi de l'image à cloudinary
								convertToBase64(picture), {
								folder: `Vinted/${newOffer._id}`,
								public_id: "preview",
							});



							// ajout de l'image dans newOffer
							newOffer.product_image = result;
							newOffer.product_pictures.push(result);
						} else {
							// On envoie toutes les autres à cloudinary et on met les résultats dans product_pictures
							const result = await cloudinary.uploader.upload(
								convertToBase64(picture),
								{
									folder: `Vinted/${newOffer._id}`,
									public_id: "preview",
								}
							);
							newOffer.product_pictures.push(result);
						}
					}
				}

				await newOffer.save();

				res.json(newOffer);

			} else {
				res
					.status(400)
					.json({ message: "title, price and picture are required" });
			}

		} catch (error) {
			console.log(error.message);
			res.status(400).json({ message: error.message });
		}
	}
);

// Route qui nous permet de récupérer une liste d'annonces, en fonction de filtres
// Si aucun filtre n'est envoyé, cette route renverra l'ensemble des annonces
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

		//! création d'un objet dans lequel on va stocker nos différents filtres
		let filters = {};

		if (req.query.title) {
			filters.product_name = new RegExp(req.query.title, "i");
		}

		if (req.query.priceMin) {
			filters.product_price = {
				$gte: req.query.priceMin,
			};
		}

		if (req.query.priceMax) {
			if (filters.product_price) {
				filters.product_price.$lte = req.query.priceMax;
			} else {
				filters.product_price = {
					$lte: req.query.priceMax,
				};
			}
		}

		let sort = {};

		if (req.query.sort === "price-desc") {
			sort = { product_price: -1 };
		} else if (req.query.sort === "price-asc") {
			sort = { product_price: 1 };
		}

		let page;

		if (Number(req.query.page) < 1) {
			page = 1;
		} else {
			page = Number(req.query.page);
		}
		//   SKIP ET LIMIT
		let limit = Number(req.query.limit);

		//.skip(10) // = sauter l'affichage des 10 premières annonces
		const offers = await Offer.find((filters)
			// { product_name: new RegExp("sac", "i") },
			// { product_price: { $gte: 50, $lte: 150 } }
		)
			.sort(sort)
			.limit(limit) // renvoyer y résultats
			.skip((page - 1) * limit) // ignorer les x résultats
			// .select("product_name product_price")
			.populate({
				path: "owner",
				select: "account",
			})
		//.countDocuments();
		//si countDocuments < limit log myResearch> skip nbr de docs en limit
		// if (myResearch > 1) {
		// 	console.log("if", myResearch.countDocuments);
		// }

		// cette ligne va nous retourner le nombre d'annonces trouvées en fonction des filtres
		const count = await Offer.countDocuments(filters);

		console.log(offers);
		res.json({
			count: count,
			offers: offers,
		});

	} catch (error) {
		console.log(error.message);
		res.status(400).json({ message: error.message });
	}
});

// Route qui permmet de récupérer les informations d'une offre en fonction de son id
router.get("/offer/:id", async (req, res) => {
	//? url http://127.0.0.1:3000/offer/:id
	try {
		const id = req.params.id; // ne pas noter les : dans Postman
		//console.log(id);

		const offer = await Offer.findById(id)
			//.select("_id product_details owner")
			.populate({
				path: "owner",
				select: "account.username account.phone account.avatar",
			});

		console.log("offer:", offer);

		res.json(offer);

	} catch (error) {
		console.log(error.message);
		res.status(400).json({ message: error.message });
	}
});

//! export de mes routes
module.exports = router;
