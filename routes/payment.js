const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

const router = express.Router(); //? déclarer les routes


//* import du model 'Transaction'
const Transaction = require("../models/Transaction");

router.post("/payment", async (req, res) => {

    try {
        console.log(req.body);
        const stripeToken = req.body.stripeToken;// Réception du token créer via l'API Stripe depuis le front

        // Créer une requête à stripe pour créer une transaction
        const responseFromStripe = await stripe.charges.create({
            amount: req.body.amount,
            currency: req.body.currency,
            title: req.body.title,
            source: stripeToken,  // On envoie ici le token
        });

        console.log("response.status: ", response.status);

        // TODO
        // Si le paiement est effectué, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé
        console.log("responseFromStripe :", responseFromStripe);

        // Sauvegarder la transaction dans une BDD MongoDB
        await newTransaction.save();
        const response = {
            _id: newTransaction._id,
            amount: newTransaction.amount,
            currency: newTransaction.currency,
            title: newTransaction.title,
            source: newTransaction.stripeToken,
            date_of_payment: { type: Date, default: Date.now },
            // email: newTransaction.email,
        };


        // Je renvoie au client le status de la réponse de stripe
        res.json(responseFromStripe.status);
        res.json(response);
    } catch (error) {
        console.log("error.message: ", error.message);
        res.status(400).json({ message: error.message });
    }
});

//! export de mes routes
module.exports = router;