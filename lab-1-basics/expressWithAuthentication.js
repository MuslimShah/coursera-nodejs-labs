const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const Port = process.env.port || 3000;
const app = express();


const users = [];

app.use(session({ secret: 'fingerprint', resave: false }));

//checks if user already exists
const doesExit = (username) => {
        const userWithSameName = users.filter(user => {
            return user.username === username;

        })
        if (userWithSameName.length > 0) {
            return true;
        } else {
            return false;
        }

    }
    //authenticate user

const authenticate = (username, password) => {
    const validUser = users.find(user => {
        return (user.username === username && user.password === password)
    });
    if (validUser)
        return true;
    else
        return false;
};

app.use('/auth', (req, res, next) => {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        const verfiedStatus = jwt.verify(token, 'access');

        if (verfiedStatus.user) {
            req.user = verfiedStatus.user
            next();
        } else {
            res.json({ msg: 'unauthorized user' })

        }

    }
})

app.post('/register', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const user = {
            username: username,
            password: password
        }
        // console.log(user);

    if (!username || !password) {
        return res.json({ msg: 'invalid username or password' })
    }
    if (!doesExit(username)) {
        users.push(user);
        return res.status(200).json({ msg: 'user registerd successfully' });
    } else {
        res.status(404).json({ msg: 'user already exists' });
    }

});

app.post('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const user = {
        username: username,
        password: password
    }

    if (!username || !password) {
        return res.json({ msg: 'invalid username or password' })
    }
    if (authenticate(username, password)) {
        const accessToken = jwt.sign({ user: username }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).json({ msg: 'user loggedin successflly' })
    } else {
        return res.status(200).json({ msg: 'invalid credintials ! check again' })

    }

})
app.get('/auth/message', (req, res) => {
    res.status(200).json({ msg: `hello ${req.user}` })
})


app.listen(Port, () => console.log(`connected on port ${Port}`));