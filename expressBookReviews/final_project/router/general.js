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
            //return list of all books
            return resolve(books);
        } catch (error) {
            return reject(`getting books list error ${error}`);
        }

    })
    const foundBooks = await getBooks;
    if (Object.keys(books).length > 0) { //if books exists
        return res.status(200).json({ message: "list of books available", books: foundBooks });

    } else {
        return res.status(404).json({ message: "books not found in the list" });

    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function(req, res) {
    /**
     * gets the isbn in req.params
     * search the book for specific isbn
     * if the book is found returns it 
     * otherwise returns book not found message
     */
    const isbn = req.params.isbn;
    const getByIsbn = new Promise((resolve, reject) => {
        try {
            let foundBook = books[isbn];
            return resolve(foundBook);
        } catch (error) {
            return reject(`getting books by isbn error ${error}`);
        }
    })
    const book = await getByIsbn;

    if (book) {
        return res.status(200).json({ book });
    } else {
        return res.status(404).json({ message: 'book not found' });
    }


});

// Get book details based on author
public_users.get('/author/:author', async(req, res) => {
    /**
     * takes the author name in req.params
     * search the book of specified author 
     * if found return it
     * otherwise show book not found message
     */
    const author = req.params.author;
    const searchByAuthor = new Promise((resolve, reject) => {
        try {
            const foundBook = Object.values(books).filter(book => {
                return book.author === author;
            })
            return resolve(foundBook);
        } catch (error) {
            return reject(`searching by author error ${error}`)
        }
    })
    const book = await searchByAuthor;
    if (book.length > 0) {
        return res.status(200).json({ book });
    } else {
        return res.status(404).json({ message: 'book not found' });
    }

});

// Get all books based on title
public_users.get('/title/:title', async(req, res) => {
    /**
     * takes the title of book in req.params
     * search the book of specified title 
     * if found return it
     * otherwise show book not found message
     */
    const title = req.params.title;
    const searchByTitle = new Promise((resolve, reject) => {
        try {
            const foundBook = Object.values(books).filter(book => {
                return book.title === title;
            })
            return resolve(foundBook);
        } catch (error) {
            return reject(`searching by title error ${error}`)
        }
    })
    const book = await searchByTitle;
    if (book.length > 0) {
        return res.status(200).json({ book });
    } else {
        return res.status(404).json({ message: 'book not found' });
    }


});

//  Get book review
public_users.get('/review/:isbn', async(req, res) => {
    /**
     * takes the isbn of book in req.params
     * search the book of specified isbn 
     * if found  simply return reviews of the given user to the book
     * otherwise show book not found message
     */
    const isbn = req.params.isbn
    const getReviewsByIsbn = new Promise((resolve, reject) => {

        try {
            let foundBook = books[isbn];
            return resolve(foundBook);
        } catch (error) {
            return reject(`getting books reviews by isbn error ${error}`);

        }
    })
    const book = await getReviewsByIsbn;
    if (book) {
        return res.status(200).json({ reviews: book.reviews });
    } else {
        return res.status(404).json({ message: 'book not found' });
    }


});

module.exports.general = public_users;