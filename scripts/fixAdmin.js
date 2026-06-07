#!/usr/bin/env node
/**
 * Fix Admin Script — removes all broken/duplicate admin accounts
 * and creates one clean admin from .env values.
 * Usage: node scripts/fixAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_NAME = process.env.ADMIN_NAME || 'Mixzy Admin'

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('\n❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env')
  process.exit(1)
}

// Use a minimal schema — no pre-save hooks — so we control exactly what gets saved
const userSchema = new mongoose.Schema({
  name:     { type: String },
  email:    { type: String, lowercase: true },
  password: { type: String, select: false },
  role:     { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

async function fixAdmin() {
  console.log('\n🔗 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  console.log('✅ Connected!\n')

  const User = mongoose.model('User', userSchema)

  // List all current admin/user accounts for visibility
  const allUsers = await User.find({}).select('+password').lean()
  console.log(`📋 Found ${allUsers.length} user(s) in database:`)
  allUsers.forEach(u => {
    console.log(`   • ${u.email} [${u.role}] — active: ${u.isActive}`)
  })

  // Remove ALL users except the correct admin email (clean slate for admin slot)
  const otherAdmins = allUsers.filter(
    u => u.role === 'admin' && u.email !== ADMIN_EMAIL
  )
  if (otherAdmins.length > 0) {
    console.log(`\n🗑️  Removing ${otherAdmins.length} stale/broken admin account(s):`)
    for (const u of otherAdmins) {
      await User.deleteOne({ _id: u._id })
      console.log(`   ✅ Deleted: ${u.email}`)
    }
  } else {
    console.log('\n✔  No stale admin accounts found.')
  }

  // Hash the password fresh (single hash, using bcryptjs)
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

  // Verify the hash works before saving
  const verifyBeforeSave = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword)
  if (!verifyBeforeSave) {
    console.error('❌ Critical: bcrypt hash verification failed before save. Aborting.')
    process.exit(1)
  }
  console.log('\n✅ bcrypt hash pre-verified — hash matches plain password')

  // Upsert the correct admin
  const existing = await User.findOne({ email: ADMIN_EMAIL }).select('+password')
  if (existing) {
    // Directly update via findByIdAndUpdate to bypass any pre-save hooks
    await User.findByIdAndUpdate(existing._id, {
      $set: {
        role: 'admin',
        password: hashedPassword,
        isActive: true,
        name: ADMIN_NAME,
      }
    })
    console.log(`✅ Admin account updated: ${ADMIN_EMAIL}`)
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    })
    console.log(`✅ Admin account created: ${ADMIN_EMAIL}`)
  }

  // Final verification — read back from DB and test password
  const savedUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password').lean()
  if (!savedUser) {
    console.error('❌ Could not read back saved user. Something is wrong.')
    process.exit(1)
  }
  const finalCheck = await bcrypt.compare(ADMIN_PASSWORD, savedUser.password)
  console.log(`\n🔐 Final password verification from DB: ${finalCheck ? '✅ PASS' : '❌ FAIL'}`)

  if (!finalCheck) {
    console.error('❌ Password does not match after save! Check for double-hashing in pre-save hooks.')
    process.exit(1)
  }

  console.log(`\n${'═'.repeat(55)}`)
  console.log('🎉 Admin account is ready! Login credentials:')
  console.log(`   Email:    ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}`)
  console.log(`   Admin UI: http://localhost:5173/admin/login`)
  console.log(`   User UI:  http://localhost:5173/auth/login`)
  console.log(`${'═'.repeat(55)}\n`)

  await mongoose.disconnect()
  process.exit(0)
}

fixAdmin().catch(err => {
  console.error('❌ Fix script failed:', err.message)
  process.exit(1)
})
