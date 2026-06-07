const express = require('express')
const router = express.Router()
const {
  getProjects, getProject, createProject,
  updateProject, deleteProject, toggleFeatured,
} = require('../controllers/projectController')
const { protect, adminOnly } = require('../middleware/auth')
const { uploadProjectImage } = require('../middleware/upload')

router.get('/', getProjects)
router.get('/:slug', getProject)
router.post('/', protect, adminOnly, uploadProjectImage.single('image'), createProject)
router.put('/:id', protect, adminOnly, uploadProjectImage.single('image'), updateProject)
router.delete('/:id', protect, adminOnly, deleteProject)
router.patch('/:id/featured', protect, adminOnly, toggleFeatured)

module.exports = router
