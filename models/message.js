const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    chat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // reciviers_id: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }],
    readUsers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
        required: true
    } ],
    date: {
        type: Date
    }
})

messageSchema.pre('save', async function(next){
    const message = this;
    message.date = Date.now();
    next();
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
