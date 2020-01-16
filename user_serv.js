const fs = require('fs');
const User = require('./model')
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8' ));

const getUsers = async function(){
    try {
        return await User.find({});
    } catch (e) {
        console.log(e)
    }
}

const addUser = async function(req) {
    // users.push(req);
    // updateJsonFile();

    try {
        const user = new User({name: req.name, surname: req.surname})
        await user.save()
        return `User ${user.name} was succesfully added `;
    } catch (e) {
        console.log(e)
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
        console.log(e)
    }

}

const deleteUserById = async function(id){
    // const userIndex = users.findIndex(item => item.id == id);
    // users.splice(userIndex, 1);
    // updateJsonFile();
    try {
        await User.deleteOne({_id: id});
        return `User with id ${id} was removed`
    } catch (e) {
        console.log(e)
    }

}

const updateUserById = async function(id, body){
    try {
        await User.findByIdAndUpdate(id, body)
        return `User with id ${id} was updated`
    } catch (e) {
        console.log(e)
    }


        //const userIndex = users.findIndex(item => item.id == id);

    // if (userIndex != -1) {
    //     users[userIndex] = {...users[userIndex], ...body};
    //     updateJsonFile();
    //     return users[userIndex];
    // } else throw new Error ('no such user');
}

// const updateJsonFile = function() {
// //     fs.writeFileSync('./users.json', JSON.stringify(users, null, ' '));
// // }


module.exports = {
    getUsers,
    addUser,
    getUserById,
    deleteUserById,
    updateUserById

}