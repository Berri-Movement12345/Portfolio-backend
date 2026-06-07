#!/usr/bin/env node
/**
 * Comprehensive Authentication System Audit Script
 * Tests every step of the auth flow from registration to login
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const TEST_EMAIL = 'testauth@example.com'
const TEST_PASSWORD = 'TestPass123'
const TEST_NAME = 'Auth Test User'

console.log('\n' + '═'.repeat(70))
console.log('🔐 AUTHENTICATION SYSTEM AUDIT')
console.log('═'.repeat(70) + '\n')

const testResults = {
  passed: [],
  failed: [],
  warnings: []
}

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${status}: ${name}`)
  if (details) console.log(`   ${details}`)
  
  if (passed) {
    testResults.passed.push(name)
  } else {
    testResults.failed.push({ name, details })
  }
}

function logWarning(message) {
  console.log(`⚠️  WARNING: ${message}`)
  testResults.warnings.push(message)
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`)
}

function logSection(title) {
  console.log(`\n${'─'.repeat(70)}`)
  console.log(`📋 ${title}`)
  console.log('─'.repeat(70))
}

async function runAudit() {
  try {
    // ══════════════════════════════════════════════════════════════
    // TEST 1: MongoDB Connection
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 1: Database Connection')
    
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      logTest('MongoDB Connection', true, `Connected to: ${mongoose.connection.host}`)
      logInfo(`Database: ${mongoose.connection.name}`)
      logInfo(`Collections: ${Object.keys(mongoose.connection.collections).length}`)
    } catch (error) {
      logTest('MongoDB Connection', false, `Error: ${error.message}`)
      throw new Error('Cannot proceed without database connection')
    }

    // ══════════════════════════════════════════════════════════════
    // TEST 2: User Model Schema Verification
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 2: User Model Schema')
    
    const schema = User.schema.obj
    const requiredFields = ['name', 'email', 'password']
    
    for (const field of requiredFields) {
      const exists = schema[field] !== undefined
      logTest(`Field "${field}" exists in schema`, exists)
    }
    
    // Check password field has select: false
    const passwordField = User.schema.paths.password
    const hasSelectFalse = passwordField.options.select === false
    logTest('Password field has select: false', hasSelectFalse, 
      hasSelectFalse ? 'Password hidden by default ✓' : 'Password exposed by default ✗')
    
    // Check bcrypt pre-save hook exists
    const preSaveHooks = User.schema.pre('save').length || User.schema._pres.get('save')?.length || 0
    logTest('Password hashing hook registered', preSaveHooks > 0, 
      `Found ${preSaveHooks} pre-save hook(s)`)
    
    // Check matchPassword method exists
    const hasMatchPasswordMethod = typeof User.schema.methods.matchPassword === 'function'
    logTest('matchPassword method exists', hasMatchPasswordMethod)

    // ══════════════════════════════════════════════════════════════
    // TEST 3: Clean Up Previous Test Data
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 3: Test Data Cleanup')
    
    const deleteResult = await User.deleteOne({ email: TEST_EMAIL.toLowerCase() })
    if (deleteResult.deletedCount > 0) {
      logInfo(`Deleted ${deleteResult.deletedCount} existing test user(s)`)
    } else {
      logInfo('No existing test users found')
    }

    // ══════════════════════════════════════════════════════════════
    // TEST 4: User Registration (Direct DB)
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 4: User Registration (Database Level)')
    
    logInfo(`Creating user: ${TEST_EMAIL}`)
    logInfo(`Password (plain): ${TEST_PASSWORD}`)
    
    const newUser = await User.create({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: 'user'
    })
    
    logTest('User created in database', !!newUser._id, `User ID: ${newUser._id}`)
    logTest('Email normalized', newUser.email === TEST_EMAIL.toLowerCase())
    logTest('Name saved correctly', newUser.name === TEST_NAME)
    logTest('Role assigned', newUser.role === 'user')

    // ══════════════════════════════════════════════════════════════
    // TEST 5: Password Hashing Verification
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 5: Password Hashing')
    
    // Fetch user with password field
    const userWithPassword = await User.findById(newUser._id).select('+password')
    
    logTest('User retrieved with password field', !!userWithPassword)
    logTest('Password field exists', !!userWithPassword.password)
    
    const isPlainText = userWithPassword.password === TEST_PASSWORD
    const looksHashed = userWithPassword.password.startsWith('$2')
    const hasCorrectLength = userWithPassword.password.length === 60
    
    logTest('Password is NOT plain text', !isPlainText, 
      isPlainText ? 'PASSWORD STORED IN PLAIN TEXT! CRITICAL ISSUE!' : 'Password is hashed ✓')
    logTest('Password starts with $2 (bcrypt format)', looksHashed)
    logTest('Password hash length is 60 chars', hasCorrectLength, 
      `Length: ${userWithPassword.password.length}`)
    
    logInfo(`Hashed password: ${userWithPassword.password.substring(0, 30)}...`)

    // ══════════════════════════════════════════════════════════════
    // TEST 6: bcrypt.compare() Direct Test
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 6: Direct bcrypt.compare() Test')
    
    const directCompareCorrect = await bcrypt.compare(TEST_PASSWORD, userWithPassword.password)
    logTest('bcrypt.compare() with CORRECT password', directCompareCorrect)
    
    const directCompareWrong = await bcrypt.compare('WrongPassword123', userWithPassword.password)
    logTest('bcrypt.compare() with WRONG password returns false', !directCompareWrong)

    // ══════════════════════════════════════════════════════════════
    // TEST 7: matchPassword Method Test
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 7: User.matchPassword() Method')
    
    const methodMatchCorrect = await userWithPassword.matchPassword(TEST_PASSWORD)
    logTest('matchPassword() with CORRECT password', methodMatchCorrect)
    
    const methodMatchWrong = await userWithPassword.matchPassword('WrongPassword123')
    logTest('matchPassword() with WRONG password returns false', !methodMatchWrong)

    // ══════════════════════════════════════════════════════════════
    // TEST 8: Login Flow Simulation
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 8: Login Flow Simulation')
    
    // Simulate controller login logic
    const normalizedEmail = TEST_EMAIL.toLowerCase().trim()
    logInfo(`Looking up user: ${normalizedEmail}`)
    
    const foundUser = await User.findOne({ email: normalizedEmail }).select('+password')
    logTest('User found by email', !!foundUser)
    
    if (foundUser) {
      logInfo(`Found user ID: ${foundUser._id}`)
      logInfo(`Found user email: ${foundUser.email}`)
      logInfo(`Found user role: ${foundUser.role}`)
      logInfo(`User isActive: ${foundUser.isActive}`)
      
      const loginPasswordMatch = await foundUser.matchPassword(TEST_PASSWORD)
      logTest('Password verification in login flow', loginPasswordMatch)
      
      if (!loginPasswordMatch) {
        logWarning('PASSWORD MISMATCH - This is the likely cause of login failures!')
        logInfo('Debugging info:')
        logInfo(`  - Plain password: ${TEST_PASSWORD}`)
        logInfo(`  - Hashed in DB: ${foundUser.password.substring(0, 30)}...`)
        logInfo(`  - Match result: ${loginPasswordMatch}`)
      }
    }

    // ══════════════════════════════════════════════════════════════
    // TEST 9: Case Sensitivity Check
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 9: Email Case Sensitivity')
    
    const upperCaseEmail = TEST_EMAIL.toUpperCase()
    const mixedCaseEmail = 'TeStAuTh@ExAmPlE.cOm'
    
    const foundUpperCase = await User.findOne({ email: upperCaseEmail })
    const foundMixedCase = await User.findOne({ email: mixedCaseEmail })
    
    logTest('Email lookup with UPPERCASE', !!foundUpperCase, 
      foundUpperCase ? 'MongoDB comparison is case-insensitive ✓' : 'Case sensitivity may cause issues')
    logTest('Email lookup with MixedCase', !!foundMixedCase)

    // ══════════════════════════════════════════════════════════════
    // TEST 10: Check Existing Users
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 10: Existing Users Audit')
    
    const allUsers = await User.find({}).select('+password').limit(10)
    logInfo(`Total users in database: ${allUsers.length}`)
    
    if (allUsers.length > 0) {
      console.log('\nUser List:')
      for (const u of allUsers) {
        console.log(`  - ${u.email} (${u.role}) - Password Hash: ${u.password.substring(0, 20)}... [${u.password.length} chars]`)
        
        // Check if password is hashed
        if (!u.password.startsWith('$2')) {
          logWarning(`User ${u.email} has unhashed password!`)
        }
      }
    }

    // ══════════════════════════════════════════════════════════════
    // TEST 11: Test With Admin Email
    // ══════════════════════════════════════════════════════════════
    logSection('TEST 11: Admin Email Test')
    
    const adminEmail = 'godswillm23456@gmail.com'
    const adminUser = await User.findOne({ email: adminEmail }).select('+password')
    
    if (adminUser) {
      logInfo(`Admin user found: ${adminUser.email}`)
      logInfo(`Admin role: ${adminUser.role}`)
      logInfo(`Admin password hash: ${adminUser.password.substring(0, 30)}...`)
      logInfo(`Admin isActive: ${adminUser.isActive}`)
      
      const adminPasswordLooksHashed = adminUser.password.startsWith('$2')
      logTest('Admin password is hashed', adminPasswordLooksHashed)
    } else {
      logInfo('No admin user found with email: ' + adminEmail)
    }

    // ══════════════════════════════════════════════════════════════
    // FINAL REPORT
    // ══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(70))
    console.log('📊 AUDIT SUMMARY')
    console.log('═'.repeat(70))
    
    console.log(`\n✅ Tests Passed: ${testResults.passed.length}`)
    testResults.passed.forEach(test => console.log(`   ✓ ${test}`))
    
    if (testResults.failed.length > 0) {
      console.log(`\n❌ Tests Failed: ${testResults.failed.length}`)
      testResults.failed.forEach(({ name, details }) => {
        console.log(`   ✗ ${name}`)
        if (details) console.log(`     ${details}`)
      })
    }
    
    if (testResults.warnings.length > 0) {
      console.log(`\n⚠️  Warnings: ${testResults.warnings.length}`)
      testResults.warnings.forEach(warning => console.log(`   ⚠ ${warning}`))
    }
    
    // ══════════════════════════════════════════════════════════════
    // RECOMMENDATIONS
    // ══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(70))
    console.log('💡 RECOMMENDATIONS')
    console.log('═'.repeat(70) + '\n')
    
    if (testResults.failed.length === 0) {
      console.log('✅ All tests passed! Authentication system appears to be working correctly.')
      console.log('\nIf you\'re still experiencing login issues, check:')
      console.log('1. Frontend is sending correct field names (email, password)')
      console.log('2. Network requests are reaching the backend')
      console.log('3. No middleware is interfering with auth requests')
      console.log('4. CORS is configured correctly')
      console.log('5. Rate limiting is not blocking requests')
    } else {
      console.log('❌ Issues detected! Review the failed tests above.')
      console.log('\nCommon fixes:')
      console.log('1. If password is not hashed: pre-save hook may not be firing')
      console.log('2. If matchPassword fails: bcrypt.compare() issue or password encoding problem')
      console.log('3. If user not found: email normalization mismatch')
      console.log('4. If email case issues: ensure toLowerCase() on both registration and login')
    }
    
    console.log('\n' + '═'.repeat(70) + '\n')

  } catch (error) {
    console.error('\n❌ AUDIT FAILED:', error.message)
    console.error(error.stack)
  } finally {
    await mongoose.connection.close()
    console.log('✅ Database connection closed\n')
  }
}

// Run the audit
runAudit()
