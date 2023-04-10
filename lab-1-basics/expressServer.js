const express = require('express');
const Port = process.env.port || 3000;
const app = express();

const loginDetails = [];
app.get('/', (req, res) => {
    res.send('welcome to the express server');
})

app.get('/loginDetails', (req, res) => {
    res.send(JSON.stringify(loginDetails))
})

app.post('/login/:name', (req, res) => {
    const user = {
        name: req.params.name,
        loginTime: new Date()
    }
    loginDetails.push(user);
    res.send(`${user.name} you are logged in`)

});

app.get('/:name', (req, res) => {
    res.send(`hello ${req.params.name}`);
});
app.get('/fetchMonth/:num', (req, res) => {
    const months = ['January', 'Febuary', 'March', 'April', "May", "June", "July", 'August', "September", "October", "November", "December"]
    let num = req.params.num;
    if (num < 1 || num > 12) {
        return res.send('not correct month')
    }
    res.send(months[num - 1])

})



app.listen(Port, () => console.log(`connected on port ${Port}`));