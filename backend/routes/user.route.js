const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model"); // Import your user model


// Define routes here

// Register a new user
router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // Create a new user document in the database
      const newUser = new userModel({ name, email, password});
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
      console.log(error);
    }
  });
  
  // User login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.query; // Access data from query parameters
      // Check if the user exists in the database
      const user = await userModel.find({ email });
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      else{
        if (user.password !== password) {
          return res.status(401).json({ error: "Invalid password" });
        }else{
          res.status(200).json({ message: "Login successful" });
        }
      }
      // Validate the password
      
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get all users
router.get("/get", async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/get/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.get("/download", async (req, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="user_details.pdf"');

    const users = await userModel.find(); // Fetch all users from your model

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(14).text("User Details", { align: "center" });

    // Loop through users and add details to the PDF
    users.forEach((user) => {
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text("Password: [REDACTED]"); // You might want to redact or hide the password
      doc.moveDown();
    });

    doc.end(); // Finalize the PDF

  } catch (error) {
    console.error("Error generating user PDF:", error);
    res.status(500).json({ error: "Failed to generate user PDF" });
  }
});

  

module.exports = router;