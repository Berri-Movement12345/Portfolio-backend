const crypto = require('crypto')
const { User } = require('../models')
const { sendToken, generateToken } = require('../utils/token')
const { sendEmail } = require('../utils/email')

// @desc   Register user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const { name, fullName, email, password, role } = req.body
    const resolvedName = name || fullName

    // Validate input
    if (!email || !password || !resolvedName) {
      console.log('[AUTH] Registration failed — missing required fields')
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })
    }

    if (password.length < 6) {
      console.log('[AUTH] Registration failed — password too short')
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log(`[AUTH] Registration attempt for: ${normalizedEmail}`)

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      console.log(`[AUTH] Registration failed — email already registered: ${normalizedEmail}`)
      return res.status(400).json({ success: false, message: 'Email already registered.' })
    }

    // ✨ AUTO-ASSIGN ADMIN ROLE based on email match
    const adminEmails = [
      process.env.ADMIN_EMAIL?.toLowerCase().trim(),
      'godswillm23456@gmail.com',
      'goswillmm23456@gmail.com'
    ].filter(Boolean)

    const assignedRole = adminEmails.includes(normalizedEmail) ? 'admin' : (role || 'user')
    
    if (assignedRole === 'admin') {
      console.log(`[AUTH] 🔐 Auto-assigning admin role to: ${normalizedEmail}`)
    }

    // Create user
    const user = await User.create({
      name: resolvedName,
      email: normalizedEmail,
      password,
      role: assignedRole,
    })

    console.log(`[AUTH] ✅ New user registered: ${normalizedEmail} (ID: ${user._id}) [${user.role}]`)
    sendToken(user, 201, res)
  } catch (err) {
    console.error('[AUTH] Registration error:', err.message)
    console.error(err.stack)
    return res.status(500).json({ success: false, message: 'Error registering user: ' + err.message })
  }
}

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      console.log('[AUTH] Login failed — missing email or password')
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log(`[AUTH] Login attempt for: ${normalizedEmail}`)

    // Find user with password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password')
    if (!user) {
      console.log(`[AUTH] Login failed — no account found: ${normalizedEmail}`)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    console.log(`[AUTH] User found: ${user.email} [${user.role}]`)

    // Check if account is active
    if (!user.isActive) {
      console.log(`[AUTH] Login blocked — account disabled: ${normalizedEmail}`)
      return res.status(403).json({ success: false, message: 'Account is disabled.' })
    }

    // Verify password
    console.log(`[AUTH] Verifying password for: ${normalizedEmail}`)
    const isMatch = await user.matchPassword(password)
    console.log(`[AUTH] Password match result: ${isMatch}`)

    if (!isMatch) {
      console.log(`[AUTH] Login failed — wrong password: ${normalizedEmail}`)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    // ✨ AUTO-ASSIGN ADMIN ROLE based on email match
    const adminEmails = [
      process.env.ADMIN_EMAIL?.toLowerCase().trim(),
      'godswillm23456@gmail.com',
      'goswillmm23456@gmail.com'
    ].filter(Boolean)

    if (adminEmails.includes(normalizedEmail) && user.role !== 'admin') {
      console.log(`[AUTH] 🔐 Auto-promoting ${normalizedEmail} to admin role`)
      user.role = 'admin'
      await user.save({ validateBeforeSave: false })
    }

    // Update last login
    user.lastLogin = Date.now()
    await user.save({ validateBeforeSave: false })

    console.log(`[AUTH] ✅ Login success: ${normalizedEmail} [${user.role}]`)
    sendToken(user, 200, res)
  } catch (error) {
    console.error('[AUTH] Login error:', error.message)
    console.error(error.stack)
    return res.status(500).json({ success: false, message: 'Login failed due to server error.' })
  }
}

// @desc   Get current user
// @route  GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({ success: true, data: user })
}

// @desc   Logout
// @route  GET /api/auth/logout
// @access Private
exports.logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true })
  res.json({ success: true, message: 'Logged out.' })
}

// @desc   Update password
// @route  PUT /api/auth/update-password
// @access Private
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')

  const isMatch = await user.matchPassword(currentPassword)
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
  }

  user.password = newPassword
  await user.save()
  sendToken(user, 200, res)
}

// @desc   Forgot password
// @route  POST /api/auth/forgot-password
// @access Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account with that email.' })
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 min
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset — Mixzy Portfolio',
      html: `
        <p>You requested a password reset. Click below to set a new password:</p>
        <a href="${resetUrl}" style="background:#0f4c5c;color:#F5F1EA;padding:12px 24px;display:inline-block;text-decoration:none;margin:16px 0;">Reset Password</a>
        <p style="color:#7A8A91;font-size:0.8rem;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
      `,
    })
    res.json({ success: true, message: 'Reset link sent to your email.' })
  } catch {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    return res.status(500).json({ success: false, message: 'Email could not be sent.' })
  }
}

// @desc   Verify reset token
// @route  GET /api/auth/reset-password/:token
// @access Public
exports.verifyResetToken = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' })
  }

  res.json({ success: true, message: 'Reset token is valid.' })
}

// @desc   Reset password
// @route  PUT /api/auth/reset-password/:token
// @access Public
exports.resetPassword = async (req, res) => {
  const { password } = req.body

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
  }

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' })
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  res.json({ success: true, message: 'Password reset successful. You can now sign in.' })
}
