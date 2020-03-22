const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photos',
        required: true
    }
});

const Likes = mongoose.model('Likes', likesSchema);
module.exports = Likes;
