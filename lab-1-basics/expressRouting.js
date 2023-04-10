const express = require('express');
const Port = process.env.port || 3000;
const app = express();
const userRouter = express.Router();
const itemRouter = express.Router();

//using express router

userRouter.use((req, res, next) => {
    console.log('User query date and time', Date());
    next()
})
userRouter.get('/:id', (req, res, next) => {
    console.log(`User ${req.params.id} logged in successfully ${Date()}`);
    res.json({ msg: 'logged in' })
})

//items routes
itemRouter.use((req, res, next) => {
    console.log('Item query date and time', Date());
    next()
})
itemRouter.get('/:id', (req, res, next) => {
    console.log(`Item ${req.params.id} found in successfully ${Date()}`);
    res.json({ msg: 'item found' })
})

app.use('/user', userRouter);
app.use('/item', itemRouter);


app.listen(Port, () => console.log(`connected on port ${Port}`));