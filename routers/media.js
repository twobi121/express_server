const express = require('express');
const storage = require('../utils/media_config');
const auth = require('../middleware/auth')
const MediaController = require('../controllers/media');

const media_controller = new MediaController();

const router = new express.Router();

router.post('/uploadAvatar', auth, storage, media_controller.uploadAvatar);
router.post('/uploadPhoto', auth, storage, media_controller.upload);
router.post('/create', auth, media_controller.createAlbum);
router.post('/', auth, storage, media_controller.upload);
router.get('/album/:id', auth, media_controller.getAlbum);
router.get('/lastphotos/:id', auth, media_controller.lastphotos);


// router.get('/', auth, storage, upload_controller.getAlbums);


module.exports = router;
