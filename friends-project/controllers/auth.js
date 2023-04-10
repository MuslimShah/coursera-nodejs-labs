const fs = require('fs')
const jwt = require('jsonwebtoken')

const { doesExist, authenticateUser, checkInputs, auth } = require('../config/util');

let users; //this user variable is to store register users
//check for file if does not exist create new one
if (!(fs.existsSync('./data/users.txt'))) {
    fs.writeFileSync('./data/users.txt', '[]', 'utf-8');
} else {
    //reads the data of stored users from file and store it in user var
    users = JSON.parse(fs.readFileSync('./data/users.txt'));
}


//login controller
exports.loginController = (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    if (checkInputs(username, password)) {
        if (authenticateUser(username, password)) {
            const user = users.find(user => {
                return user.username === username;
            })
            const accessToken = jwt.sign({ user: user.username }, 'access', { expiresIn: 100 });
            req.session.authorization = {
                accessToken,
                user: users.username
            }
            res.json({ msg: 'you have successfully logged in' })
        }
        //if not authorized
        else {
            res.status(401).json({ msg: 'unauthorized user !' })
        }
    }
    //if not valid inputs
    else {
        res.status(400).json({ msg: 'enter valid data' })
    }

}

//register controller

exports.registerController = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (checkInputs(username, password)) {
        if (!doesExist(username)) {
            const user = {
                username: username,
                password: password
            };
            users.push(user);
            fs.writeFileSync('./data/users.txt', JSON.stringify(users), 'utf-8');
            res.status(200).json({ msg: 'user successfully registered !. Now you can login' })
        }
        //if user already exist
        else {
            res.status(400).json({ msg: 'user already exists' })
        }
    }
    //if not valid inputs
    else {
        res.status(400).json({ msg: 'enter valid data' })
    }
}