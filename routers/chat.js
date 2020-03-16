const express = require('express');
const auth = require('../middleware/auth');
const ChatController = require('../controllers/chat');

const chat_controller = new ChatController();

const router = new express.Router();

router.get('/:id', auth, chat_controller.getMessages);
router.get('/getDialogueId/:id', auth, chat_controller.getDialogueId);
router.get('/', auth, chat_controller.getDialogues);
router.post('/create', auth, chat_controller.createChat);
router.post('/addMessage', auth, chat_controller.addMessage);



module.exports = router;
