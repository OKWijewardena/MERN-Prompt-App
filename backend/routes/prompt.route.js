const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const promptModel = require("../models/prompt.model"); // Import your prompt model

// Add a new prompt
router.post("/add", async (req, res) => {
  try {
    const { userID, category , topic, content } = req.body;
    // Create a new prompt document in the database
    const newPrompt = new promptModel({ userID, category, topic, content });
    await newPrompt.save();
    res.status(201).json({ message: "Prompt added successfully", prompt: newPrompt });
  } catch (error) {
    res.status(500).json({ error: "Failed to add prompt" });
    console.log(error);
  }
});

// Get all prompts
router.get("/get", async (req, res) => {
  try {
    const prompts = await promptModel.find();
    res.status(200).json({ prompts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

// Get a specific prompt by ID
router.get("/get/:promptID", async (req, res) => {
  const { promptID } = req.params;
  try {
    const prompt = await promptModel.findById(promptID);
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    res.status(200).json({ prompt });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

// Update a specific prompt by ID
router.patch("/update/:promptID", async (req, res) => {
  const { promptID } = req.params;
  try {
    const updatedPrompt = await promptModel.findByIdAndUpdate(promptID, req.body, {
      new: true, // Return the updated prompt
    });
    if (!updatedPrompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    res.status(200).json({ message: "Prompt updated successfully", prompt: updatedPrompt });
  } catch (error) {
    res.status(500).json({ error: "Failed to update prompt" });
  }
});

// Delete a specific prompt by ID
router.delete("/delete/:promptID", async (req, res) => {
  const { promptID } = req.params;
  try {
    const deletedPrompt = await promptModel.findByIdAndRemove(promptID);
    if (!deletedPrompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    res.status(200).json({ message: "Prompt deleted successfully", prompt: deletedPrompt });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete prompt" });
  }
});

router.get("/download", async (req, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="prompt_details.pdf"');

    const prompts = await promptModel.find(); // Fetch all prompts from your model

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(14).text("Prompt Details", { align: "center" });

    // Loop through prompts and add details to the PDF
    prompts.forEach((prompt) => {
      doc.text(`UserID: ${prompt.userID}`);
      doc.text(`Category: ${prompt.category}`);
      doc.text(`Topic: ${prompt.topic}`);
      doc.text(`Content: ${prompt.content}`);
      doc.moveDown();
    });

    doc.end(); // Finalize the PDF

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});



module.exports = router;
