require('dotenv').config()
const mongoose = require('mongoose')
const { Service } = require('../models')

async function updateServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Deactivate services 3-6 (keep only 1 and 2 active)
    const result = await Service.updateMany(
      { order: { $gte: 3, $lte: 6 } },
      { isActive: false }
    )
    
    console.log('✅ Services updated:', result)
    
    // Verify active count
    const activeCount = await Service.countDocuments({ isActive: true })
    const allServices = await Service.find().sort('order')
    
    console.log('\n📊 Service Status:')
    console.log(`Total active services: ${activeCount}`)
    console.log('\nAll services:')
    allServices.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.title} (order: ${s.order}, active: ${s.isActive})`)
    })
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

updateServices()
