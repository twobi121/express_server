const express = require('express');
const auth = require('../middleware/auth');
const ChatController = require('../controllers/chat');

const chat_controller = new ChatController();

const router = new express.Router();

router.get('/getDialogueId/:id', auth, chat_controller.getDialogueId);
router.get('/getUnreadMessagesNumber', auth, chat_controller.getUnreadMessagesNumber);
router.get('/:skipValue', auth, chat_controller.getDialogues);
router.get('/:id', auth, chat_controller.getMessages);
router.post('/create', auth, chat_controller.createChat);
router.post('/addMessage', auth, chat_controller.addMessage);



module.exports = router;
