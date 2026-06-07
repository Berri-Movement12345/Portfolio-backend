require('dotenv').config()
const mongoose = require('mongoose')
const { Service } = require('../models')

async function fixServiceThree() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Activate service 3 (API Development)
    const result = await Service.findOneAndUpdate(
      { order: 3 },
      { isActive: true },
      { new: true }
    )
    
    if (!result) {
      console.log('⚠️  Service with order 3 not found')
      process.exit(1)
    }
    
    console.log('✅ Service 3 updated:', result.title, '- isActive:', result.isActive)
    
    // Verify active services
    const activeServices = await Service.find({ isActive: true }).sort('order')
    console.log(`\n📊 Active services count: ${activeServices.length}`)
    activeServices.forEach((s) => {
      console.log(`  ✓ ${s.order}. ${s.title}`)
    })
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

fixServiceThree()
