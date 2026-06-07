const express = require('express')
const router = express.Router()
const {
  getTestimonials, createTestimonial, updateTestimonial,
  deleteTestimonial, approveTestimonial,
} = require('../controllers/resourceController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', getTestimonials)
router.post('/', protect, adminOnly, createTestimonial)
router.put('/:id', protect, adminOnly, updateTestimonial)
router.delete('/:id', protect, adminOnly, deleteTestimonial)
router.patch('/:id/approve', protect, adminOnly, approveTestimonial)

module.exports = router
