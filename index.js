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

        const io = require('socket.io').listen(server)

        io.of('/dialogues').on("connection", socket => {

        });
        // io.on("connection", socket => {
        //     // Log whenever a user connects
        //     console.log("user connected");
        //
        //     // Log whenever a client disconnects from our websocket server
        //     socket.on("disconnect", function() {
        //         console.log("user disconnected");
        //     });
        //
        //     // When we receive a 'message' event from our client, print out
        //     // the contents of that message and then echo it back to our client
        //     // using `io.emit()`
        //     socket.on("message", message => {
        //         console.log("Message Received: " + message);
        //         io.emit("message", { type: "new-message", text: message });
        //     });
        // });
    }
    catch (e) {
        console.log(e);
    }

}

start();





