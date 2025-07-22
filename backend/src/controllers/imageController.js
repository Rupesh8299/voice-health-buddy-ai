const { analyzeImage } = require('../services/replicateService');

exports.handleImageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const diagnosis = await analyzeImage(req.file.path);
    res.json({ diagnosis });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
