require('dotenv').config();
const express = require('express');
const router = require('./routers/export_routers');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());

app.use(express.json());
app.use(express.static('public'));

app.use('/users', router.userRouter);
app.use('/pets', router.petsRouter);
app.use('/media', router.mediaRouter);

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        app.listen(port, () => {
            console.log('server on port ' + port);
        })
    }
    catch (e) {
        console.log(e);
    }

}

start();





