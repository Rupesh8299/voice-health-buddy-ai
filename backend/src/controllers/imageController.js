const { analyzeImage } = require('../services/medgemmaService');
const { getAIResponse } = require('../services/openaiService');

const handleImageUpload = async (req, res) => {
  try {
    console.log("🛂 Controller: handleImageUpload called");
    console.log("📥 Incoming image upload...");
    console.log("File received:", req.file?.originalname);
    console.log("File size:", req.file?.size);

    if (!req.file || !req.file.buffer) {
      console.error("❌ No file received or buffer is empty.");
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const imageBuffer = req.file.buffer;

    // Step 1: MedGemma analysis
    console.log("🧠 Sending to MedGemma...");
    console.log("🛂 Controller: calling medgemmaService.analyzeImage");
    const gemmaAnalysis = await analyzeImage(imageBuffer);
    console.log("🧠 MedGemma result:", gemmaAnalysis);

    // Step 2: Send to GPT with MedGemma insight as a conversation
    console.log("🗣️ Sending to OpenRouter GPT...");
    const response = await getAIResponse({
      history: [
        {
          role: 'user',
          content: `I uploaded a skin image. Here is the image analysis result from MedGemma: "${gemmaAnalysis}". Can you help me understand what this might be and suggest what to do next?`,
        },
      ],
    });

    console.log("✅ GPT Response:", response);

    res.json({
      insights: gemmaAnalysis,
      analysis: response,
    });
  } catch (error) {
    console.error('❌ Error in imageController:', error.message);
    res.status(500).json({ error: 'Image processing failed.' });
  }
};

module.exports = { handleImageUpload };
