const express = require('express');


const UploadController = require('../controllers/upload');

const upload_controller = new UploadController();

const router = new express.Router();

router.post('/', upload_controller.upload);

module.exports = router;