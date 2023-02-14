const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);
// REACT_APP_STRIPE_SECRET_KEY
const router = express.Router(); //? déclarer les routes

router.post("/payment", async (req, res) => {

    try {
        console.log(req.body);
        const stripeToken = req.body.stripeToken;// Réception du token créer via l'API Stripe depuis le front

        // Créer une requête à stripe pour créer une transaction
        const responseFromStripe = await stripe.charges.create({
            amount: req.body.amount,
            currency: "eur",
            // title: "titre",
            description: req.body.title,
            source: stripeToken,  // On envoie ici le token

        });
        console.log(response.status);

        // TODO
        // Si le paiement est effectué, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé
        console.log(responseFromStripe);

        // TODO
        // Sauvegarder la transaction dans une BDD MongoDB


        // Je renvoie au client le status de la réponse de stripe
        res.json(responseFromStripe.status);
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
});

//! export de mes routes
module.exports = router;