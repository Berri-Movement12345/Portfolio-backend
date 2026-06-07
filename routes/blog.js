const express = require('express')
const router = express.Router()
const {
  getPosts, getPost, createPost, updatePost,
  deletePost, addComment, getAllPostsAdmin, getMetadata,
} = require('../controllers/blogController')
const { protect, adminOnly } = require('../middleware/auth')
const { uploadBlogImage } = require('../middleware/upload')

// Admin routes (must be defined first to avoid conflicts with :slug)
router.get('/admin/all', protect, adminOnly, getAllPostsAdmin)
router.post('/', protect, adminOnly, uploadBlogImage.single('image'), createPost)
router.put('/:id', protect, adminOnly, uploadBlogImage.single('image'), updatePost)
router.delete('/:id', protect, adminOnly, deletePost)

// Public routes (cached)
router.get('/', getPosts)
router.get('/metadata/all', getMetadata)
router.get('/:slug', getPost)

// Public comment route
router.post('/:slug/comments', addComment)

module.exports = router
