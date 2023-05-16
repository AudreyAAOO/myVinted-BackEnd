const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan"); // affiche des logs de connexion

require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

//* création du serveur
const app = express();

//* récupérer les paramètres de type Body
app.use(express.json());

app.use(morgan("dev"));

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
const offers = require("./routes/offers");
const payment = require("./routes/payment");



//! je demande à mon serveur d'utiliser les routes importées app.use ("");
app.use(signup);
app.use(login);
app.use(offers);
app.use(payment);


app.get("/", (req, res) => {
	res.json("👩‍💻 Bienvenue sur l'API myVinted d'Audrey 👾");
});

app.all("*", (req, res) => {
	res.status(404).json({ message: "⚠️ This route doesn't exist !!! ⚠️" });
});

app.listen(process.env.PORT || 3200, () => {
	console.log(" 🚀 Server started !!! 🚀");
});
