require('dotenv').config();
const express = require('express');
const router = require('./routers/export_routers');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 3000;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({credentials: true, origin: "http://localhost:4200"}));

app.use(express.json());
app.use(express.static('public'));

app.use('/users', router.userRouter);
app.use('/pets', router.petsRouter);
app.use('/media', router.mediaRouter);
app.use('/dialogues', router.chatRouter);

const ChatController = require('./controllers/chat');
const chatController = new ChatController();

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });

        const server = app.listen(port, () => {
            console.log('server on port ' + port);
        })

        const io = require('socket.io').listen(server);

        io.engine.generateId = function (socket) {
            return socket._query.id
        };

        io.on('connection', (socket) => {
            socket.emit('connected');
            let _room;
            socket.on('join', async room => {
                _room = room;
                socket.join(room);
                await chatController.updateMessage(room, socket.handshake.query.id);
                const messages = await chatController.getMessages(room);
                socket.emit('get-messages', messages);
            });
            socket.on('leaveRoom', () => {
                socket.leave(_room);
            })
            socket.on('message', async message => {
                const newMessage = await chatController.addMessage(message);
                io.to(_room).emit("new-message", newMessage);
                message.receivers_id.forEach(id => {
                    io.to(`${id}`).emit("not", message.message)
                });
            });
            socket.on('read', async (owner_id) => {
                await chatController.updateMessage(_room, socket.handshake.query.id);
                io.to(`${owner_id}`).emit("not", {id:_room, event: 'read'});
            });

            socket.on('get-prev-messages', async (skipValue) => {
                const messages = await chatController.getMessages(_room, skipValue);
                socket.emit('get-prev-messages', messages);
            });
        })
    }
    catch (e) {
        console.log(e);
    }
}

start();





