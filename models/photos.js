const mongoose = require('mongoose');

const photosSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    album_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Albums',
      required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0

    }
})

const Photos = mongoose.model('Photos', photosSchema);
module.exports = Photos;
