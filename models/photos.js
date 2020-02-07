const mongoose = require('mongoose');

const photosSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    owner_id: {
        type: String,
        ref: 'User',
        required: true,
    }

})

const Photos = mongoose.model('Photos', photosSchema);
module.exports = Photos;
