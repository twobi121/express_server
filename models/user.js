const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // id: {
    //     type: Number,
    //     unique:true,
    //     required: true,
    // },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,

    }

})

const User = mongoose.model('User', userSchema)
module.exports = User