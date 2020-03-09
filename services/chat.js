const mongoose = require('mongoose');
const Chat = require('../models/chat');
const Message = require('../models/message');

const getDialogues = async function(id) {
    try {
        return await Chat.aggregate([
            {
                $match: {
                    users: {$all: [mongoose.Types.ObjectId(id)]}
                }
            },  {
                $unwind: { path: '$users' }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            {
                $unwind:  '$users',
            },
            {
                $unset: ['users.tokens', 'users.password', 'users.__v']
            },
            {
                $group: {
                    _id: '$_id',
                    users: { $push: '$users' }
                }
            },
            // {
            //     $lookup: {
            //         from: 'message',
            //         as: 'messages',
            //         let: { _id: '$_id' },
            //         pipeline: [
            //             { $match: {
            //                     $expr: { $eq: [ '$chat_id', '$$_id' ] }
            //                 } },
            //             { $limit: 1 }
            //         ]
            //     }
            // }
        ]);
    } catch (e) {
        throw new Error(e.message);
    }
}

const getMessages = async function(id) {
    try {
        return Message.find({chat_id: id});
    } catch (e) {
        throw new Error(e.message);
    }
}

const addMessage = async function(message, chat_id, owner_id) {
    try {
        const msg = new Message({message, chat_id, owner_id});
        await msg.save();
    } catch (e) {
        throw new Error(e);
    }
}

const createChat = async function(users) {
    try {
        console.log(users)
        const chat = new Chat(users);
        await chat.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports = {
    getDialogues,
    getMessages,
    addMessage,
    createChat
}
