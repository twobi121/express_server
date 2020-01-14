const fs = require('fs');
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8' ));

const getUsers = function(){
    return users;
}

const addUser = function(req) {
    users.push(req);
    updateJsonFile();
    return req;
}

const getUserById = function(id) {
    const user = users.find(item => item.id == id);
    if (!user) {
        throw new Error ('no such user');
    } else return user;
}

const deleteUserById = async function(id){
    const userIndex = users.findIndex(item => item.id == id);
    users.splice(userIndex, 1);
    updateJsonFile();
    return users;
}

const updateUserById = async function(id, body){
    const userIndex = users.findIndex(item => item.id == id);

    if (userIndex != -1) {
        users[userIndex] = {...users[userIndex], ...body};
        updateJsonFile();
        return users[userIndex];
    } else throw new Error ('no such user');
}

const updateJsonFile = function() {
    fs.writeFileSync('./users.json', JSON.stringify(users, null, ' '));
}


module.exports = {
    getUsers,
    addUser,
    getUserById,
    deleteUserById,
    updateUserById

}