const { checkSymptoms } = require('../services/infermedicaService');

exports.handleSymptomCheck = async (req, res) => {
  try {
    const { age, gender, symptoms } = req.body;
    if (!age || !gender || !Array.isArray(symptoms)) {
      return res.status(400).json({ error: 'age, gender, and symptoms are required' });
    }
    const result = await checkSymptoms({ age, gender, symptoms });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
