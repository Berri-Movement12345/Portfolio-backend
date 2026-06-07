#!/usr/bin/env node
/**
 * Portfolio Backend Server
 * Consolidated Express.js server with all middleware, models, and configurations
 * Node.js >= 14 required
 */

require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── ENVIRONMENT & CONFIG ────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const JWT_SECRET = process.env.JWT_SECRET || 'mixzy_fallback_secret_2026_change_in_prod'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const app = express()

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── DATABASE CONNECTION ─────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    isConnected = true
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── CLOUDINARY SETUP ───────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ─── Upload Middleware ─────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, and WebP images are allowed.'), false)
  }
}

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 675, crop: 'fill', quality: 'auto:good' }],
  },
})

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto:good' }],
  },
})

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
})

const uploadProjectImage = multer({ storage: projectStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
const uploadBlogImage = multer({ storage: blogStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
const uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── MONGOOSE MODELS ────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

// Import models from the models directory
const { User, Project, Skill, Service, Testimonial, Blog, Contact, Analytics } = require('./models')

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── AUTHENTICATION MIDDLEWARE ──────────────────────
// ═════════════════════════════════════════════════════════════════════════

// Verify token and attach user to req
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' })
    }
    if (!req.user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is disabled.' })
    }
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

// Admin-only guard
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' })
  }
  next()
}

// Optional auth — attaches user if token present but doesn't block
const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    } catch {}
  }
  next()
}

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── ERROR HANDLING MIDDLEWARE ──────────────────────
// ═════════════════════════════════════════════════════════════════════════

// 404 Not Found Handler
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
}

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Resource not found with id: ${err.value}`
    error.statusCode = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    error.message = `Duplicate value for field: ${field}`
    error.statusCode = 400
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((e) => e.message).join(', ')
    error.statusCode = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token.'
    error.statusCode = 401
  }
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired.'
    error.statusCode = 401
  }

  const statusCode = error.statusCode || err.statusCode || 500

  if (NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.path} — ${statusCode}: ${error.message}`)
    if (err.stack) console.error(err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  })
}

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── CONNECT DATABASE ────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

connectDB()

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── SECURITY MIDDLEWARE ──────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── RATE LIMITING ─────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    if (NODE_ENV === 'development') {
      const ip = req.ip || req.connection.remoteAddress
      return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
    }
    return false
  }
})

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes (reduced from 15)
  max: NODE_ENV === 'development' ? 1000 : 50, // 1000 in dev, 50 in production
  message: { success: false, message: 'Too many authentication attempts. Please try again in 5 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
  skip: (req) => {
    // Skip rate limiting for localhost in development
    if (NODE_ENV === 'development') {
      const ip = req.ip || req.connection.remoteAddress
      return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
    }
    return false
  }
})

app.use('/api', limiter)

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── BODY PARSING MIDDLEWARE ──────────────────────────
// ═════════════════════════════════════════════════════════════════════════

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
if (NODE_ENV === 'development') app.use(morgan('dev'))

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── ROUTES ────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

// Import route handlers
const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const skillRoutes = require('./routes/skills')
const serviceRoutes = require('./routes/services')
const testimonialRoutes = require('./routes/testimonials')
const blogRoutes = require('./routes/blog')
const contactRoutes = require('./routes/contact')
const userRoutes = require('./routes/users')
const analyticsRoutes = require('./routes/analytics')
const uploadRoutes = require('./routes/upload')
const bookingRoutes = require('./routes/booking')

// Use routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/users', userRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Lightweight caching for public GET endpoints to improve perceived performance
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const publicPaths = ['/api/projects', '/api/services', '/api/testimonials', '/api/blog', '/api/blog/metadata/all']
    if (publicPaths.some((p) => req.path.startsWith(p))) {
      // short TTL for dynamic content but helps with browser caching
      res.setHeader('Cache-Control', 'public, max-age=60')
    }
  }
  next()
})

// Ensure uploads directory exists
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true })

// ─── Health Check ────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, timestamp: new Date() })
})

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── FRONTEND SERVING (PRODUCTION) ──────────────────
// ═════════════════════════════════════════════════════════════════════════

if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        // Don't aggressively cache index.html so new deployments are picked up
        res.setHeader('Cache-Control', 'no-cache')
      }
    },
  }))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'))
  })
}

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── ERROR HANDLING ──────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

app.use(notFound)
app.use(errorHandler)

// ═════════════════════════════════════════════════════════════════════════
// ────────────────────── START SERVER ────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════

const server = app.listen(PORT, () => {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`🚀 Server running in ${NODE_ENV.toUpperCase()} mode`)
  console.log(`📡 Port: ${PORT}`)
  console.log(`🔗 API URL: http://localhost:${PORT}/api`)
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`)
  console.log(`${'═'.repeat(60)}\n`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`)
    console.error(`   A backend may already be running at http://localhost:${PORT}/api`)
    console.error(`   Stop it (PowerShell): netstat -ano | findstr :${PORT}`)
    console.error(`   Then: taskkill /PID <pid> /F\n`)
    process.exit(1)
  }
  throw err
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⛔ Server shutting down...')
  server.close(() => {
    console.log('✅ Server closed')
    mongoose.connection.close()
    process.exit(0)
  })
})

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  process.exit(1)
})

// Export for testing
module.exports = { app, User, Project, Skill, Service, Testimonial, Blog, Contact, Analytics }
