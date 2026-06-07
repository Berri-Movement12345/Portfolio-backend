const express = require('express')
const router = express.Router()
const { getUsers, getUser, updateUser, deleteUser, toggleUserRole } = require('../controllers/resourceController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', protect, adminOnly, getUsers)
router.get('/:id', protect, adminOnly, getUser)
router.put('/me', protect, updateUser)
router.delete('/:id', protect, adminOnly, deleteUser)
router.patch('/:id/role', protect, adminOnly, toggleUserRole)

module.exports = router
