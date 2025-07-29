// src/services/medgemmaService.js
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const fs = require('fs');

const client = new PredictionServiceClient();

const project = 'medicopeer';
const location = 'us-central1';
const modelId = 'medgemma-4b-pt';
const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${modelId}`;

async function analyzeImage(imageBuffer) {
  console.log("🧠 Calling MedGemma model...");
  console.log("📏 Buffer size:", imageBuffer.length);

  const request = {
    endpoint,
    instances: [
      {
        content: imageBuffer.toString('base64'),
        mimeType: 'image/png', // confirm multer gives png or jpeg
      },
    ],
  };

  try {
    const [response] = await predictionService.predict(request);
    console.log("✅ MedGemma raw response:", response);

    if (!response.predictions || response.predictions.length === 0) {
      console.log("⚠️ No predictions found.");
      return 'No visible findings in the image.';
    }

    return response.predictions[0];
  } catch (error) {
    console.error("❌ MedGemma API error:", error.message);
    return 'Failed to analyze image.';
  }
}


module.exports = { analyzeImage };
