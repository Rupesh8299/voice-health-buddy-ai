const { analyzeImage } = require('../services/medgemmaService');
const { getAIResponse } = require('../services/openaiService');

const handleImageUpload = async (req, res) => {
  try {
    console.log("🛂 Controller: handleImageUpload called");
    console.log("📥 Incoming image upload...");
    console.log("File received:", req.file?.originalname);
    console.log("File size:", req.file?.size);

    if (!req.file) {
      console.error("❌ No file received.");
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    if (!req.file.buffer || req.file.buffer.length === 0) {
      console.error("❌ File buffer is empty.");
      return res.status(400).json({ error: 'Uploaded file is empty.' });
    }

    // Log more details about the uploaded file
    console.log("📄 File details:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

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

    // Ensure both insights and analysis are strings
    // Format responses
    const formattedGemmaAnalysis = typeof gemmaAnalysis === 'string' ? gemmaAnalysis : JSON.stringify(gemmaAnalysis);
    const formattedGPTResponse = typeof response === 'string' ? response : JSON.stringify(response);
    
    // Send both analyses
    res.json({
      insights: formattedGemmaAnalysis,
      analysis: formattedGPTResponse,
      recommendations: formattedGPTResponse.split('\n').filter(line => line.trim().startsWith('•')),
    });
  } catch (error) {
    console.error('❌ Error in imageController:', error.message);
    res.status(500).json({ error: 'Image processing failed.' });
  }
};

module.exports = { handleImageUpload };
