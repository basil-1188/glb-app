const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const { multerUpload, cloudinaryUpload } = require('../middleware/upload');

router.post('/models', 
  multerUpload.single('model'),
  cloudinaryUpload, 
  modelController.uploadModel 
);

router.get('/models', modelController.getAllModels);
router.get('/models/:id', modelController.getModel);

module.exports = router;