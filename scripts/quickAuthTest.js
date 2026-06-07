#!/usr/bin/env node
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

async function quickTest() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    console.log('✅ Connected to MongoDB\n')
    
    // List all users
    const users = await User.find({}).select('+password')
    console.log(`Found ${users.length} users:\n`)
    
    for (const user of users) {
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`Name: ${user.name}`)
      console.log(`Password Hash: ${user.password.substring(0, 40)}...`)
      console.log(`Hash Length: ${user.password.length}`)
      console.log(`Starts with $2: ${user.password.startsWith('$2')}`)
      console.log(`isActive: ${user.isActive}`)
      
      // Test password matching with a common password
      const testPasswords = ['Jackman123', 'jackman123', 'Test123456', 'password123', 'admin123']
      console.log('\nTesting common passwords:')
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, user.password)
        if (match) {
          console.log(`  ✅ MATCH FOUND: "${pwd}"`)
        }
      }
      console.log('\n' + '-'.repeat(70) + '\n')
    }
    
    // Test creating a new user
    console.log('Testing user creation...\n')
    const testEmail = 'quicktest@example.com'
    
    // Delete existing
    await User.deleteOne({ email: testEmail })
    
    // Create new
    const newUser = await User.create({
      name: 'Quick Test',
      email: testEmail,
      password: 'Test123456',
      role: 'user'
    })
    
    console.log('✅ User created:', newUser.email)
    
    // Fetch with password
    const userWithPwd = await User.findById(newUser._id).select('+password')
    console.log('Password hash:', userWithPwd.password.substring(0, 40))
    console.log('Hash starts with $2:', userWithPwd.password.startsWith('$2'))
    
    // Test matching
    const matchCorrect = await userWithPwd.matchPassword('Test123456')
    const matchWrong = await userWithPwd.matchPassword('WrongPassword')
    
    console.log('matchPassword("Test123456"):', matchCorrect)
    console.log('matchPassword("WrongPassword"):', matchWrong)
    
    if (matchCorrect && !matchWrong) {
      console.log('\n✅ Password hashing and matching works correctly!')
    } else {
      console.log('\n❌ Password matching issue detected!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

quickTest()
