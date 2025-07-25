const GLBViewer = require('../models/Model');

exports.uploadModel = async (req, res) => {
  try {
    const { name } = req.body;
    const { secure_url, public_id } = req.uploadResult;

    const model = new GLBViewer({
      name: name || req.file.originalname,
      url: secure_url,
      cloudinaryId: public_id
    });

    await model.save();
    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllModels = async (req, res) => {
  try {
    const models = await GLBViewer.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getModel = async (req, res) => {
  try {
    const model = await GLBViewer.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};