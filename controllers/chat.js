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

    getDialogueId = async (req, res) => {
        try {
            const dialogueId = await chatService.getDialogueId(req.user._id, req.params.id);
            if (dialogueId.length) {
                res.status(200).send(dialogueId[0]._id);
            } else res.status(200).send(null);

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
            const chatId = await chatService.createChat([req.body.id, req.user._id]);
            return chatId;
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }
}

module.exports = ChatController;
