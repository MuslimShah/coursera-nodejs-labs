const express = require('express');
const { auth } = require('../config/util')
const router = express.Router();
const friendControllers = require('../controllers/friends')

// GET request: Retrieve all friends
router.get("/", auth, friendControllers.getFreind);

// GET by specific ID request: Retrieve a single friend with email ID
router.get("/:email", auth, friendControllers.getByEmail);


// POST request: Add a new friend
router.post("/", auth, friendControllers.addNewFriend);


// PUT request: Update the details of a friend with email id
router.put("/:email", auth, friendControllers.updateFriend);


// DELETE request: Delete a friend by email id
router.delete("/:email", auth, friendControllers.deleteByEmail);


//export routes
module.exports = router;