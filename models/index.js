const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

// ─── User ─────────────────────────────────────────────
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  bio: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: { type: String, select: false },
  savedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

// ─── Project ──────────────────────────────────────────
const projectSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'mobile', 'uiux'],
    required: true,
  },
  tags: [String],
  description: { type: String, required: true },
  longDescription: String,
  tech: [String],
  image: String,
  gallery: [String],
  liveUrl: String,
  githubUrl: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  metrics: {
    performance: Number,
    lighthouse: Number,
    uptime: Number,
  },
  features: [String],
  challenges: String,
  gradient: String,
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: true })

// ─── Skill ────────────────────────────────────────────
const skillSchema = new Schema({
  category: { type: String, required: true },
  icon: String,
  skills: [{
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100 },
    years: Number,
    icon: String,
  }],
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Service ──────────────────────────────────────────
const serviceSchema = new Schema({
  num: String,
  icon: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [String],
  price: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// ─── Testimonial ──────────────────────────────────────
const testimonialSchema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  role: String,
  company: String,
  avatar: String,
  initials: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isApproved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// ─── Blog Post ────────────────────────────────────────
const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  image: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  readTime: String,
  date: String,
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  comments: [{
    name: String,
    email: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false },
  }],
}, { timestamps: true })

// ─── Contact Message ──────────────────────────────────
const contactSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  ipAddress: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  replies: [{
    text: { type: String, required: true },
    sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    emailSent: { type: Boolean, default: false },
  }],
}, { timestamps: true })

// ─── Analytics ────────────────────────────────────────
const analyticsSchema = new Schema({
  date: { type: Date, default: Date.now },
  pageViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  topPages: [{
    path: String,
    views: Number,
  }],
  referrers: [{
    source: String,
    count: Number,
  }],
  devices: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
}, { timestamps: true })

// ─── Booking ──────────────────────────────────────────
const bookingSchema = new Schema({
  websiteType: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  companyName: String,
  projectName: String,
  phoneNumber: { type: String, required: true },
  projectDescription: { type: String, required: true },
  budget: { type: String, required: true },
  deadline: { type: String, required: true },
  userEmail: { type: String, required: true },
  logoUrl: String,
  additionalNotes: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
}, { timestamps: true })

// ─── Exports ──────────────────────────────────────────
module.exports = {
  User: mongoose.model('User', userSchema),
  Project: mongoose.model('Project', projectSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Service: mongoose.model('Service', serviceSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Contact: mongoose.model('Contact', contactSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Booking: mongoose.model('Booking', bookingSchema),
}
