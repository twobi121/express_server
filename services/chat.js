const mongoose = require('mongoose');
const Chat = require('../models/chat');
const Message = require('../models/message');

const getDialogues = async function(id, skipValue) {
    try {
        const count = await Chat.find({users: id}).count();
        if (count === skipValue) {
            return [];
        }
        const limit = count - skipValue >= 10 ? 10 : count - skipValue;

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
            }, {
                $lookup: {
                    from: 'messages',
                    as: 'messages',
                    let: { ch_id: '$_id' },
                    pipeline: [
                        { $match: {
                                $expr: { $eq: [ '$chat_id', '$$ch_id' ] }
                            } },
                        { $sort: {date: -1}}]
                }}, {
                $project: {
                    _id: '$_id',
                    users: '$users',
                    lastMessage: '$lastMessage',
                    unreadMsgNumber: {
                        $filter: {
                            input: "$messages",
                            "as": "message",
                            cond: { $and: [
                                    {$ne: ["$$message.owner_id", id]},
                                    {$ne: ['$$message.readUsers', []]},
                                    {$in: [id, '$$message.readUsers']}
                                ]
                            }
                        }
                    }
                }}, {
                $addFields: {
                    unreadMsgNumber: {
                        $size: '$unreadMsgNumber'
                    }
                }
            }, {
                $skip: skipValue
            }, {
                $limit: limit
            }
        ]);
    } catch (e) {
        throw new Error(e.message);
    }
}

const getDialogueId = async function(loggedUser_id, user_id) {
    try {
        const chat = await Chat.aggregate([
            {   $match: {
                    $and: [
                        {users: { $all: [mongoose.Types.ObjectId(loggedUser_id), mongoose.Types.ObjectId(user_id)]}},
                        {users: { $size: 2} }
                    ]}
            }, {
                $addFields: {
                    _id: '$_id'
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users',
                }
            },
        ]);
        if (chat.length) {
            return chat[0];
        } else return await this.createChat(loggedUser_id, user_id);
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
    } catch (e) {
        throw new Error(e);
    }
}

const updateMessage = async function(chat_id, user_id) {
    await Message.updateMany({chat_id: chat_id, owner_id: {$ne: user_id}, readUsers: {$all: [mongoose.Types.ObjectId(user_id)]}}, { $pullAll: {readUsers: [user_id] } } )
}

const createChat = async function(loggedUserId, usersIds) {
    try {
        let ids = [];
        ids = ids.concat(usersIds, loggedUserId.toString());
        ids.sort((a, b) => a - b);

        const checkChat = await Chat.find({users: ids})
        if (checkChat.length) {
            return checkChat[0]
        }
        const newChat = new Chat({users: ids});
        await newChat.save();
        // return await Chat.findById(chat._id).populate('users', {password: 0, tokens: 0, __v: 0})
        const chat = await Chat.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(newChat._id)
                }
            }, {
                $unwind:  '$users',
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users',
                }
            }, {
                $unwind:  '$users',
            }, {
                $unset: ['users.tokens', 'users.password', 'users.__v']
            }, {
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
                            $ne: ["$$user._id", loggedUserId]
                        }
                    }
                    }
            }
            }
        ]);
        return chat[0];
    } catch (e) {
        throw new Error(e.message);
    }
}

const getUnreadMessagesNumber = async function(id) {
    try {
        const number = await Chat.aggregate([
            {
                $match: {
                    users: {$all: [mongoose.Types.ObjectId(id)]}
                }
            }, {
                $lookup: {
                    from: 'messages',
                    as: 'messages',
                    let: { ch_id: '$_id' },
                    pipeline: [
                        { $match: {
                                $expr: { $eq: [ '$chat_id', '$$ch_id' ] }
                            }
                        }]
                }}, {
                $project: {
                    _id: '$_id',
                    unreadMsgNumber: {
                        $filter: {
                            input: "$messages",
                            "as": "message",
                            cond: { $and: [
                                    {$ne: ["$$message.owner_id", id]},
                                    {$ne: ['$$message.readUsers', []]},
                                    {$in: [id, '$$message.readUsers']}
                                ]
                            }
                        }
                    }
                }}, {
                $addFields: {
                    unreadMsgNumber: {
                        $size: '$unreadMsgNumber'
                    }
                }}, {
                $group: {
                    _id : null,
                    number: {$sum: '$unreadMsgNumber'}
                }}, {
                $project: {
                    _id: 0,
                    number: 1
                }}
        ]);
        return number;
    } catch(e) {
        throw new Error(e.message);
    }
}



module.exports = {
    getDialogues,
    getDialogueId,
    getMessages,
    addMessage,
    updateMessage,
    createChat,
    getUnreadMessagesNumber
}
