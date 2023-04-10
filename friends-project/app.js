const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { auth } = require('./config/util')
    //auth routes
const authRoutes = require('./routes/auth')
const friendRoutes = require('./routes/friends')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({ secret: 'fingerprint', resave: false, saveUninitialized: true }));




//use auth routes
app.use('/', authRoutes)
    //friends rotes
app.use('/', friendRoutes)









app.listen(PORT, () => console.log(`listening on port:${PORT}`));