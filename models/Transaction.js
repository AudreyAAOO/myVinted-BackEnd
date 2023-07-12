//todo import de mongoose
const mongoose = require("mongoose");

//todo création d'un modèle
const Transaction = mongoose.model("Transaction", {

    amount: { type: Number, min: 0, max: 100000 },
    currency: String,
    title: { type: String, required: true, maxLength: 500 },
    source: { type: Object },
    //date_of_payment: { type: Date, default: Date.now },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
    },



});

//! export du modèle
module.exports = Transaction;
