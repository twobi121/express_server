const fs = require('fs');
const Pets = require('../models/pets');
const pets = JSON.parse(fs.readFileSync('./users.json', 'utf8' ));

const getPets = async function(){
    try {
        return await Pets.find({});
    } catch (e) {
        throw new Error(e.message);
    }
}

const addPets = async function(req) {
    // users.push(req);
    // updateJsonFile();

    try {
        const pets = new Pets({name: req.name, owner: req.owner})
        await pets.save();
        return `Pet ${Pets.name} was succesfully added `;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getPetsById = async function(id) {
    // const user = users.find(item => item.id == id);
    // if (!user) {
    //     throw new Error ('no such user');
    // } else

    try {
        return await Pets.findById(id);
    } catch (e) {
        throw new Error(e.message);
    }

}

const deletePetsById = async function(id){
    // const userIndex = users.findIndex(item => item.id == id);
    // users.splice(userIndex, 1);
    // updateJsonFile();
    try {
        await Pets.deleteOne({_id: id});
        return `Pet with id ${id} was removed`;
    } catch (e) {
        throw new Error(e.message);
    }

}

const updatePetsById = async function(id, body){
    try {
        await Pets.findByIdAndUpdate(id, body);
        return `Pet with id ${id} was updated`;
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

// const updateJsonFile = function() {
// //     fs.writeFileSync('./users.json', JSON.stringify(users, null, ' '));
// // }


module.exports = {
    getPets,
    addPets,
    getPetsById,
    deletePetsById,
    updatePetsById

}