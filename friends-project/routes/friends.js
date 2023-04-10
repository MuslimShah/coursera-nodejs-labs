const express = require('express');
const { auth } = require('../config/util')
const router = express.Router();
const friendControllers = require('../controllers/friends')

// GET request: Retrieve all friends
router.get("/", friendControllers.getFreind);

// GET by specific ID request: Retrieve a single friend with email ID
router.get("/:email", friendControllers.getByEmail);


// POST request: Add a new friend
router.post("/", friendControllers.addNewFriend);


// PUT request: Update the details of a friend with email id
router.put("/:email", friendControllers.updateFriend);


// DELETE request: Delete a friend by email id
router.delete("/:email", friendControllers.deleteByEmail);


//export routes
module.exports = router;