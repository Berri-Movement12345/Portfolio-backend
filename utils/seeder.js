require('dotenv').config()
const mongoose = require('mongoose')
const { User, Project, Skill, Service, Testimonial, Blog } = require('../models')

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected to MongoDB for seeding')
}

// ─── Seed Data ────────────────────────────────────────

const users = [
  {
    name: 'Mixzy',
    email: process.env.ADMIN_EMAIL || 'godswillm23456@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'Jackman123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'User@123456',
    role: 'user',
  },
]

const projects = [
  {
    title: 'Jau Foods',
    slug: 'jau-foods',
    category: 'fullstack',
    tags: ['E-Commerce', 'Food & Beverage'],
    description:
      'Full-stack e-commerce platform for JauFoods—honouring Nigerian culinary heritage with streamlined online ordering and mobile-first checkout.',
    longDescription:
      'Built for Jecinta Ugochukwu and the JauFoods brand, this platform highlights signature menus, seasonal offerings, and a frictionless ordering experience tuned for mobile-first customers.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    image: '/projects/jaufoods.png',
    gallery: ['/projects/jaufoods.png'],
    liveUrl: 'https://jaufoods.com.ng',
    githubUrl: 'https://github.com/jaufoods',
    featured: true,
    order: 1,
    status: 'published',
    features: [
      'Story-driven menu showcasing tradition and innovation',
      'Optimized online ordering and checkout',
      'Mobile-first UX for repeat customers',
      'Inventory-aware product availability',
      'Analytics dashboard for order growth tracking',
    ],
    challenges:
      'Balancing rich food storytelling with fast load times and a checkout flow optimised for repeat customers on mobile networks.',
    gradient: 'from-[#1a2a1a] to-[#2d4a2d]',
  },
  {
    title: 'We Are Not Thugs',
    slug: 'we-are-not-thugs',
    category: 'fullstack',
    tags: ['Streetwear', 'E-Commerce'],
    description:
      'Streetwear e-commerce and brand platform for We Are Not Thugs—bold storytelling, limited-drop merchandising, and a fast immersive storefront.',
    longDescription:
      'Developed for founder Rector Pasca, this site challenges stereotypes through editorial content, campaign galleries, and commerce built for a culture-driven streetwear audience.',
    tech: ['React', 'CSS', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    image: '/projects/wearenotthugs.png',
    gallery: ['/projects/wearenotthugs.png'],
    liveUrl: 'https://wearenotthugs.com',
    githubUrl: 'https://github.com/wearenotthugs',
    featured: true,
    order: 2,
    status: 'published',
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
  },
  {
    title: 'Detobanis',
    slug: 'detobanis-com',
    category: 'fullstack',
    tags: ['Luxury', 'Fashion'],
    description:
      'Luxury fashion e-commerce for Detobanis—editorial lookbooks, flagship collections, and a refined purchase journey for a global audience.',
    longDescription:
      'Built for Omotosho Babatunde Israel and the Detobanis house, the platform showcases tailoring, flagship pieces, and premium product storytelling.',
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    image: '/projects/detobanis.png',
    gallery: ['/projects/detobanis.png'],
    liveUrl: 'https://detobanis.com',
    featured: true,
    order: 3,
    status: 'published',
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
  },
]

const skills = [
  {
    category: 'Frontend',
    icon: '⬡',
    order: 1,
    skills: [
      { name: 'React', level: 72, years: 3 },
      { name: 'CSS / Vanilla CSS', level: 63, years: 3 },
      { name: 'Tailwind CSS', level: 52, years: 2 },
      { name: 'JavaScript (ES6+)', level: 75, years: 3 },
      { name: 'Responsive Web Design', level: 70, years: 3 },
    ],
  },
  {
    category: 'Backend',
    icon: '◈',
    order: 2,
    skills: [
      { name: 'Node.js', level: 73, years: 3 },
      { name: 'Express', level: 62, years: 3 },
      { name: 'MongoDB / Mongoose', level: 82, years: 3 },
      { name: 'REST API Design', level: 62, years: 3 },
    ],
  },
  {
    category: 'Design & Tools',
    icon: '❋',
    order: 3,
    skills: [
      { name: 'Git / GitHub', level: 77, years: 5 },
      { name: 'VS Code', level: 99, years: 5 },
      { name: 'Postman', level: 62, years: 4 },
    ],
  },
]

const services = [
  {
    num: '01',
    icon: '⬡',
    title: 'Full Stack Development',
    description: 'End-to-end web applications built with modern React frontends and scalable Node.js backends, designed for performance and growth.',
    features: ['React / Tailwind CSS', 'Node.js APIs', 'Database design', 'Authentication'],
    price: 'From ₦3,000',
    order: 1,
    isActive: true,
  },
  {
    num: '02',
    icon: '◊',
    title: 'UI/UX Design & Dev',
    description: 'Pixel-perfect interfaces with smooth animations, thoughtful micro-interactions, and accessible design systems that delight users.',
    features: ['Figma prototypes', 'Design systems', 'Motion design', 'Accessibility'],
    price: 'From ₦1,500',
    order: 2,
    isActive: true,
  },
  {
    num: '03',
    icon: '◈',
    title: 'API Development',
    description: 'RESTful APIs engineered for reliability, security, and scalability with comprehensive documentation.',
    features: ['REST APIs', 'Auth & security', 'Rate limiting', 'Documentation'],
    price: 'From ₦1,200',
    order: 3,
    isActive: true,
  },
  {
    num: '04',
    icon: '❋',
    title: 'E-Commerce Solutions',
    description: 'Custom shopping experiences with seamless payment integrations, inventory management, and conversion-optimized flows.',
    features: ['Stripe / PayPal', 'Inventory system', 'Analytics', 'Multi-currency'],
    price: 'From ₦2,500',
    order: 4,
    isActive: false,
  },
  {
    num: '05',
    icon: '◎',
    title: 'Performance Optimization',
    description: 'Comprehensive audits and optimizations to achieve elite Core Web Vitals, faster load times, and better SEO rankings.',
    features: ['Lighthouse audit', 'Bundle analysis', 'CDN setup', 'Caching strategy'],
    price: 'From ₦800',
    order: 5,
    isActive: false,
  },
  {
    num: '06',
    icon: '⊹',
    title: 'Technical Consulting',
    description: 'Strategic guidance on architecture decisions, technology selection, code quality, and scaling strategies for your product.',
    features: ['Architecture review', 'Tech stack advice', 'Code review', 'Team training'],
    price: '₦150/hour',
    order: 6,
    isActive: false,
  },
]

const testimonials = [
  {
    text: 'Mixzy Devs built a platform that honours our culinary heritage while making online ordering effortless. Our customers can browse menus and place orders with confidence on any device.',
    author: 'Jecinta Ugochukwu',
    role: 'Founder, JauFoods',
    initials: 'JU',
    rating: 5,
    isApproved: true,
    featured: true,
    order: 1,
  },
  {
    text: 'They captured our vision from the first wireframe. The storefront is fast, bold, and gives our streetwear community a digital home that matches the energy of We Are Not Thugs.',
    author: 'Rector Pasca',
    role: 'Founder, We Are Not Thugs',
    initials: 'RP',
    rating: 5,
    isApproved: true,
    featured: true,
    order: 2,
  },
  {
    text: 'Detobanis needed a presence as refined as our craftsmanship. The experience is elegant, performant, and positions our flagship collections beautifully for a global luxury audience.',
    author: 'Omotosho Babatunde Israel',
    role: 'Founder, Detobanis',
    initials: 'OI',
    rating: 5,
    isApproved: true,
    featured: true,
    order: 3,
  },
]

const blogPosts = [
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
    content: `# React Best Practices: Building High-Performance Components

## Why Performance Matters

React applications can easily become sluggish without proper optimization. Whether you're managing complex state or rendering large lists, performance bottlenecks can dramatically impact user experience.

## 1. Use React.memo for Component Memoization

\`\`\`jsx
const UserCard = React.memo(({ user }) => {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
    </div>
  )
})
\`\`\`

React.memo prevents unnecessary re-renders when props haven't changed. This is especially powerful for list items and frequently-rendered components.

## 2. Implement useCallback to Stabilize Function References

\`\`\`jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, []) // Dependencies ensure function identity stability
  
  return <ChildComponent onButtonClick={handleClick} />
}
\`\`\`

## 3. Code Splitting with React.lazy

\`\`\`jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
\`\`\`

Lazy loading reduces initial bundle size by loading components only when needed.

## 4. Virtualization for Large Lists

For lists with hundreds of items, use virtualization libraries like react-window:

\`\`\`jsx
import { FixedSizeList } from 'react-window'

const Row = ({ index, style, data }) => (
  <div style={style}>{data[index].name}</div>
)

<FixedSizeList height={600} itemCount={1000} itemSize={35}>
  {Row}
</FixedSizeList>
\`\`\`

## Key Takeaways

- Always profile your app using React DevTools Profiler
- Use dependency arrays correctly in hooks
- Implement code splitting for route-based chunks
- Monitor bundle size with tools like bundle-analyzer

Performance isn't a one-time optimization—it's an ongoing practice.`,
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
    content: `# Node.js Optimization: Building Fast Backend APIs

## The Challenge

As your Node.js application grows, request handling becomes your biggest bottleneck. Every millisecond counts when serving thousands of concurrent users.

## 1. Implement Connection Pooling

\`\`\`js
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

app.get('/users/:id', (req, res) => {
  pool.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err })
    res.json(results[0])
  })
})
\`\`\`

## 2. Leverage Redis Caching

\`\`\`js
const redis = require('redis')
const client = redis.createClient()

app.get('/api/posts/:id', async (req, res) => {
  const cacheKey = \`post:\${req.params.id}\`
  
  // Check cache first
  const cached = await client.get(cacheKey)
  if (cached) return res.json(JSON.parse(cached))
  
  // Query database if not cached
  const post = await Post.findById(req.params.id)
  await client.setEx(cacheKey, 3600, JSON.stringify(post)) // 1 hour TTL
  res.json(post)
})
\`\`\`

## 3. Use Compression Middleware

\`\`\`js
const compression = require('compression')
app.use(compression())
\`\`\`

This automatically compresses response bodies, reducing payload size by 60-70%.

## 4. Implement Clustering for Multi-Core Systems

\`\`\`js
const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) {
  const numCPUs = os.cpus().length
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  app.listen(3000, () => console.log('Worker running'))
}
\`\`\`

## 5. Stream Large Data Instead of Loading in Memory

\`\`\`js
app.get('/download/large-file', (req, res) => {
  const stream = fs.createReadStream('large-file.zip')
  stream.pipe(res)
})
\`\`\`

## Monitoring Tools

- **PM2**: Process manager for production Node.js
- **New Relic**: Real-time performance monitoring
- **Clinic.js**: Node.js performance profiler

## Quick Wins

1. Enable HTTP/2 for faster multiplexing
2. Use async/await properly to avoid blocking operations
3. Profile memory with --inspect flag
4. Set appropriate timeouts on database queries

Optimization is iterative—measure, optimize, and measure again.`,
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
    content: `# Integrating AI APIs: Practical Examples with OpenAI & Claude

## Why AI Integration Matters

AI capabilities can transform user experiences—from intelligent chatbots to content generation. Integrating these APIs is straightforward once you understand the patterns.

## 1. Basic OpenAI Integration

\`\`\`js
const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateBlogTitle(topic) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a creative writer.' },
      { role: 'user', content: \`Generate 5 blog titles about \${topic}\` },
    ],
    temperature: 0.7,
  })
  return response.choices[0].message.content
}
\`\`\`

## 2. Streaming Responses for Real-Time UX

\`\`\`js
app.post('/api/stream-response', async (req, res) => {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: req.body.messages,
    stream: true,
  })
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    res.write(content)
  }
  res.end()
})
\`\`\`

## 3. Image Generation with Error Handling

\`\`\`js
async function generateProjectImage(description) {
  try {
    const image = await openai.images.generate({
      prompt: description,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    })
    
    return {
      success: true,
      url: image.data[0].url,
    }
  } catch (error) {
    if (error.status === 429) {
      return { success: false, message: 'Rate limit exceeded. Try again later.' }
    }
    throw error
  }
}
\`\`\`

## 4. Implementing Token Counting

\`\`\`js
const { encoding_for_model } = require('js-tiktoken')

function estimateCost(messages) {
  const enc = encoding_for_model('gpt-4')
  let totalTokens = 0
  
  for (const msg of messages) {
    totalTokens += enc.encode(msg.content).length
  }
  
  const inputCost = totalTokens * 0.00003 // $0.03 per 1K tokens
  return inputCost.toFixed(4)
}
\`\`\`

## 5. Using Claude API from Anthropic

\`\`\`js
const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic()

async function analyzeCode(code) {
  const response = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: \`Review this code for best practices:\n\n\${code}\`,
      },
    ],
  })
  
  return response.content[0].text
}
\`\`\`

## Best Practices

1. **Rate Limiting**: Cache responses and implement backoff strategies
2. **Error Handling**: Always catch API errors and retry intelligently
3. **Token Optimization**: Track token usage to control costs
4. **Security**: Store API keys in environment variables, never commit them
5. **Streaming**: Use streaming for long-running operations to improve UX

## Cost Optimization Tips

- Cache similar queries and reuse responses
- Use cheaper models (GPT-3.5) when full capability isn't needed
- Implement token limits to prevent runaway costs
- Monitor usage with API dashboard analytics

AI integration is easier than you think—start small and scale gradually.`,
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
    content: `# Building RESTful APIs with Express.js: Complete Tutorial

## Project Setup

\`\`\`bash
npm init -y
npm install express mongoose dotenv cors helmet
npm install --save-dev nodemon
\`\`\`

## 1. Create Your Express Server

\`\`\`js
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(helmet())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

app.listen(3000, () => console.log('Server running on port 3000'))
\`\`\`

## 2. Define Your Models

\`\`\`js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)
module.exports = User
\`\`\`

## 3. Create Routes with CRUD Operations

\`\`\`js
const express = require('express')
const router = express.Router()
const User = require('../models/User')

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// CREATE user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
\`\`\`

## 4. Implement Authentication with JWT

\`\`\`js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ success: true, token })
})

// Middleware to verify token
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'No token' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
\`\`\`

## 5. Input Validation

\`\`\`js
const { body, validationResult } = require('express-validator')

router.post('/', [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  
  // Proceed with user creation
})
\`\`\`

## Testing Your API

Use Postman or Thunder Client to test endpoints:

1. **Test without auth**: GET /api/users
2. **Test with auth**: Include \`Authorization: Bearer YOUR_TOKEN\` header
3. **Test validation**: POST invalid data and check error responses

## Production Checklist

✅ Use environment variables for sensitive data
✅ Implement proper error handling
✅ Add request logging with Morgan
✅ Use rate limiting to prevent abuse
✅ Set up CORS properly
✅ Validate all inputs
✅ Use HTTPS in production

Your Express API is now production-ready!`,
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
    content: `# Advanced Tailwind CSS Patterns for Modern Web Apps

## 1. Creating Reusable Component Patterns

\`\`\`jsx
// Button variants
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'bg-transparent border-2 border-gray-300 hover:bg-gray-100',
}

function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={\`px-4 py-2 rounded-lg transition-all \${buttonVariants[variant]}\`} {...props}>
      {children}
    </button>
  )
}
\`\`\`

## 2. Custom Tailwind Configuration

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0f4c5c',
          900: '#0a2e3c',
        },
      },
      spacing: {
        'section': '5rem',
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
}
\`\`\`

## 3. Responsive Image Gallery

\`\`\`jsx
function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((img, i) => (
        <div key={i} className="relative group overflow-hidden rounded-lg">
          <img 
            src={img} 
            alt="gallery" 
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="px-4 py-2 bg-white text-black rounded">View</button>
          </div>
        </div>
      ))}
    </div>
  )
}
\`\`\`

## 4. Dark Mode Implementation

\`\`\`jsx
// Enable in tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])
  
  return (
    <button 
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
\`\`\`

## 5. Form Styling Best Practices

\`\`\`jsx
function Form({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          type="email" 
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="you@example.com"
        />
      </div>
      
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
        Submit
      </button>
    </form>
  )
}
\`\`\`

## Performance Tips

1. Use \`@apply\` directive for component styles
2. Purge unused CSS in production
3. Use JIT (Just-In-Time) mode for rapid development
4. Leverage built-in responsive prefixes (sm:, md:, lg:, xl:)
5. Minimize custom CSS—use Tailwind utilities first

Start building faster with Tailwind CSS!`,
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
    content: `# Full-Stack Application Deployment: From Local to Production

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Build process verified locally
- [ ] Error logging configured
- [ ] Performance benchmarks established
- [ ] Security headers set
- [ ] SSL/TLS certificate ready

## 1. Dockerize Your Application

\`\`\`dockerfile
# Dockerfile for Node.js backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
\`\`\`

## 2. Docker Compose for Local Development

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/app
      - NODE_ENV=development
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
\`\`\`

## 3. GitHub Actions CI/CD Pipeline

\`\`\`.github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build -t myapp:latest .
          docker tag myapp:latest myregistry/myapp:latest
          docker push myregistry/myapp:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.DEPLOY_HOST }}
          username: \${{ secrets.DEPLOY_USER }}
          key: \${{ secrets.DEPLOY_KEY }}
          script: |
            docker pull myregistry/myapp:latest
            docker-compose up -d
\`\`\`

## 4. Environment Configuration

\`\`\`bash
# .env.production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/app
JWT_SECRET=your-secret-key
API_URL=https://api.example.com
FRONTEND_URL=https://example.com
\`\`\`

## 5. SSL/TLS with Let's Encrypt

\`\`\`bash
# Using Certbot
sudo certbot certonly --standalone -d example.com
sudo certbot renew --dry-run
\`\`\`

## 6. Nginx Reverse Proxy Configuration

\`\`\`nginx
server {
  listen 443 ssl;
  server_name example.com;
  
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
  
  location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
  }
  
  location / {
    proxy_pass http://localhost:5173;
  }
}
\`\`\`

## 7. Monitoring and Logging

\`\`\`js
// Using PM2 with monitoring
const pm2 = require('pm2')

pm2.connect(err => {
  if (err) {
    console.error(err)
    process.exit(2)
  }
  
  pm2.start({
    script: 'server.js',
    name: 'api-server',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' },
  }, (err) => {
    if (err) console.error(err)
  })
})
\`\`\`

## 8. Database Backups

\`\`\`bash
#!/bin/bash
# Backup MongoDB daily
BACKUP_DIR="/backups"
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)

mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/app" --out \$BACKUP_DIR/\$TIMESTAMP

# Keep only last 30 days
find \$BACKUP_DIR -type d -mtime +30 -exec rm -rf {} +
\`\`\`

## 9. Performance Monitoring

Setup tracking with tools like:
- **DataDog**: Real-time application performance
- **New Relic**: Full-stack observability
- **Sentry**: Error tracking and reporting

## 10. Scaling Strategies

1. **Horizontal Scaling**: Add more servers behind a load balancer
2. **Vertical Scaling**: Increase server resources
3. **Caching**: Implement Redis for frequently accessed data
4. **CDN**: Use CloudFlare or AWS CloudFront for static content
5. **Microservices**: Split functionality into independent services

## Security Best Practices

✅ Use HTTPS everywhere
✅ Implement rate limiting
✅ Validate all inputs
✅ Keep dependencies updated
✅ Use security headers (CSP, X-Frame-Options)
✅ Regular security audits
✅ Implement logging and monitoring

Your application is now production-ready!`,
  },
]

// ─── Seed Function ────────────────────────────────────
const seed = async () => {
  try {
    await connectDB()

    // Clear existing data
    console.log('\n🗑  Clearing existing data...')
    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      Skill.deleteMany(),
      Service.deleteMany(),
      Testimonial.deleteMany(),
      Blog.deleteMany(),
    ])

    // Insert fresh data
    console.log('🌱 Seeding users...')
    const createdUsers = await User.create(users)
    const adminUser = createdUsers.find((u) => u.role === 'admin')

    console.log('🌱 Seeding projects...')
    await Project.create(projects)

    console.log('🌱 Seeding skills...')
    await Skill.create(skills)

    console.log('🌱 Seeding services...')
    await Service.create(services)

    console.log('🌱 Seeding testimonials...')
    await Testimonial.create(testimonials)

    console.log('🌱 Seeding blog posts...')
    await Blog.create(blogPosts.map((p) => ({ ...p, author: adminUser._id })))

    console.log('\n✅ Database seeded successfully!')
    console.log(`\n📋 Admin credentials:`)
    console.log(`   Email:    ${adminUser.email}`)
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Jackman123'}`)
    console.log('\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error.message)
    process.exit(1)
  }
}

// ─── Destroy Function ─────────────────────────────────
const destroy = async () => {
  try {
    await connectDB()
    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      Skill.deleteMany(),
      Service.deleteMany(),
      Testimonial.deleteMany(),
      Blog.deleteMany(),
    ])
    console.log('✅ All data destroyed.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Destroy error:', error.message)
    process.exit(1)
  }
}

// Run based on flag: `node seeder.js -d` to destroy
if (require.main === module) {
  if (process.argv[2] === '-d') {
    destroy()
  } else {
    seed()
  }
}

module.exports = { projects, testimonials }
