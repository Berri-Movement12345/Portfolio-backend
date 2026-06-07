#!/usr/bin/env node
/**
 * Upsert project + testimonial showcase copy (no wipe).
 * Usage: node scripts/syncProjectCopy.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const { Project, Testimonial } = require('../models')
const { projects, testimonials } = require('../utils/seeder')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

async function main() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  const keepSlugs = projects.map((p) => p.slug)

  for (const doc of projects) {
    const { slug, ...rest } = doc
    const result = await Project.findOneAndUpdate(
      { slug },
      { $set: rest },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    console.log(`  ✓ project: ${result.title} (${slug})`)
  }

  const removed = await Project.deleteMany({ slug: { $nin: keepSlugs } })
  if (removed.deletedCount > 0) {
    console.log(`  ✓ removed ${removed.deletedCount} placeholder project(s)`)
  }

  await Testimonial.deleteMany({})
  await Testimonial.insertMany(testimonials)
  console.log(`  ✓ testimonials: ${testimonials.length} inserted`)

  await mongoose.disconnect()
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
