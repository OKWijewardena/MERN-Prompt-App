const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    userID: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        require: true
    },
    date: {
        type: String,
        required: true
    }
});

const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = paymentModel;
