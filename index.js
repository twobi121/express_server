const express = require('express');
const router = require('./routers/export_routers');
const mongoose = require('mongoose');
const multer  = require("multer");
const storageConfig = require("./utils/upload_config")
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use(multer({storage:storageConfig}).single("file"));

app.use('/users', router.userRouter);
app.use('/pets', router.petsRouter);
app.use('/upload', router.uploadRouter);

async function start() {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/admin', {
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





