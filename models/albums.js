const mongoose = require('mongoose');

const albumsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    description: {
      type: String
    },
    main: {
      type: Boolean,
      default: false
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

})

const Albums = mongoose.model('Albums', albumsSchema);
module.exports = Albums;
