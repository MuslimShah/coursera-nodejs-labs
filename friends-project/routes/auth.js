const express = require('express');
const { registerController, loginController } = require('../controllers/auth')
const router = express.Router();

//login
router.post('/login', loginController);
//register friend route
//================= REGISTER FRIEND ============================
router.post('/register', registerController);

//export routes
module.exports = router;