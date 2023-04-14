const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // code to check is the username is valid
    const validUser = users.filter(user => {
        return (user.username === username);
    });
    if (validUser.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //code to check if username and password match the one we have in records.
    const authorizedUser = users.filter(user => {
        return (user.username === username && user.password === password);
    });
    if (authorizedUser.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ user: username }, `${process.env.jwtSecretKey}`, { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,
            user: username
        }
        return res.status(200).json({ message: `User ${username} logged in successfully` });
    }
    return res.status(300).json({ message: "unauthorized user" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", async(req, res) => {
    const user = req.user;
    const addReview = new Promise((resolve, reject) => {
        const isbn = req.params.isbn
        try {
            books[isbn].reviews[user] = req.body.review;
            return resolve(books);

        } catch (error) {
            return reject(`getting books reviews by isbn error ${error}`);

        }
    })
    const book = await addReview;
    if (book) {
        return res.status(200).json({ reviews: book });
    } else {
        return res.status(404).json({ message: 'book not found' });
    }



});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;