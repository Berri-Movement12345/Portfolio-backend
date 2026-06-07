require('dotenv').config()
const mongoose = require('mongoose')
const { Project, Service } = require('../models')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to database.')
    const projects = await Project.find()
    const services = await Service.find()
    
    console.log(`Projects count in DB: ${projects.length}`)
    projects.forEach((p, i) => {
      console.log(`  ${i+1}. ${p.title} (${p.slug}) - ${p.category} - Image: ${p.image}`)
    })
    
    console.log(`Services count in DB: ${services.length}`)
    services.forEach((s, i) => {
      console.log(`  ${i+1}. ${s.title} (${s.num}) - Active: ${s.isActive}`)
    })
    
    await mongoose.connection.close()
    process.exit(0)
  })
  .catch(err => {
    console.error('Error connecting to DB:', err)
    process.exit(1)
  })
