const express = require('express');
const userRouter = require('./user_rout');
const petsRouter = require('./pets_rout');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', userRouter);
app.use('/pets', petsRouter);

async function start() {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/admin', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        app.listen(port, () => {
            console.log('server on port ' + port);
        })
    }
    catch (e) {
        console.log(e)
    }

}

start()





