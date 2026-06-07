const express = require('express')
const router = express.Router()
const {
  submitContact, getMessages, updateStatus, deleteMessage, replyToMessage,
} = require('../controllers/contactController')
const { protect, adminOnly } = require('../middleware/auth')

router.post('/', submitContact)
router.get('/', protect, adminOnly, getMessages)
router.patch('/:id/status', protect, adminOnly, updateStatus)
router.post('/:id/reply', protect, adminOnly, replyToMessage)
router.delete('/:id', protect, adminOnly, deleteMessage)

module.exports = router
