const express = require('express');
const Port = process.env.port || 3000;
const app = express();


app.use((req, res, next) => {
    const password = req.query.password;
    if (password !== 'password123') {
        return res.status(401).send('unauthorized user');
    }
    console.log('Time', Date.now());
    next()
})

app.get('/home', (req, res) => {
    res.send('welcome user');
})


app.listen(Port, () => console.log(`connected on port ${Port}`));