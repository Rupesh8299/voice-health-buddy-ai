// src/services/medgemmaService.js

async function analyzeImage(file) {
  console.log("🧠 Calling MedGemma model...");
  console.log("📄 Analyzing file:", file.originalname);

  try {
    // Dynamic import of @gradio/client
    const { Client, handle_file } = await import('@gradio/client');

    console.log("🔌 Attempting to connect to MedGemma API...");
    
    const timeout = 300000; // 5 minutes
    console.log(`🔄 Connecting to MedGemma API (timeout: ${timeout/1000}s)...`);
    
    const client = await Promise.race([
      Client.connect("warshanks/medgemma-4b-it", { hf_token: process.env.HF_TOKEN })
        .then(client => {
          console.log("✅ Successfully created Gradio client");
          return client;
        }),
      new Promise((_, reject) => 
        setTimeout(() => {
          console.error(`⏰ Connection timed out after ${timeout/1000}s`);
          reject(new Error(`Connection timeout after ${timeout/1000} seconds`));
        }, timeout)
      )
    ]);

    console.log("✅ Connected to MedGemma API");

    // Convert image buffer to data URL
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Prepare the input according to API spec
    console.log("📤 Preparing to send image for analysis...");
    const predictInput = {
      message: {
        text: "Please analyze this medical image and describe what you see. Focus on any potential medical conditions or concerns.",
        files: [handle_file(dataUrl)]
      },
      param_2: "You are a helpful medical expert.",
      param_3: 2048
    };
    console.log("📤 Input prepared, sending to API...");
    
    // Send prediction request using same timeout
    console.log(`🔄 Sending prediction request (timeout: ${timeout/1000}s)...`);
    
    const result = await Promise.race([
      client.predict("/chat", predictInput, { api_name: "/chat" }).then(result => {
        console.log("✅ Raw API response received:", JSON.stringify(result, null, 2));
        if (!result || result.error) {
          console.error("❌ API returned error:", result?.error || "No result");
          throw new Error(result?.error?.message || "API returned no result");
        }
        if (result.type === 'error' || !result.data) {
          throw new Error("Model returned an error response");
        }
        return result;
      }),
      new Promise((_, reject) => 
        setTimeout(() => {
          console.error(`⏰ Prediction request timed out after ${timeout/1000}s`);
          reject(new Error(`Prediction timeout after ${timeout/1000} seconds`));
        }, timeout)
      )
    ]);

    console.log("✅ MedGemma analysis received:", result);
    
    if (!result || !result.data) {
      throw new Error("No analysis data received from MedGemma");
    }

    // The result is often nested inside an array
    const analysis = Array.isArray(result.data) ? result.data[0] : result.data;
    return analysis;
  } catch (error) {
    console.error("❌ MedGemma API error details:", {
      error,
      type: typeof error,
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      cause: error?.cause
    });
    
    let errorMessage = "Unable to analyze the image. ";
    
    if (error.message) {
      if (error.message.includes("timeout")) {
        errorMessage += "The analysis timed out.";
      } else if (error.message.includes("connect")) {
        errorMessage += "Could not connect to the service.";
      } else {
        errorMessage += error.message;
      }
    } else if (typeof error === 'string') {
      errorMessage += error;
    } else {
      errorMessage += "An unknown error occurred.";
    }

    return errorMessage + " Please try again later.";
  }
}

module.exports = { analyzeImage };
