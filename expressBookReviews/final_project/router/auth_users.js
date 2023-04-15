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
    /**
     * takes the username and password in req.body
     * if the user is an authenticated user it stores the token
     * otherwise show an unauthorized message
     */
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
    /**
     * this code simply add the review of a user to the given isbn book
     * first of all it checks if the book exists or not
     * if exists then it simply add the review otherwise
     * show a book not found message
     */
    const user = req.user;
    const isbn = req.params.isbn
    const addReview = new Promise((resolve, reject) => {
        try {
            const bookExists = books[isbn];
            if (bookExists) {
                books[isbn].reviews[user] = req.body.review;
                return resolve(true);
            } else {
                return resolve(false);
            }

        } catch (error) {
            return reject(`getting books reviews by isbn error ${error}`);

        }
    })
    const book = await addReview;
    if (book) {
        return res.status(200).json({ message: 'your review has been added successfully', books });
    } else {
        return res.status(404).json({ message: 'book not found' });
    }

});

//delete reviews
regd_users.delete("/auth/review/:isbn", async(req, res) => {
    /**
     * this code first search the review of the user on the book
     * if it exists it deletes  and send deletion message it other wise
     * send a message that review does not exist there
     */
    const user = req.user;
    const isbn = req.params.isbn
    const addReview = new Promise((resolve, reject) => {
        try {
            //search if review exist or not
            const searchReview = books[isbn].reviews[user];
            if (searchReview) {
                delete books[isbn].reviews[user];
                return resolve(true)
            } else {
                return resolve(false);
            }

        } catch (error) {
            return reject(`getting books reviews by isbn error ${error}`);

        }
    })
    const book = await addReview;
    if (book) {
        return res.status(200).json({ message: 'your review has been deleted' });
    } else {
        return res.status(404).json({ message: 'your review was not present there' });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;