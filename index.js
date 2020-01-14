const express = require('express');
const router = require('./user_rout');

const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', router);

app.listen(port, () => {
    console.log('server on port ' + port);
})