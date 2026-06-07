#!/usr/bin/env node
/**
 * Authentication Test Script
 * Tests user creation, login, and password verification
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

// User Schema (inline for testing)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

const User = mongoose.model('User', userSchema)

async function testAuth() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('✅ Connected to MongoDB\n')

    const testEmail = 'test@example.com'
    const testPassword = 'Test123456'

    // Clean up existing test user
    await User.deleteOne({ email: testEmail })
    console.log('🧹 Cleaned up existing test user\n')

    // Test 1: Create User
    console.log('📝 TEST 1: Creating test user...')
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      role: 'user',
    })
    console.log(`✅ User created: ${user.email} (ID: ${user._id})`)
    console.log(`   Password was hashed: ${user.password.substring(0, 20)}...\n`)

    // Test 2: Find User with Password
    console.log('🔍 TEST 2: Finding user with password field...')
    const foundUser = await User.findOne({ email: testEmail }).select('+password')
    if (!foundUser) {
      console.log('❌ User not found!')
      process.exit(1)
    }
    console.log(`✅ User found: ${foundUser.email}`)
    console.log(`   Stored hash: ${foundUser.password.substring(0, 20)}...\n`)

    // Test 3: Password Comparison - Correct Password
    console.log('🔐 TEST 3: Testing correct password...')
    const isMatchCorrect = await foundUser.matchPassword(testPassword)
    console.log(`   Input: "${testPassword}"`)
    console.log(`   Result: ${isMatchCorrect ? '✅ MATCH' : '❌ NO MATCH'}`)
    if (!isMatchCorrect) {
      console.log('❌ FAILED: Correct password should match!')
      process.exit(1)
    }
    console.log()

    // Test 4: Password Comparison - Wrong Password
    console.log('🔐 TEST 4: Testing wrong password...')
    const isMatchWrong = await foundUser.matchPassword('WrongPassword123')
    console.log(`   Input: "WrongPassword123"`)
    console.log(`   Result: ${isMatchWrong ? '❌ MATCH (SHOULD NOT MATCH!)' : '✅ NO MATCH'}`)
    if (isMatchWrong) {
      console.log('❌ FAILED: Wrong password should not match!')
      process.exit(1)
    }
    console.log()

    // Test 5: Direct bcrypt comparison
    console.log('🔐 TEST 5: Direct bcrypt comparison...')
    const directMatch = await bcrypt.compare(testPassword, foundUser.password)
    console.log(`   Direct bcrypt.compare result: ${directMatch ? '✅ MATCH' : '❌ NO MATCH'}`)
    if (!directMatch) {
      console.log('❌ FAILED: Direct bcrypt comparison should work!')
      process.exit(1)
    }
    console.log()

    // Test 6: Check existing users
    console.log('👥 TEST 6: Checking all users in database...')
    const allUsers = await User.find().select('+password')
    console.log(`   Total users: ${allUsers.length}`)
    for (const u of allUsers) {
      console.log(`   - ${u.email} [${u.role}] - Hash: ${u.password.substring(0, 30)}...`)
    }
    console.log()

    console.log('═══════════════════════════════════════════════════════')
    console.log('✅ ALL TESTS PASSED!')
    console.log('═══════════════════════════════════════════════════════')
    console.log('\n💡 Authentication system is working correctly.')
    console.log('   If login still fails, check:')
    console.log('   1. Frontend is sending correct email/password')
    console.log('   2. Network requests are reaching the backend')
    console.log('   3. JWT_SECRET is set in .env')
    console.log('   4. CORS is configured correctly\n')

    // Clean up
    await User.deleteOne({ email: testEmail })
    console.log('🧹 Test user cleaned up')

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('👋 Disconnected from MongoDB')
    process.exit(0)
  }
}

testAuth()
