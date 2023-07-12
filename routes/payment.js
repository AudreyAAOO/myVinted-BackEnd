const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

const router = express.Router(); //? déclarer les routes


//* import du model 'Transaction'
const Transaction = require("../models/Transaction");

router.post("/payment", async (req, res) => {

    try {
        console.log("req.body: ", req.body);
        const stripeToken = req.body.source;// Réception du token créer via l'API Stripe depuis le front
        console.log("stripeToken:", stripeToken);
        // Créer une requête à stripe pour créer une transaction
        const payment = await stripe.charges.create({
            amount: req.body.amount,
            currency: "eur",
            //title: req.body.title,
            description: `Paiement vinted pour : ${req.body.title}`,
            source: req.body.source,  // On envoie ici le token
            //date_of_payment: req.body.date_of_payment
        });

        console.log("response.status: ", response.status);

        // TODO
        // Si le paiement est effectué, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé
        console.log("responseFromStripe- payment :", payment);

        // Crée une transaction grâce au model
        const newTransaction = new Transaction({ amount, currency, title, description, token, source }); // date_of_payment

        // Sauvegarder la transaction dans une BDD MongoDB
        const response = {
            // _id: newTransaction._id,
            amount: newTransaction.amount,
            currency: newTransaction.currency,
            title: newTransaction.title,
            description: newTransaction.description,
            // token: newTransaction.token,
            source: newTransaction.source,
            // date_of_payment: newTransaction.date_of_payment,
        };

        console.log('response', response);
        await newTransaction.save(response);


        // Je renvoie au client le status de la réponse de stripe
        res.json(newTransaction.status);
        console.log("newTransaction.status", newTransaction.status);
    } catch (error) {
        console.log("error.message: ", error.message);
        res.status(400).json({ message: error.message });
    }
});

//! export de mes routes
module.exports = router;