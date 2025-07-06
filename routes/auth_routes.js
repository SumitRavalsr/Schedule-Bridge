const express = require('express')
const {registerUser, registerAdmin, loginUser} = require('../controllers/auth_controller')

const router = express.Router();

// all routes are related to authentication and authorization


router.post('/register-user',registerUser)
router.post('/register-admin', registerAdmin)
router.post('/login',loginUser)

 

module.exports = router;