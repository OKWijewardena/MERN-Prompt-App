const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

// Generate a prompt using GPT-4
router.post("/generate", async (req, res) => {
  try {
    const { userPrompt } = req.body;

    // Make the completion request to GPT-4 using the initialized openai client
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `generate prompt for this input ${userPrompt}`,
      max_tokens: 100,
    });

    // Extract the generated text from the response
    const generatedPrompt = response.choices[0].text;
    console.log(generatedPrompt);

    res.status(200).json({ generatedPrompt });
  } catch (error) {
    console.error("Error generating prompt:", error);
    res.status(500).json({ error: "Prompt generation failed" });
  }
});

module.exports = router;
