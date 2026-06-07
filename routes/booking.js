const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { submitBooking, getBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController')
const { protect, adminOnly } = require('../middleware/auth')

// Store logo uploads locally in /uploads (temp storage before emailing and for local serving)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const unique = `logo-${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed for logo.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

// POST /api/booking — protected: user must be logged in to submit a request
router.post('/', protect, upload.single('logo'), submitBooking)

// GET /api/booking — protected: admin access only to view logged bookings
router.get('/', protect, adminOnly, getBookings)

// PUT /api/booking/:id/status — protected: admin access only
router.put('/:id/status', protect, adminOnly, updateBookingStatus)

// DELETE /api/booking/:id — protected: admin access only
router.delete('/:id', protect, adminOnly, deleteBooking)


module.exports = router
