const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    friend1_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friend2_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;
