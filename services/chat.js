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
                $project: {
                    _id: '$_id',
                    users: {
                        $filter: {
                                    input: "$users",
                                    "as": "user",
                                    cond: {
                                        $ne: [ "$$user._id", id ]
                                    }
                                }
                        }
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
                        { $limit: 1 }, {
                            $lookup: {
                                from: 'users',
                                as: 'owner',
                                let: { owner_id: '$owner_id' },
                                pipeline: [
                                    { $match: {
                                            $expr: { $eq: [ '$_id', '$$owner_id' ] }
                                        }
                                    }, {
                                        $unset: ['tokens', 'password', 'phone', 'birth_year', 'email','__v']
                                    }]
                            }
                        }
                    ]
                }
            }, {
                $unwind: {path: '$lastMessage', "preserveNullAndEmptyArrays": true}
            }, {
                $unwind: {path: '$lastMessage.owner', "preserveNullAndEmptyArrays": true}
            },
            {
                $sort: {'lastMessage.date' : -1}
            }
        ]);
    } catch (e) {
        throw new Error(e.message);
    }
}

const getDialogueId = async function(loggedUser_id, user_id) {
    try {
        return await Chat.aggregate([
            {   $match: {
                    $and: [
                        {users: { $all: [mongoose.Types.ObjectId(loggedUser_id), mongoose.Types.ObjectId(user_id)]}},
                        {users: { $size: 2} }
                    ]}
            }, {
                $addFields: {
                    _id: '$_id'
                }
            }
        ]);
    } catch (e) {
        throw new Error(e.message);
    }
}

const getMessages = async function(id, skipValue = 0) {
    try {
        const count = await Message.find({chat_id: id}).count();
        const limit = count - skipValue > 10 ? 10 : count - skipValue;
        const skip = count - skipValue > 10 ? count - skipValue - 10: 0;

        if(count) {
            return await Message.aggregate([
                {
                    $match: { 'chat_id': mongoose.Types.ObjectId(id)}
                }, {
                    $skip: skip
                },
                {
                    $limit: limit
                },
                { $lookup: {
                        from: 'users',
                        as: 'owner',
                        let: { owner_id: '$owner_id' },
                        pipeline: [
                            { $match: {
                                    $expr: { $eq: [ '$_id', '$$owner_id' ] }
                                }
                            }, {
                                $unset: ['tokens', 'password', 'phone', 'birth_year', 'email','__v']
                            }]
                    }
                }, {
                    $unwind: '$owner'
                }
            ]);
        } else return [];
    } catch (e) {
        throw new Error(e.message);
    }
}

const addMessage = async function(message, chat_id, owner_id, readUsers) {
    try {
        const msg = new Message({message, chat_id, owner_id, readUsers});
        await msg.save();
        return await Message.aggregate([
            {
                $match: { '_id': mongoose.Types.ObjectId(msg._id)}
            },
            { $lookup: {
                    from: 'users',
                    as: 'owner',
                    let: { owner_id: '$owner_id' },
                    pipeline: [
                        { $match: {
                                $expr: { $eq: [ '$_id', '$$owner_id' ] }
                            }
                        }, {
                            $unset: ['tokens', 'password', 'phone', 'birth_year', 'email','__v']
                        }]
                }
            }, {
                $unwind: '$owner'
            }
        ]);
            // .findById(msg._id).populate('owner_id', 'avatar _id login name surname');
    } catch (e) {
        throw new Error(e);
    }
}

const updateMessage = async function(chat_id, user_id) {
    await Message.updateMany({chat_id: chat_id, owner_id: {$ne: user_id}, readUsers: {$all: [mongoose.Types.ObjectId(user_id)]}}, { $pullAll: {readUsers: [user_id] } } )
}

const createChat = async function(users) {
    try {
        const chat = new Chat(users);
        await chat.save();
        return chat._id;
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports = {
    getDialogues,
    getDialogueId,
    getMessages,
    addMessage,
    updateMessage,
    createChat
}
