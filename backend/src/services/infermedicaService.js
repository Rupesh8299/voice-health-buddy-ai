const axios = require('axios');

exports.checkSymptoms = async ({ age, gender, symptoms }) => {
  const appId = process.env.INFERMEDICA_APP_ID;
  const appKey = process.env.INFERMEDICA_APP_KEY;
  // Placeholder: Replace with actual Infermedica API call
  // For now, just return a mock response
  return {
    conditions: [
      { name: 'Strep throat', probability: 0.7 },
      { name: 'Flu', probability: 0.5 }
    ],
    advice: {
      medications: ['Paracetamol', 'Throat lozenges'],
      specialist: 'ENT',
      urgency: 'Moderate – See doctor if persists'
    }
  };
};
