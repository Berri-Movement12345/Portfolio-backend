#!/usr/bin/env node
/**
 * API Audit Script
 * Tests all API endpoints and verifies data retrieval
 */

require('dotenv').config()
const mongoose = require('mongoose')
const axios = require('axios')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'
const API_URL = process.env.API_URL || 'http://localhost:5000/api'

console.log('═══════════════════════════════════════════════════════')
console.log('🔍 API ENDPOINT AUDIT')
console.log('═══════════════════════════════════════════════════════\n')

async function testEndpoint(method, endpoint, description) {
  try {
    const url = `${API_URL}${endpoint}`
    console.log(`Testing: ${method} ${endpoint}`)
    console.log(`Description: ${description}`)
    
    const response = await axios({ method, url, timeout: 5000 })
    const data = response.data
    
    console.log(`✅ Status: ${response.status}`)
    console.log(`✅ Success: ${data.success}`)
    
    if (data.data) {
      const count = Array.isArray(data.data) ? data.data.length : 1
      console.log(`✅ Data: ${count} item(s)`)
    } else if (data.projects) {
      console.log(`✅ Projects: ${data.projects.length} item(s)`)
    } else if (data.count !== undefined) {
      console.log(`✅ Count: ${data.count}`)
    }
    
    console.log('─────────────────────────────────────────────────────\n')
    return { success: true, endpoint, data }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    if (error.response) {
      console.log(`   Status: ${error.response.status}`)
      console.log(`   Message: ${error.response.data?.message || 'Unknown error'}`)
    }
    console.log('─────────────────────────────────────────────────────\n')
    return { success: false, endpoint, error: error.message }
  }
}

async function auditDatabase() {
  console.log('📊 DATABASE AUDIT')
  console.log('═══════════════════════════════════════════════════════\n')
  
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    console.log('✅ Connected to MongoDB\n')
    
    const { Project, Blog, Skill, Service, Testimonial, User, Contact, Booking } = require('../models')
    
    const stats = {
      projects: await Project.countDocuments(),
      publishedProjects: await Project.countDocuments({ status: 'published' }),
      blogs: await Blog.countDocuments(),
      publishedBlogs: await Blog.countDocuments({ status: 'published' }),
      skills: await Skill.countDocuments(),
      services: await Service.countDocuments(),
      activeServices: await Service.countDocuments({ isActive: true }),
      testimonials: await Testimonial.countDocuments(),
      approvedTestimonials: await Testimonial.countDocuments({ isApproved: true }),
      users: await User.countDocuments(),
      contacts: await Contact.countDocuments(),
      bookings: await Booking.countDocuments(),
    }
    
    console.log('Database Statistics:')
    console.log('─────────────────────────────────────────────────────')
    Object.entries(stats).forEach(([key, value]) => {
      const icon = value > 0 ? '✅' : '⚠️ '
      console.log(`${icon} ${key}: ${value}`)
    })
    console.log()
    
    // Check for sample data
    if (stats.publishedProjects === 0) {
      console.log('⚠️  WARNING: No published projects found!')
      console.log('   Run: node scripts/seeder.js to add sample data\n')
    }
    
    if (stats.publishedBlogs === 0) {
      console.log('⚠️  WARNING: No published blog posts found!')
      console.log('   Add blog posts via admin dashboard\n')
    }
    
    await mongoose.connection.close()
    return stats
  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
    return null
  }
}

async function auditAPIs() {
  console.log('\n📡 API ENDPOINTS AUDIT')
  console.log('═══════════════════════════════════════════════════════\n')
  
  const endpoints = [
    { method: 'GET', path: '/projects', desc: 'Get all projects' },
    { method: 'GET', path: '/projects?featured=true', desc: 'Get featured projects' },
    { method: 'GET', path: '/projects?category=fullstack', desc: 'Get projects by category' },
    { method: 'GET', path: '/blog', desc: 'Get all blog posts' },
    { method: 'GET', path: '/blog/metadata/all', desc: 'Get blog metadata' },
    { method: 'GET', path: '/skills', desc: 'Get all skills' },
    { method: 'GET', path: '/services', desc: 'Get all services' },
    { method: 'GET', path: '/testimonials', desc: 'Get all testimonials' },
    { method: 'GET', path: '/testimonials?featured=true', desc: 'Get featured testimonials' },
  ]
  
  const results = []
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.path, endpoint.desc)
    results.push(result)
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay between requests
  }
  
  return results
}

async function generateReport(dbStats, apiResults) {
  console.log('\n📋 AUDIT REPORT')
  console.log('═══════════════════════════════════════════════════════\n')
  
  const successfulAPIs = apiResults.filter(r => r.success).length
  const failedAPIs = apiResults.filter(r => !r.success).length
  
  console.log(`Total Endpoints Tested: ${apiResults.length}`)
  console.log(`✅ Successful: ${successfulAPIs}`)
  console.log(`❌ Failed: ${failedAPIs}`)
  console.log()
  
  if (failedAPIs > 0) {
    console.log('❌ FAILED ENDPOINTS:')
    console.log('─────────────────────────────────────────────────────')
    apiResults.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.endpoint}: ${r.error}`)
    })
    console.log()
  }
  
  console.log('💡 RECOMMENDATIONS:')
  console.log('─────────────────────────────────────────────────────')
  
  if (!dbStats) {
    console.log('❌ Database not accessible')
    console.log('   1. Ensure MongoDB is running')
    console.log('   2. Check MONGODB_URI in .env')
    console.log()
  } else {
    if (dbStats.publishedProjects === 0) {
      console.log('⚠️  No published projects')
      console.log('   → Run: node scripts/seeder.js')
      console.log()
    }
    
    if (dbStats.activeServices === 0) {
      console.log('⚠️  No active services')
      console.log('   → Add services via admin dashboard')
      console.log()
    }
    
    if (dbStats.approvedTestimonials === 0) {
      console.log('⚠️  No approved testimonials')
      console.log('   → Add testimonials via admin dashboard')
      console.log()
    }
  }
  
  if (failedAPIs > 0) {
    console.log('❌ Some API endpoints failed')
    console.log('   1. Ensure backend server is running: npm start')
    console.log('   2. Check server logs for errors')
    console.log('   3. Verify routes are properly configured')
    console.log()
  }
  
  if (successfulAPIs === apiResults.length && dbStats && dbStats.publishedProjects > 0) {
    console.log('✅ All systems operational!')
    console.log('   → Backend API is working correctly')
    console.log('   → Database has content')
    console.log('   → Frontend should load data successfully')
    console.log()
  }
  
  console.log('═══════════════════════════════════════════════════════')
}

async function main() {
  console.log('Starting API audit...\n')
  
  // Check if backend is running
  try {
    await axios.get(`${API_URL.replace('/api', '')}/api/health`, { timeout: 2000 })
    console.log('✅ Backend server is running\n')
  } catch (error) {
    console.log('❌ Backend server is not running!')
    console.log('   Start it with: cd backend && npm start\n')
    console.log('Continuing with database audit only...\n')
  }
  
  const dbStats = await auditDatabase()
  const apiResults = await auditAPIs()
  await generateReport(dbStats, apiResults)
  
  process.exit(0)
}

main().catch(error => {
  console.error('❌ Audit failed:', error)
  process.exit(1)
})
