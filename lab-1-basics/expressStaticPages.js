const express = require('express');
const Port = process.env.port || 3000;
const app = express();
//static files
app.use(express.static('staticFiles'));



app.listen(Port, () => console.log(`connected on port ${Port}`));