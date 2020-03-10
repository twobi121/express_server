const chatService = require('../services/chat');

class ChatController {

    getDialogues = async (req, res) => {
        try {
            const dialogues = await chatService.getDialogues(req.user._id);
            res.status(200).send(dialogues);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    getMessages = async (req, res) => {
        try {
            const messages = await chatService.getMessages(req.params.id);
            res.status(200).send(messages);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    addMessage = async (message) => {
        try {
            return await chatService.addMessage(message.message, message.chat_id, message.owner_id);
        } catch (e) {
            // res.status(400).send({error: e.message});
        }
    }

    createChat = async (req, res) => {
        try {
            await chatService.createChat(req.body);
            return res.status(200).send(JSON.stringify('чат успешно удален'));
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }
}

module.exports = ChatController;
