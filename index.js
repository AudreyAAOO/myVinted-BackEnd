require("dotenv").config(); // affiche des logs de connexion
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

//const uid2 = require("uid2"); //?  package qui génère une chaîne de caractères aléatoires
//? crypto-js est une librairie d'algorithmes cryptographiques.
//const SHA256 = require("crypto-js/sha256"); //? package pour encrypter une string
//const encBase64 = require("crypto-js/enc-base64"); //? package pour transformer l'encryptage en string
// La ligne suivante ne doit être utilisée qu'une seule fois et au tout début du projet. De préférence dans index.js
require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

//* création du serveur
const app = express();

//* récupérer les paramètres de type Body
app.use(express.json());

app.use(cors()); //* le module cors permet d'autoriser ou non les demandes provenant de l'extérieur.

//* se connecter à la BDD
const connectDatabase = async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGODB_URI); // Pour se connecter à la BDD, sans préciser les identifiants
		console.log("connected to database 🗃️ ");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

connectDatabase();

//! import des routes
const signup = require("./routes/signup");
const login = require("./routes/login");
const publish = require("./routes/publish");
//const test = require("./routes/test");

//! je demande à mon serveur d'utiliser les routes importées app.use ("");
app.use(signup);
app.use(login);
app.use(publish);
//app.use(test);


app.get("/", (req, res) => {
	res.json("👩‍💻 Bienvenue sur l'API myVinted d'Audrey 👾");
});

app.all("*", (req, res) => {
	res.status(404).json({ message: "⚠️ This route doesn't exist !!! ⚠️" });
});

app.listen(process.env.PORT, () => {
	console.log(" 🚀 Server started !!! 🚀");
});
