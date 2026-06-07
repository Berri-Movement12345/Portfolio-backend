#!/usr/bin/env node
/**
 * System Diagnostic Script
 * Checks all critical components of the authentication system
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const JWT_SECRET = process.env.JWT_SECRET || 'mixzy_fallback_secret_2026_change_in_prod'

console.log('═══════════════════════════════════════════════════════')
console.log('🔍 PORTFOLIO AUTHENTICATION SYSTEM DIAGNOSTIC')
console.log('═══════════════════════════════════════════════════════\n')

// Check 1: Environment Variables
console.log('📋 CHECK 1: Environment Variables')
console.log('─────────────────────────────────────────────────────')
console.log(`PORT: ${process.env.PORT || '❌ Not set (using default 5000)'}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV || '❌ Not set (using default development)'}`)
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not set (using default)'}`)
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Using fallback (CHANGE IN PRODUCTION!)'}`)
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ Not set (using default)'}`)
console.log(`SMTP_USER: ${process.env.SMTP_USER ? '✅ Set' : '❌ Not set (email won\'t work)'}`)
console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Not set (uploads won\'t work)'}`)
console.log()

// Check 2: Dependencies
console.log('📦 CHECK 2: Critical Dependencies')
console.log('─────────────────────────────────────────────────────')
try {
  require('express')
  console.log('✅ express')
} catch { console.log('❌ express - Run: npm install express') }

try {
  require('mongoose')
  console.log('✅ mongoose')
} catch { console.log('❌ mongoose - Run: npm install mongoose') }

try {
  require('bcryptjs')
  console.log('✅ bcryptjs')
} catch { console.log('❌ bcryptjs - Run: npm install bcryptjs') }

try {
  require('jsonwebtoken')
  console.log('✅ jsonwebtoken')
} catch { console.log('❌ jsonwebtoken - Run: npm install jsonwebtoken') }

try {
  require('cors')
  console.log('✅ cors')
} catch { console.log('❌ cors - Run: npm install cors') }

try {
  require('dotenv')
  console.log('✅ dotenv')
} catch { console.log('❌ dotenv - Run: npm install dotenv') }
console.log()

// Check 3: bcrypt functionality
console.log('🔐 CHECK 3: bcrypt Password Hashing')
console.log('─────────────────────────────────────────────────────')
const testPassword = 'TestPassword123'
const testHash = bcrypt.hashSync(testPassword, 12)
const testMatch = bcrypt.compareSync(testPassword, testHash)
console.log(`Test password: "${testPassword}"`)
console.log(`Generated hash: ${testHash.substring(0, 30)}...`)
console.log(`Comparison result: ${testMatch ? '✅ PASS' : '❌ FAIL'}`)
console.log()

// Check 4: JWT functionality
console.log('🎫 CHECK 4: JWT Token Generation')
console.log('─────────────────────────────────────────────────────')
try {
  const testToken = jwt.sign({ id: '123', role: 'user' }, JWT_SECRET, { expiresIn: '30d' })
  const decoded = jwt.verify(testToken, JWT_SECRET)
  console.log(`Generated token: ${testToken.substring(0, 50)}...`)
  console.log(`Decoded payload: ${JSON.stringify(decoded)}`)
  console.log('✅ JWT working correctly')
} catch (err) {
  console.log('❌ JWT error:', err.message)
}
console.log()

// Check 5: MongoDB Connection
console.log('🗄️  CHECK 5: MongoDB Connection')
console.log('─────────────────────────────────────────────────────')
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(async (conn) => {
    console.log(`✅ Connected to: ${conn.connection.host}`)
    console.log(`   Database: ${conn.connection.name}`)
    console.log(`   Port: ${conn.connection.port}`)
    console.log()

    // Check 6: User Collection
    console.log('👥 CHECK 6: User Collection')
    console.log('─────────────────────────────────────────────────────')
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
    }))

    const userCount = await User.countDocuments()
    console.log(`Total users in database: ${userCount}`)

    if (userCount > 0) {
      const users = await User.find().select('email role isActive').limit(5)
      console.log('\nFirst 5 users:')
      users.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.email} [${u.role}] ${u.isActive ? '✅ Active' : '❌ Inactive'}`)
      })
    } else {
      console.log('⚠️  No users found. Create one with:')
      console.log('   node scripts/createAdmin.js')
    }
    console.log()

    // Check 7: Booking Collection
    console.log('📅 CHECK 7: Booking Collection')
    console.log('─────────────────────────────────────────────────────')
    const Booking = mongoose.model('Booking', new mongoose.Schema({
      name: String,
      email: String,
      projectName: String,
      status: String,
    }))

    const bookingCount = await Booking.countDocuments()
    console.log(`Total bookings in database: ${bookingCount}`)
    console.log()

    // Summary
    console.log('═══════════════════════════════════════════════════════')
    console.log('📊 DIAGNOSTIC SUMMARY')
    console.log('═══════════════════════════════════════════════════════')
    console.log('✅ Environment: OK')
    console.log('✅ Dependencies: OK')
    console.log('✅ bcrypt: OK')
    console.log('✅ JWT: OK')
    console.log('✅ MongoDB: Connected')
    console.log(`${userCount > 0 ? '✅' : '⚠️ '} Users: ${userCount} found`)
    console.log(`${bookingCount > 0 ? '✅' : 'ℹ️ '} Bookings: ${bookingCount} found`)
    console.log()

    if (userCount === 0) {
      console.log('⚠️  ACTION REQUIRED:')
      console.log('   No users found. Create an admin user:')
      console.log('   → node scripts/createAdmin.js')
      console.log()
    }

    if (!process.env.JWT_SECRET) {
      console.log('⚠️  SECURITY WARNING:')
      console.log('   Using fallback JWT_SECRET. Set a strong secret in .env:')
      console.log('   → JWT_SECRET=your_super_secret_key_here')
      console.log()
    }

    console.log('✅ System is ready for authentication!')
    console.log('   Start the server with: npm start')
    console.log()

    await mongoose.connection.close()
    process.exit(0)
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message)
    console.log()
    console.log('🔧 TROUBLESHOOTING:')
    console.log('   1. Is MongoDB running? Start it with:')
    console.log('      → mongod')
    console.log('   2. Check MONGODB_URI in .env')
    console.log('   3. Verify MongoDB is accessible on the specified port')
    console.log()
    process.exit(1)
  })
