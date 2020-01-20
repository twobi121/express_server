const mongoose = require('mongoose');

const petsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gender: {
        type: String,
    }

})

const Pets = mongoose.model('Pet', petsSchema);
module.exports = Pets;