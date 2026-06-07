const express = require('express')
const router = express.Router()
const { getDashboardStats, trackPageView } = require('../controllers/resourceController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/stats', protect, adminOnly, getDashboardStats)
router.post('/pageview', trackPageView)

module.exports = router
