require('dotenv').config()
const mongoose = require('mongoose')
const { Service } = require('../models')

async function updateUItoBackend() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Update the UI/UX service (order 2) to Backend Development with MongoDB
    const result = await Service.findOneAndUpdate(
      { order: 2 },
      {
        num: '02',
        icon: '◈',
        title: 'Backend Development with MongoDB',
        description: 'Powerful server-side applications built with Node.js, Express, and MongoDB. Scalable databases, authentication systems, and production-ready APIs.',
        features: ['Node.js & Express', 'MongoDB & Mongoose', 'REST APIs', 'Authentication & Security'],
        price: 'From ₦2,000',
      },
      { new: true }
    )
    
    console.log('✅ Service updated:', result)
    
    // Display all services
    const allServices = await Service.find().sort('order')
    console.log('\n📊 Updated Services:')
    allServices.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.title} (${s.isActive ? '✓ Active' : '✗ Inactive'})`)
      console.log(`     Description: ${s.description}`)
      console.log(`     Features: ${s.features.join(', ')}`)
    })
    
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

updateUItoBackend()
