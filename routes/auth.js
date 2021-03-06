const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')


router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.get('/signup', authController.getSignUp)

router.post('/signup', authController.postSignUp)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)

module.exports = router