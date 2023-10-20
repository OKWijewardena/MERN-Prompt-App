const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51NxmUQJSn6JcxC7Vt2kGKXaaA7maL4adID8CeHF5UrllHiwXX1o4T4y47pP9LlUQfGKL8K62zm1Vu3crspfqEUP400DReYLtTk");
const paymentModel = require("../models/payment.model"); // Import your payment model

// Create a Payment Intent
// app.post('/create-payment-intent', async (req, res) => {
//   const { amount, currency, description } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       description,
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Add a new payment
router.post("/add", async (req, res) => {
  try {
    const { userID, amount, date } = req.body;

    // Create a new payment document in the database
    const newPayment = new paymentModel({ userID, amount, date });
    await newPayment.save();
    res.status(201).json({ message: "Payment added successfully", payment: newPayment });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

// Get all payments
router.get("/get", async (req, res) => {
  try {
    const payments = await paymentModel.find();
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;
