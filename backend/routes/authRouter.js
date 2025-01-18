const express = require("express")
const { signupUser, loginUser, refreshTokenUser, logoutUser } = require("../controller/authController")
const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.post('/refresh', refreshTokenUser)

router.post('/logout', logoutUser)

module.exports = router