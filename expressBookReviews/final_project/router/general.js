const express = require('express');
let books = require("./booksdb.js");
let { isValid } = require("./auth_users.js");
let { users } = require("./auth_users.js");
const public_users = express.Router();


public_users.post("/register", async(req, res) => {
    /**
     * checks if the username already exists
     * if not it register the user by pushing values to users array
     * the process is done using promise to handle multiple requests at 
     * the same time
     */
    const username = req.body.username;
    const password = req.body.password;
    if (!isValid(username)) { //if username does not exist
        const addUser = new Promise((resolve, reject) => {
            try {
                const user = {
                    username,
                    password
                }
                users.push(user);
                return resolve(users);

            } catch (error) {
                return reject(`adding user error:${error}`);
            }
        })
        const upadatedUsers = await addUser;
        return res.status(200).json({ message: "the user has been registered successfully" });


    } else {
        return res.status(401).json({ message: "user already exists" });

    }

});





// Get the book list available in the shop
public_users.get('/', async(req, res) => {
    //this code gets the list of all available books
    const getBooks = new Promise((resolve, reject) => {
        try {
            const titles = Object.values(books).map(book => {
                return book.title;
            });
            return resolve(titles);
        } catch (error) {
            return reject(`getting books list error ${error}`);
        }

    })
    const foundBooks = await getBooks;
    return res.status(200).json({ message: "list of books available", books: foundBooks });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function(req, res) {
    const isbn = req.params.isbn;
    const getByIsbn = new Promise((resolve, reject) => {
        try {
            const isbns = Object.keys(books);
            let searchedBooks;
            isbns.forEach(values => {
                if (values === isbn) {
                    searchedBooks = books[values];
                    return;
                }
            })
            return resolve(searchedBooks);

        } catch (error) {
            return reject(`getting books by isbn error ${error}`);

        }
    })
    const foundBooks = await getByIsbn;
    //Write your code here
    return res.status(300).json({ books: foundBooks });
});

// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;