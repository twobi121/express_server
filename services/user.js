const fs = require('fs');
const User = require('../models/user');
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8' ));
const Pets = require('../models/pets');
const mongoose = require('mongoose');

const getUsers = async function(){
    try {
        return await User.find({}).select('-tokens');
    } catch (e) {
        throw new Error(e.message);
    }
}

const addUser = async function(login, name, surname, password) {
    // users.push(req);
    // updateJsonFile();

    try {
        const user = new User({login, name, surname, password});
        await user.save();
        return `User ${user.login} was succesfully added `;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getUserById = async function(id) {
    // const user = users.find(item => item.id == id);
    // if (!user) {
    //     throw new Error ('no such user');
    // } else

    try {
        return await User.findById(id);
    } catch (e) {
        throw new Error(e.message);
    }

}

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

}

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
}

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
}

const getUserPets = async function(id) {
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
            { $match: { "_id": mongoose.Types.ObjectId(id) } }

        ])
    } catch (e) {
        throw new Error(e.message);
    }
}

const login = async function(login, password){
    const user = await User.findByCredentials(login, password);
    const token = await user.generateAuthToken();
    return {user, token};
}

const logout = async function(req){
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    });
    await req.user.save()
}

module.exports = {
    getUsers,
    addUser,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserPetsById,
    getAllUsersWithPets,
    getUserPets,
    login,
    logout

}