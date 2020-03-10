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
            }, {
                $lookup: {
                    from: 'messages',
                    as: 'lastMessage',
                    let: { ch_id: '$_id' },
                    pipeline: [
                        { $match: {
                                $expr: { $eq: [ '$chat_id', '$$ch_id' ] }
                            } },
                        { $sort: {date: -1}},
                        { $limit: 1 }
                    ]
                }
            }, {
                $unwind: '$lastMessage'
            }, {
                $sort: {'lastMessage.date' : -1}
            }
        ]);
    } catch (e) {
        throw new Error(e.message);
    }
}

const getMessages = async function(id) {
    try {
        let count = await Message.find({chat_id: id}).count();
        count = count > 5 ? count - 5 : 0;
        return await Message.find({chat_id: id}).skip(count).populate('owner_id', 'avatar _id login name surname');
    } catch (e) {
        throw new Error(e.message);
    }
}

const addMessage = async function(message, chat_id, owner_id) {
    try {
        const msg = new Message({message, chat_id, owner_id});
        await msg.save();
        return await Message.findById(msg._id).populate('owner_id', 'avatar _id login name surname');
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
