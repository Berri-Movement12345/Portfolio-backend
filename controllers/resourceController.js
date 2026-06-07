const { Skill, Service, Testimonial, User, Analytics } = require('../models')
const cloudinary = require('../config/cloudinary')

// ─── SKILLS ───────────────────────────────────────────

exports.getSkills = async (req, res) => {
  const skills = await Skill.find().sort('order')
  res.json({ success: true, data: skills })
}

exports.createSkillCategory = async (req, res) => {
  const skill = await Skill.create(req.body)
  res.status(201).json({ success: true, data: skill })
}

exports.updateSkillCategory = async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!skill) return res.status(404).json({ success: false, message: 'Skill category not found.' })
  res.json({ success: true, data: skill })
}

exports.deleteSkillCategory = async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Skill category deleted.' })
}

// ─── SERVICES ─────────────────────────────────────────

exports.getServices = async (req, res) => {
  const services = await Service.find({ isActive: true }).sort('order')
  res.json({ success: true, data: services })
}

exports.createService = async (req, res) => {
  const service = await Service.create(req.body)
  res.status(201).json({ success: true, data: service })
}

exports.updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!service) return res.status(404).json({ success: false, message: 'Service not found.' })
  res.json({ success: true, data: service })
}

exports.deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Service deleted.' })
}

// ─── TESTIMONIALS ─────────────────────────────────────

exports.getTestimonials = async (req, res) => {
  const { featured } = req.query
  const query = { isApproved: true }
  if (featured !== undefined) query.featured = featured === 'true'
  const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: 1 })
  res.json({ success: true, data: testimonials })
}

exports.createTestimonial = async (req, res) => {
  const testimonial = await Testimonial.create(req.body)
  res.status(201).json({ success: true, data: testimonial })
}

exports.updateTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found.' })
  res.json({ success: true, data: testimonial })
}

exports.deleteTestimonial = async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Testimonial deleted.' })
}

exports.approveTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  )
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found.' })
  res.json({ success: true, data: testimonial })
}

// ─── USERS ────────────────────────────────────────────

exports.getUsers = async (req, res) => {
  const users = await User.find().sort('-createdAt')
  res.json({ success: true, count: users.length, data: users })
}

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
  res.json({ success: true, data: user })
}

exports.updateUser = async (req, res) => {
  const { name, bio, avatar } = req.body
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }
  )
  res.json({ success: true, data: user })
}

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'User deleted.' })
}

exports.toggleUserRole = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
  user.role = user.role === 'admin' ? 'user' : 'admin'
  await user.save()
  res.json({ success: true, data: user })
}

// ─── ANALYTICS ────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
  const { Project, Blog, Contact } = require('../models')
  const [projectCount, blogCount, messageCount, unreadMessages, users] = await Promise.all([
    Project.countDocuments({ status: 'published' }),
    Blog.countDocuments({ status: 'published' }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'unread' }),
    User.countDocuments(),
  ])

  res.json({
    success: true,
    data: {
      projects: projectCount,
      blogPosts: blogCount,
      totalMessages: messageCount,
      unreadMessages,
      users,
    },
  })
}

exports.trackPageView = async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await Analytics.findOneAndUpdate(
    { date: today },
    {
      $inc: { pageViews: 1 },
      $push: { topPages: { path: req.body.path, views: 1 } },
    },
    { upsert: true, new: true }
  )

  res.json({ success: true })
}

// ─── UPLOAD ───────────────────────────────────────────

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' })
  }
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  })
}

exports.deleteImage = async (req, res) => {
  const { publicId } = req.body
  if (!publicId) {
    return res.status(400).json({ success: false, message: 'Public ID required.' })
  }
  await cloudinary.uploader.destroy(publicId)
  res.json({ success: true, message: 'Image deleted from Cloudinary.' })
}
