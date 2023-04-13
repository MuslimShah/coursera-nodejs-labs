const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth*", function auth(req, res, next) {
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