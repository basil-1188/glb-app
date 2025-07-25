const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinary');

const storage = multer.memoryStorage();

const multerUpload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

const cloudinaryUpload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await uploadToCloudinary(req.file);
    req.uploadResult = result;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  multerUpload, 
  cloudinaryUpload 
};