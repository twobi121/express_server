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
            console.log('connect')
            let _room;
            socket.on('join', room => {
                _room = room;
                socket.join(room);
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
        })
    }
    catch (e) {
        console.log(e);
    }
}

start();





