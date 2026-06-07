const slugify = require('slugify')
const { Project } = require('../models')

// @desc   Get all projects
// @route  GET /api/projects
// @access Public
exports.getProjects = async (req, res) => {
  const { category, featured, status = 'published', limit, sort = '-createdAt' } = req.query

  const query = { status }
  if (category) query.category = category
  if (featured !== undefined) query.featured = featured === 'true'

  let dbQuery = Project.find(query).sort(sort)
  if (limit) dbQuery = dbQuery.limit(Number(limit))

  const projects = await dbQuery
  res.json({ success: true, count: projects.length, projects })
}

// @desc   Get single project by slug
// @route  GET /api/projects/:slug
// @access Public
exports.getProject = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, status: 'published' })
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' })
  }
  res.json({ success: true, data: project })
}

// @desc   Create project
// @route  POST /api/projects
// @access Admin
exports.createProject = async (req, res) => {
  // Auto-generate slug from title
  req.body.slug = slugify(req.body.title, { lower: true, strict: true })

  // If image uploaded via Cloudinary
  if (req.file) req.body.image = req.file.path

  const project = await Project.create(req.body)
  res.status(201).json({ success: true, data: project })
}

// @desc   Update project
// @route  PUT /api/projects/:id
// @access Admin
exports.updateProject = async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true })
  }
  if (req.file) req.body.image = req.file.path

  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' })
  }

  res.json({ success: true, data: project })
}

// @desc   Delete project
// @route  DELETE /api/projects/:id
// @access Admin
exports.deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' })
  }
  res.json({ success: true, message: 'Project deleted.' })
}

// @desc   Toggle featured status
// @route  PATCH /api/projects/:id/featured
// @access Admin
exports.toggleFeatured = async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found.' })
  }
  project.featured = !project.featured
  await project.save()
  res.json({ success: true, data: project })
}
