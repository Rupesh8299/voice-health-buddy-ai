const { analyzeImage } = require('../services/medgemmaService');
const { getAIResponse } = require('../services/openaiService');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const handleImageUpload = async (req, res) => {
  let tempFilePath;
  try {
    console.log("🛂 Controller: handleImageUpload called");
    console.log("📥 Incoming image upload...");
    console.log("File received:", req.file?.originalname);
    console.log("File size:", req.file?.size);

    if (!req.file || !req.file.buffer) {
      console.error("❌ No file received or buffer is empty.");
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    // Step 1: MedGemma analysis
    console.log("🧠 Sending to MedGemma...");
    console.log("🛂 Controller: calling medgemmaService.analyzeImage");
    let gemmaAnalysis;
    try {
      // Pass the entire file object to the service
      gemmaAnalysis = await analyzeImage(req.file);
      console.log("🧠 MedGemma result:", gemmaAnalysis);
    } catch (error) {
      console.error("❌ MedGemma analysis failed:", error.message);
      gemmaAnalysis = "Unable to analyze the image at this time.";
    }

    // Step 2: Send to GPT with MedGemma insight as a conversation
    console.log("🗣️ Sending to OpenRouter GPT...");
    const response = await getAIResponse({
  history: [
    {
      role: 'user',
      content: `I uploaded a medical image. Here is the image analysis result from MedGemma: "${gemmaAnalysis}". 
      Please provide:
      1. A plain-language explanation of the findings.
      2. Possible causes (with caution about limitations).
      3. Recommendations for next steps (in bullet points).`,
    },
  ],
});

    console.log("✅ GPT Response:", response);

    res.json({
  insights: gemmaAnalysis || "No insights available.",
  analysis: response || "No analysis available.",
  recommendations: [
    "Consult with a healthcare professional if symptoms persist",
    "Keep track of any changes in the affected area",
    "Avoid self-medicating without expert advice"
  ]
});

  } catch (error) {
    console.error('❌ Error in imageController:', error.message);
    res.status(500).json({ error: 'Image processing failed.' });
  } finally {
    // No longer need to create or clean up a temporary file
  }
};

module.exports = { handleImageUpload };
