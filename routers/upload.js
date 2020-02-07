const express = require('express');
const storage = require('../utils/upload_config');
const auth = require('../middleware/auth')
const UploadController = require('../controllers/upload');

const upload_controller = new UploadController();

const router = new express.Router();

router.post('/', auth, storage, upload_controller.upload);

module.exports = router;
