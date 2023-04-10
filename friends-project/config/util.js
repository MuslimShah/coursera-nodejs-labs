const fs = require('fs');
const jwt = require('jsonwebtoken')
const path = require('path')
if (!fs.existsSync('./data/users.txt'))
    fs.writeFileSync('./data/users.txt', "[]", 'utf-8');
let users = JSON.parse(fs.readFileSync('./data/users.txt'));

//if exists with same name;
const doesExist = (username) => {
    const userWithSameName = users.find(user => {
        return user.username === username;
    });

    if (userWithSameName)
        return true;
    else
        return false;
};

//check valid inputs
const checkInputs = (username, password) => {
        if (!username || !password)
            return false;
        else
            return true;
    }
    //authenticate user

const authenticateUser = (username, password) => {
    const validUser = users.find(user => {
        return (user.username === username && user.password === password);
    });
    if (validUser)
        return true;
    else
        return false;
};
const auth = ((req, res, next) => {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        const verifiedStatus = jwt.verify(token, 'access');
        if (verifiedStatus.user) {
            req.user = verifiedStatus.user;
            next();
        } else {
            res.status(401).json({ msg: 'unauthorized user' });
        }
    } else {
        res.json({ msg: 'no token present' })
    }
})
module.exports = {
    doesExist,
    authenticateUser,
    checkInputs,
    auth
}