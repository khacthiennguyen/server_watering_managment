const express = require('express')
const { registerController, loginController, updateUserController, requierSignIn } = require('../controllers/userController')

//routes object 
const router = express.Router()

//routes 
router.post('/register',registerController)

router.post('/login',loginController)

//updte
router.put('/update-user',requierSignIn,updateUserController)


module.exports = router