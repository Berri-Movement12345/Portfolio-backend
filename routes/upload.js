const express = require('express')
const router = express.Router()
const { uploadImage, deleteImage } = require('../controllers/resourceController')
const { protect, adminOnly } = require('../middleware/auth')
const { uploadProjectImage } = require('../middleware/upload')

router.post('/', protect, adminOnly, uploadProjectImage.single('image'), uploadImage)
router.delete('/', protect, adminOnly, deleteImage)

module.exports = router
