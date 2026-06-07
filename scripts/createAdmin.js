#!/usr/bin/env node
/**
 * Admin Account Creation Script
 * Usage: node scripts/createAdmin.js
 * 
 * Creates or updates the admin account from environment variables.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before running.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_NAME = process.env.ADMIN_NAME || 'Mixzy Admin'

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('\n❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file')
  console.log('\nAdd these to backend/.env:')
  console.log('  ADMIN_EMAIL=your@email.com')
  console.log('  ADMIN_PASSWORD=YourSecurePassword123!')
  process.exit(1)
}

if (ADMIN_PASSWORD.length < 8) {
  console.error('❌ Error: ADMIN_PASSWORD must be at least 8 characters long.')
  process.exit(1)
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

async function createAdmin() {
  try {
    console.log('\n🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    console.log('✅ Connected!\n')

    const User = mongoose.model('User', userSchema)
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })

    if (existing) {
      // Upgrade existing account to admin role
      await User.findByIdAndUpdate(existing._id, {
        role: 'admin',
        password: hashedPassword,
        isActive: true,
        name: ADMIN_NAME,
      })
      console.log('✅ Existing account upgraded to ADMIN role!')
    } else {
      // Create new admin account
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      })
      console.log('✅ New ADMIN account created!')
    }

    console.log(`\n${'═'.repeat(50)}`)
    console.log('📋 Admin Credentials (save these securely):')
    console.log(`   Email:    ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log(`   Login at: http://localhost:5173/admin/login`)
    console.log(`${'═'.repeat(50)}\n`)

    await mongoose.disconnect()
    console.log('🔒 Database connection closed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed:', err.message)
    process.exit(1)
  }
}

createAdmin()
