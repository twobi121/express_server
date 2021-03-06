const fs = require('fs');
const User = require('../models/user');
// const users = JSON.parse(fs.readFileSync('./users.json', 'utf8' ));
const Pets = require('../models/pets');
const Request = require('../models/requests');
const Friend = require('../models/friend');
const Chat = require('../models/chat');
const mongoose = require('mongoose');

const getUsers = async function(body) {
    try {
        let match;
        const skip = body.number * (body.page - 1);
        if (!body.value) {
            match = {};
        } else if (body.value) {
            const value = body.value.split(' ');
            if (value.length === 1) {
                match = {$or: [{'name': new RegExp('^' + body.value, 'i')}, {'surname': new RegExp('^' + body.value, 'i')}]}
            } else match = {
                            $and: [
                                {
                                    $or: [
                                        {'name': new RegExp('^' + value[0], 'i')},
                                        {'name': new RegExp('^' + value[1], 'i')},
                                    ]
                                },
                                {
                                    $or: [
                                        {'surname': new RegExp('^' + value[0], 'i')},
                                        {'surname': new RegExp('^' + value[1], 'i')}
                                    ]
                                },
                            ]
            };
        }
        return await User.aggregate([
            { $match: match},
            { $facet: {
                    users: [
                        {$sort: {[body.sort]: 1}},
                        {$skip: skip},
                        {$limit: body.number},
                        {$unset: [ "password", "tokens", "__v" ]}
                    ],
                    totalCount: [
                        { "$count": "count" }
                    ]
                }},
            {$unwind: '$users'},
            {$unwind: '$totalCount'},
            {$replaceRoot: { newRoot: {
                        $mergeObjects: [ "$users", { totalCount: "$totalCount.count" } ] }}
            }
        ]);
    } catch (e) {
        throw new Error(e.message);
    }
};

const addUser = async function(data) {
    try {
        const user = new User({...data});
        await user.save();
        return `User ${user.login} was succesfully added `;
    } catch (e) {
        throw new Error(e.message);
    }
};

const getUserById = async function(id) {
    try {
        return await User.findById(id).select('-tokens -password -__v');
    } catch (e) {
        throw new Error(e.message);
    }
};

const getUserByLogin = async function(login) {
    try {
        return User.find({login: login}).select('-tokens -password -__v');
    } catch (e) {
        throw new Error(e.message);
    }
};

const getIsFriend = async function(login, _id) {
    try {
        return await User.aggregate([
            {
                $match: {login}
            }, {
                $lookup: {
                    from: "friends",
                    let: {
                        user_id: "$_id",
                        id: _id
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                {
                                                    $eq: [
                                                        "$$user_id",
                                                        "$friend1_id"
                                                    ]
                                                },
                                                {
                                                    $eq: [
                                                        "$$id",
                                                        "$friend2_id"
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            $and: [
                                                {
                                                    $eq: [
                                                        "$$id",
                                                        "$friend1_id"
                                                    ]
                                                },
                                                {
                                                    $eq: [
                                                        "$$user_id",
                                                        "$friend2_id"
                                                    ]
                                                }
                                            ]
                                        }]
                                }
                            }
                        }
                    ],
                    as: "friend"
                }
            },
            {
                $lookup: {
                    from: "requests",
                    localField: '_id',
                    foreignField: 'owner_id',
                    as: "request"
                }
            },
            {
                $project: {
                    friend:
                        {$cond: [{$size: "$friend"}, true, false]},
                    request:
                        {$cond: [{$size: "$request"}, true, false]}
                }
            },
            {
                $unset: [ "_id" ]
            }]
        )
    } catch (e) {
        throw new Error(e.message);
    }
};

const deleteUserById = async function(id){
    // const userIndex = users.findIndex(item => item.id == id);
    // users.splice(userIndex, 1);
    // updateJsonFile();
    try {
        await User.deleteOne({_id: id});
        return `User with id ${id} was removed`;
    } catch (e) {
        throw new Error(e.message);
    }

};

const updateUserById = async function(id, body){
    try {
        await User.findByIdAndUpdate(id, body);
        return `User with id ${id} was updated`;
    } catch (e) {
        throw new Error(e.message);
    }


        //const userIndex = users.findIndex(item => item.id == id);

    // if (userIndex != -1) {
    //     users[userIndex] = {...users[userIndex], ...body};
    //     updateJsonFile();
    //     return users[userIndex];
    // } else throw new Error ('no such user');
};

const getUserPetsById = async function(id) {
    try {
        return await Pets.find({id}).populate('owner');
    } catch (e) {
        throw new Error(e.message);
    }
}

const getAllUsersWithPets = async function() {
    try {
        return await User.aggregate([
            {
                $lookup:
                    {
                        from: 'pets',
                        localField: '_id',
                        foreignField: 'owner',
                        as: 'pets'
                    }
            },
            {$match: {pets: {$ne: []}}}

        ])
    } catch (e) {
        throw new Error(e.message);
    }
};

const getUserPets = async function(id) {
    try {
        return await User.aggregate([
            { $match: { "_id": mongoose.Types.ObjectId(id) } },
            {
                $lookup:
                    {
                        from: 'pets',
                        localField: '_id',
                        foreignField: 'owner',
                        as: 'pets'
                    }
            }
        ])
    } catch (e) {
        throw new Error(e.message);
    }
};

const login = async function(login, password){
    try {
        const user = await User.findByCredentials(login, password);
        const token = await user.generateAuthToken();
        return {user, token};
    } catch (e) {
        throw new Error(e.message);
    }
}

const logout = async function(req) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await User.findByIdAndUpdate(req.user._id, {tokens: req.user.tokens, online: false});
    } catch (e) {
        throw new Error(e.message);
    }
};

const getLogo = async function() {
    try {
        const logo = await User.find({logo: {}});
        return logo;
    } catch (e) {
        throw new Error(e.message);
    }
}

const createRequest = async function(data) {
    try {
        const request = new Request({...data});
        await request.save();
        return `Request was successfully send`;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getRequests = async function(id) {
    try {
        const requests = await Request.aggregate([
            {
                $match: { "owner_id": mongoose.Types.ObjectId(id)}
            },
            {
                $lookup:
                    {
                        from: 'users',
                        localField: 'sender_id',
                        foreignField: '_id',
                        as: 'user'
                    }
            },
            {
                $unset: [ "owner_id", "sender_id", "__v" ]
            },
            {
                $unwind: '$user'
            }
        ]);
        return requests;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getRequestsNumber = async function(id) {
    try {
        return await Request.find({'owner_id': id}).count();
    } catch (e) {
        throw new Error(e.message);
    }
}

const acceptRequest = async function(id) {
    try {
        const requests = await Request.findById(id);
        const request = new Friend({friend1_id: requests.owner_id, friend2_id: requests.sender_id});
        await request.save();
        await Request.deleteOne({_id: id});
    } catch (e) {
        throw new Error(e.message);
    }
}

const declineRequest = async function(id) {
    try {
        await Request.deleteOne({_id: id});
    } catch (e) {
        throw new Error(e.message);
    }
}

const getFriends = async function(login) {
    try {
        const user = await User.find({login});

        const friends = await Friend.aggregate([
            {
                $match: { $or: [{ friend1_id: mongoose.Types.ObjectId(user[0]._id) }, { friend2_id: mongoose.Types.ObjectId(user[0]._id) }] }
            }, {
                $project: {
                    friend_id: {
                        $cond: {
                            if: { $eq: [ user[0]._id, "$friend1_id" ] },
                            then: "$friend2_id",
                            else: "$friend1_id"
                        }
                    }
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'friend_id',
                    foreignField: '_id',
                    as: 'user'
                },
            },
            {
                $project:  {
                    "_id": 1,
                    "user._id": 1,
                    "user.avatar": 1,
                    "user.name": 1,
                    "user.surname": 1,
                    "user.login": 1,
                    "user.online": 1
                }
            },{
                $unset: ['friend_id']
            }, {
                $unwind: '$user'
            }
        ]);
       return friends;
    } catch (e) {
        throw new Error(e.message);
    }
}

const unfriend = async function(id) {
    try {
        await Friend.deleteOne({_id: id});
        return `Дружбы больше нет`;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getFriendsWithoutDialogue = async function(id, skipValue) {
    try {
        // const chats = await Chat.aggregate([
        //     {   $match: {
        //             $and: [
        //                 {users: mongoose.Types.ObjectId(id)},
        //                 {users: { $size: 2} }
        //             ]}
        //         }, {
        //             $unset: ['_id', '__v']
        //         }, {
        //         $project: {
        //             _id: '$_id',
        //             users: {
        //                 $filter: {
        //                     input: "$users",
        //                     "as": "user",
        //                     cond: {
        //                         $ne: [ "$$user", id ]
        //                     }
        //                 }
        //             }
        //         }
        //     }, {
        //         $unwind: '$users'
        //     }
        //     ]);
        //
        // const ids = chats.map(item => item.users);
        //
        // const count = await Friend.find({$or: [{ friend1_id: mongoose.Types.ObjectId(id) }, { friend2_id: mongoose.Types.ObjectId(id) }]}).count() - ids.length;
        // const limit = count - skipValue > 10 ? 10 : count - skipValue;
        // const skip = count - skipValue > 10 ? count - skipValue - 10: 0;
        //
        // const friends = await Friend.aggregate([
        //     {
        //         $match: {                     $or: [{ friend1_id: mongoose.Types.ObjectId(id) }, { friend2_id: mongoose.Types.ObjectId(id) }]
        //     }}, {
        //         $project: {
        //             friend_id: {
        //             $cond: {
        //                 if: { $eq: [ id, "$friend1_id" ] },
        //                 then: "$friend2_id",
        //                 else: "$friend1_id",
        //             }
        //         }
        //     }},  { $unwind : "$friend_id" },
        //     { $group : {
        //             _id : "$_id",
        //             friendsId : { $push : "$friend_id" },
        //         }},
        //     { $project : { _id : false,
        //             friends: {
        //                     "$filter": {
        //                     "input": "$friendsId",
        //                     "as": "item",
        //                     "cond": {
        //                         "$ne": [
        //                             { $setDifference: ["$friendsId", ids] },
        //                             []
        //                         ]
        //                     }
        //                 }
        //             }
        //     }}, {
        //     $unwind: '$friends'
        //     }, {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'friends',
        //             foreignField: '_id',
        //             as: 'user'
        //         }
        //     }, {
        //         $unwind: '$user'
        //     }, {
        //         $replaceRoot: { newRoot: '$user' }
        //     }, {
        //         $unset: [ "password", "tokens", "__v" ]
        //     }, {
        //         $sort: {'name': 1}
        //     }
        //
        // ]);

        const count = await Friend.find({$or: [{ friend1_id: mongoose.Types.ObjectId(id) }, { friend2_id: mongoose.Types.ObjectId(id) }]}).count();
        const limit = count - skipValue >= 5 ? 5 : count - skipValue;
        if (skipValue === count ) {
            return [];
        }
        const friends = await Friend.aggregate([
            {
                $match: { $or: [{ friend1_id: mongoose.Types.ObjectId(id) }, { friend2_id: mongoose.Types.ObjectId(id) }]
            }}, {
                $project: {
                    friend_id: {
                    $cond: {
                        if: { $eq: [ id, "$friend1_id" ] },
                        then: "$friend2_id",
                        else: "$friend1_id",
                    }
                }
            }},  { $unwind : "$friend_id" },
            {
                        $lookup: {
                            from: 'users',
                            localField: 'friend_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
            {
                $project:  {
                    "_id": 1,
                    "user._id": 1,
                    "user.avatar": 1,
                    "user.name": 1,
                    "user.surname": 1,
                    "user.login": 1,
                }
            },{
                $unset: ['friend_id']
            }, {
                $unwind: '$user'
            }, {
                $replaceRoot: { newRoot: '$user' }
            }, {
                $sort: {'name': 1}
            }, {
                $skip: skipValue
            }, {
                $limit: limit
            }
        ]);

        return friends
    } catch (e) {
        throw new Error(e.message);
    }
}


module.exports = {
    getUsers,
    addUser,
    getUserById,
    getUserByLogin,
    getIsFriend,
    deleteUserById,
    updateUserById,
    getUserPetsById,
    getAllUsersWithPets,
    getUserPets,
    login,
    logout,
    getLogo,
    getRequests,
    createRequest,
    acceptRequest,
    declineRequest,
    getFriends,
    unfriend,
    getFriendsWithoutDialogue,
    getRequestsNumber
}
