// skills.js
const express = require('express')
const skillRouter = express.Router()
const { getSkills, createSkillCategory, updateSkillCategory, deleteSkillCategory } = require('../controllers/resourceController')
const { protect, adminOnly } = require('../middleware/auth')

skillRouter.get('/', getSkills)
skillRouter.post('/', protect, adminOnly, createSkillCategory)
skillRouter.put('/:id', protect, adminOnly, updateSkillCategory)
skillRouter.delete('/:id', protect, adminOnly, deleteSkillCategory)

module.exports = skillRouter
