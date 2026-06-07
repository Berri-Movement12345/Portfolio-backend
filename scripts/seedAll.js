/**
 * seedAll.js — Populate MongoDB with all static data from the frontend's data/index.js
 * Run: node scripts/seedAll.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const { Project, Service, Skill, Testimonial, Blog } = require('../models')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

// ─── Services ─────────────────────────────────────────
const servicesData = [
  {
    num: '01', icon: '⬡', title: 'Full Stack Development',
    description: 'End-to-end web applications built with modern React frontends and scalable Node.js backends, designed for performance and growth.',
    features: ['React / Tailwind CSS', 'Node.js APIs', 'Database design', 'Authentication'],
    price: 'From ₦3,000', order: 1, isActive: true,
  },
  {
    num: '02', icon: '◈', title: 'Backend Development with MongoDB',
    description: 'Powerful server-side applications built with Node.js, Express, and MongoDB. Scalable databases, authentication systems, and production-ready APIs.',
    features: ['Node.js & Express', 'MongoDB & Mongoose', 'REST APIs', 'Authentication & Security'],
    price: 'From ₦2,000', order: 2, isActive: true,
  },
  {
    num: '03', icon: '◈', title: 'API Development',
    description: 'RESTful APIs engineered for reliability, security, and scalability with comprehensive documentation.',
    features: ['REST APIs', 'Auth & security', 'Rate limiting', 'Documentation'],
    price: 'From ₦1,200', order: 3, isActive: true,
  },
  {
    num: '04', icon: '❋', title: 'E-Commerce Solutions',
    description: 'Custom shopping experiences with seamless payment integrations, inventory management, and conversion-optimized flows.',
    features: ['Stripe / PayPal', 'Inventory system', 'Analytics', 'Multi-currency'],
    price: 'From ₦2,500', order: 4, isActive: false,
  },
  {
    num: '05', icon: '◎', title: 'Performance Optimization',
    description: 'Comprehensive audits and optimizations to achieve elite Core Web Vitals, faster load times, and better SEO rankings.',
    features: ['Lighthouse audit', 'Bundle analysis', 'CDN setup', 'Caching strategy'],
    price: 'From ₦800', order: 5, isActive: false,
  },
  {
    num: '06', icon: '⊹', title: 'Technical Consulting',
    description: 'Strategic guidance on architecture decisions, technology selection, code quality, and scaling strategies for your product.',
    features: ['Architecture review', 'Tech stack advice', 'Code review', 'Team training'],
    price: '₦150/hour', order: 6, isActive: false,
  },
]

// ─── Skill Categories ─────────────────────────────────
const skillsData = [
  {
    category: 'Frontend', icon: '⬡', order: 1,
    skills: [
      { name: 'React', level: 72, years: 3 },
      { name: 'CSS / Vanilla CSS', level: 63, years: 3 },
      { name: 'Tailwind CSS', level: 52, years: 2 },
      { name: 'JavaScript (ES6+)', level: 75, years: 3 },
      { name: 'Responsive Web Design', level: 70, years: 3 },
    ],
  },
  {
    category: 'Backend', icon: '◈', order: 2,
    skills: [
      { name: 'Node.js', level: 73, years: 3 },
      { name: 'Express', level: 62, years: 3 },
      { name: 'MongoDB / Mongoose', level: 82, years: 3 },
      { name: 'REST API Design', level: 62, years: 3 },
    ],
  },
  {
    category: 'Design & Tools', icon: '❋', order: 3,
    skills: [
      // { name: 'Antigravity', level: 78, years: 3 },
      { name: 'Git / GitHub', level: 77, years: 5 },
      { name: 'VS Code', level: 99, years: 5 },
      { name: 'Postman', level: 62, years: 4 },
      { name: 'AI', level: 85, years: 3 },
    ],
  },
]

// ─── Testimonials ─────────────────────────────────────
const testimonialsData = [
  {
    text: 'Mixzy Devs built a platform that honours our culinary heritage while making online ordering effortless. Our customers can browse menus and place orders with confidence on any device.',
    author: 'Jecinta Ugochukwu', role: 'Founder, JauFoods', initials: 'JU',
    rating: 5, isApproved: true, featured: true, order: 1,
  },
  {
    text: 'They captured our vision from the first wireframe. The storefront is fast, bold, and gives our streetwear community a digital home that matches the energy of We Are Not Thugs.',
    author: 'Rector Pasca', role: 'Founder, We Are Not Thugs', initials: 'RP',
    rating: 5, isApproved: true, featured: true, order: 2,
  },
  {
    text: 'Detobanis needed a presence as refined as our craftsmanship. The experience is elegant, performant, and positions our flagship collections beautifully for a global luxury audience.',
    author: 'Omotosho Babatunde Israel', role: 'Founder, Detobanis', initials: 'OI',
    rating: 5, isApproved: true, featured: true, order: 3,
  },
]

// ─── Projects ─────────────────────────────────────────
const projectsData = [
  {
    title: 'Jau Foods', slug: 'jau-foods', category: 'fullstack',
    tags: ['E-Commerce', 'Food & Beverage'],
    description:
      'Full-stack e-commerce platform for JauFoods—honouring Nigerian culinary heritage with streamlined online ordering and mobile-first checkout.',
    longDescription:
      'Built for Jecinta Ugochukwu and the JauFoods brand, this platform highlights signature menus, seasonal offerings, and a frictionless ordering experience.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    image: '/projects/jaufoods.png',
    gallery: ['/projects/jaufoods.png'],
    liveUrl: 'https://jaufoods.com.ng',
    githubUrl: 'https://github.com/jaufoods',
    featured: true, order: 1,
    features: [
      'Story-driven menu showcasing tradition and innovation',
      'Optimized online ordering and checkout',
      'Mobile-first UX for repeat customers',
      'Inventory-aware product availability',
      'Analytics dashboard for order growth tracking',
    ],
    challenges:
      'Balancing rich food storytelling with fast load times and a checkout flow optimised for mobile networks.',
    gradient: 'from-[#1a2a1a] to-[#2d4a2d]',
    status: 'published',
  },
  {
    title: 'We Are Not Thugs', slug: 'we-are-not-thugs', category: 'fullstack',
    tags: ['Streetwear', 'E-Commerce'],
    description:
      'Streetwear e-commerce and brand platform for We Are Not Thugs—bold storytelling, limited-drop merchandising, and a fast immersive storefront.',
    longDescription:
      'Developed for founder Rector Pasca, this site challenges stereotypes through editorial content, campaign galleries, and culture-driven commerce.',
    tech: ['React', 'CSS', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    image: '/projects/wearenotthugs.png',
    gallery: ['/projects/wearenotthugs.png'],
    liveUrl: 'https://wearenotthugs.com',
    githubUrl: 'https://github.com/wearenotthugs',
    featured: true, order: 2,
    features: [
      'High-impact lookbook and campaign galleries',
      'Streetwear e-commerce with drop-style merchandising',
      'Bold typography and motion-led brand storytelling',
      'Community-driven content sections',
      'Performance-optimized media delivery',
    ],
    challenges:
      'Translating disruptive street culture into a premium digital experience without sacrificing speed.',
    gradient: 'from-primary-deep to-primary',
    status: 'published',
  },
  {
    title: 'Detobanis', slug: 'detobanis-com', category: 'fullstack',
    tags: ['Luxury', 'Fashion'],
    description:
      'Luxury fashion e-commerce for Detobanis—editorial lookbooks, flagship collections, and a refined purchase journey for a global audience.',
    longDescription:
      'Built for Omotosho Babatunde Israel and the Detobanis house, the platform showcases tailoring, flagship pieces, and premium product storytelling.',
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    image: '/projects/detobanis.png',
    gallery: ['/projects/detobanis.png'],
    liveUrl: 'https://detobanis.com',
    featured: true, order: 3,
    features: [
      'Luxury lookbook and flagship collection highlights',
      'Influencer-ready product presentation',
      'Premium checkout and brand storytelling',
      'SEO-optimized collection pages',
      'Scalable CMS-ready architecture',
    ],
    challenges:
      'Balancing opulent visual design with elite performance standards.',
    gradient: 'from-[#0f2847] to-[#1a3a5c]',
    status: 'published',
  },
]

// ─── Blog Posts ────────────────────────────────────────
const blogData = [
  {
    title: 'React Best Practices: Building High-Performance Components',
    slug: 'react-best-practices-2025',
    excerpt: 'Master advanced React patterns including memoization, code splitting, and custom hooks to build performant applications that scale effortlessly.',
    category: 'React',
    tags: ['React', 'Performance', 'JavaScript', 'Tutorial'],
    readTime: '10 min',
    date: '2025-05-18',
    image: '/blog/react-best.jpg',
    status: 'published',
    content: '# React Best Practices\n\nContent here...',
  },
  {
    title: 'Node.js Optimization: Building Fast Backend APIs',
    slug: 'nodejs-optimization-guide',
    excerpt: 'Actionable strategies for optimizing Node.js servers, including caching, connection pooling, and efficient middleware patterns.',
    category: 'Backend',
    tags: ['Node.js', 'Performance', 'Express', 'Best Practices'],
    readTime: '9 min',
    date: '2025-05-15',
    image: '/blog/nodejs-opt.jpg',
    status: 'published',
    content: '# Node.js Optimization\n\nContent here...',
  },
  {
    title: 'Integrating AI APIs: Practical Examples with OpenAI & Claude',
    slug: 'ai-integration-practical',
    excerpt: 'Learn how to integrate AI models into your applications with real-world examples using OpenAI, Anthropic Claude, and practical error handling.',
    category: 'AI',
    tags: ['AI', 'OpenAI', 'API Integration', 'Tutorial'],
    readTime: '11 min',
    date: '2025-05-12',
    image: '/blog/ai-integration.jpg',
    status: 'published',
    content: '# AI Integration\n\nContent here...',
  },
  {
    title: 'Building RESTful APIs with Express.js: Complete Tutorial',
    slug: 'express-rest-api-tutorial',
    excerpt: 'Step-by-step guide to creating production-ready REST APIs using Express, MongoDB, authentication, and validation patterns.',
    category: 'Backend',
    tags: ['Express.js', 'REST API', 'Node.js', 'Tutorial'],
    readTime: '13 min',
    date: '2025-05-10',
    image: '/blog/express-tutorial.jpg',
    status: 'published',
    content: '# Express.js Tutorial\n\nContent here...',
  },
  {
    title: 'Advanced Tailwind CSS Patterns for Modern Web Apps',
    slug: 'tailwind-advanced-patterns',
    excerpt: 'Master Tailwind CSS with advanced techniques including custom components, animations, and responsive patterns for pixel-perfect designs.',
    category: 'Design',
    tags: ['Tailwind CSS', 'CSS', 'Frontend', 'Design System'],
    readTime: '8 min',
    date: '2025-05-08',
    image: '/blog/tailwind-advanced.jpg',
    status: 'published',
    content: '# Tailwind CSS\n\nContent here...',
  },
  {
    title: 'Full-Stack Application Deployment: From Local to Production',
    slug: 'full-stack-deployment-guide',
    excerpt: 'Complete guide to deploying full-stack applications on Vercel, AWS, and DigitalOcean with CI/CD, monitoring, and scaling strategies.',
    category: 'DevOps',
    tags: ['Deployment', 'DevOps', 'Cloud', 'Docker'],
    readTime: '14 min',
    date: '2025-05-05',
    image: '/blog/deployment-guide.jpg',
    status: 'published',
    content: '# Deployment Guide\n\nContent here...',
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  // ─── Services
  const serviceCount = await Service.countDocuments()
  if (serviceCount === 0) {
    await Service.insertMany(servicesData)
    console.log(`✅ Seeded ${servicesData.length} services`)
  } else {
    console.log(`⏭️  Services already exist (${serviceCount}), skipping`)
  }

  // ─── Skills
  const skillCount = await Skill.countDocuments()
  if (skillCount === 0) {
    await Skill.insertMany(skillsData)
    console.log(`✅ Seeded ${skillsData.length} skill categories`)
  } else {
    console.log(`⏭️  Skills already exist (${skillCount}), skipping`)
  }

  // ─── Testimonials
  const testimonialCount = await Testimonial.countDocuments()
  if (testimonialCount === 0) {
    await Testimonial.insertMany(testimonialsData)
    console.log(`✅ Seeded ${testimonialsData.length} testimonials`)
  } else {
    console.log(`⏭️  Testimonials already exist (${testimonialCount}), skipping`)
  }

  // ─── Projects
  const projectCount = await Project.countDocuments()
  if (projectCount === 0) {
    await Project.insertMany(projectsData)
    console.log(`✅ Seeded ${projectsData.length} projects`)
  } else {
    console.log(`⏭️  Projects already exist (${projectCount}), skipping`)
  }

  // ─── Blog Posts
  const blogCount = await Blog.countDocuments()
  if (blogCount === 0) {
    await Blog.insertMany(blogData)
    console.log(`✅ Seeded ${blogData.length} blog posts`)
  } else {
    console.log(`⏭️  Blog posts already exist (${blogCount}), skipping`)
  }

  console.log('\n🎉 Seed complete!')
  await mongoose.connection.close()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
