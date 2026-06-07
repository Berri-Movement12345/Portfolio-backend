const slugify = require('slugify')
const { Blog } = require('../models')

// @desc   Get all published blog posts with caching support
// @route  GET /api/blog
// @access Public
exports.getPosts = async (req, res) => {
  const { category, tag, search, page = 1, limit = 9 } = req.query

  try {
    const query = { status: 'published' }
    if (category) query.category = category
    if (tag) query.tags = tag
    if (search) query.$text = { $search: search }

    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      Blog.find(query)
        .select('-content -comments')
        .populate('author', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(), // Use lean() for better performance on read-only queries
      Blog.countDocuments(query),
    ])

    // Set cache headers for better performance
    res.set('Cache-Control', 'public, max-age=3600') // 1 hour cache
    
    res.json({
      success: true,
      count: posts.length,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      data: posts,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc   Get blog metadata (fast endpoint for SEO and previews)
// @route  GET /api/blog/metadata/all
// @access Public
exports.getMetadata = async (req, res) => {
  try {
    const posts = await Blog.find({ status: 'published' })
      .select('title slug excerpt category tags date readTime')
      .sort('-createdAt')
      .lean()

    res.set('Cache-Control', 'public, max-age=7200') // 2 hour cache
    res.json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc   Get single post by slug (increments view count)
// @route  GET /api/blog/:slug
// @access Public
exports.getPost = async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar')
      .lean()

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' })
    }

    // Fetch related posts in parallel
    const related = await Blog.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [{ category: post.category }, { tags: { $in: post.tags } }],
    })
      .select('title slug excerpt category tags readTime createdAt views')
      .limit(3)
      .lean()

    // Set longer cache for published content
    res.set('Cache-Control', 'public, max-age=86400') // 1 day cache
    
    res.json({ 
      success: true, 
      data: post, 
      related,
      viewCount: post.views,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc   Create blog post
// @route  POST /api/blog
// @access Admin
exports.createPost = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true })
    req.body.author = req.user._id
    if (req.file) req.body.image = req.file.path

    const post = await Blog.create(req.body)
    
    res.status(201).json({ success: true, data: post })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

// @desc   Update blog post
// @route  PUT /api/blog/:id
// @access Admin
exports.updatePost = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true })
    }
    if (req.file) req.body.image = req.file.path

    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' })
    
    res.json({ success: true, data: post })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

// @desc   Delete blog post
// @route  DELETE /api/blog/:id
// @access Admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' })
    
    res.json({ success: true, message: 'Post deleted.' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc   Add comment to post
// @route  POST /api/blog/:slug/comments
// @access Public
exports.addComment = async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, status: 'published' })
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' })

    post.comments.push({
      name: req.body.name,
      email: req.body.email,
      text: req.body.text,
    })
    await post.save()

    res.status(201).json({ success: true, message: 'Comment submitted for approval.' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}

// @desc   Get all posts (admin, including drafts)
// @route  GET /api/blog/admin/all
// @access Admin
exports.getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Blog.find()
      .select('-content')
      .populate('author', 'name')
      .sort('-createdAt')
      .lean()

    res.json({ success: true, count: posts.length, data: posts })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
