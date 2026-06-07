const express = require('express')
const router = express.Router()
const {
  register, login, getMe, logout,
  updatePassword, forgotPassword, verifyResetToken, resetPassword,
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/update-password', protect, updatePassword)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password/:token', verifyResetToken)
router.put('/reset-password/:token', resetPassword)

module.exports = router
