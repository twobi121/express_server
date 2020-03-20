const chatService = require('../services/chat');

class ChatController {

    getDialogues = async (req, res) => {
        try {
            const dialogues = await chatService.getDialogues(req.user._id, +req.params.skipValue);
            res.status(200).send(dialogues);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    getDialogueId = async (req, res) => {
        try {
            if (req.user._id === req.params.id) {
                return null;
            }
            const dialogueId = await chatService.getDialogueId(req.user._id, req.params.id);
            res.status(200).send(dialogueId);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }


    getMessages = async (id, skipValue) => {
        try {
            return await chatService.getMessages(id, skipValue);
            // res.status(200).send(messages);
        } catch (e) {
            // res.status(400).send({error: e.message});
        }
    }

    addMessage = async (message) => {
        try {
            return await chatService.addMessage(message.message, message.chat_id, message.owner_id, message.receivers_id);
        } catch (e) {
            // res.status(400).send({error: e.message});
        }
    }

    updateMessage = async (chat_id, user_id) => {
        try {
            await chatService.updateMessage(chat_id, user_id);
        } catch (e) {
            // res.status(400).send({error: e.message});
        }
    }

    createChat = async (req, res) => {
        try {

            const chat = await chatService.createChat(req.user._id, req.body.id);
            res.status(200).send(chat);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    getUnreadMessagesNumber  = async (req, res) => {
        try {
            const number = await chatService.getUnreadMessagesNumber(req.user._id);
            res.status(200).send(number[0]);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }
}

module.exports = ChatController;
