const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth*", function auth(req, res, next) {
    /**
     * first of all it checks if the session exists 
     * if exists it takes the token and verify it and
     * add user to the request object
     * and if  it does not exist it prompt the user to login first
     */
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken']; //gets the token
        const verifiedStatus = jwt.verify(token, `${process.env.jwtSecretKey}`);
        if (verifiedStatus.user) {
            req.user = verifiedStatus.user;
            next();
        }


    } else {
        res.status(401).json({ message: 'not authorized !login first' })
    }

});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));