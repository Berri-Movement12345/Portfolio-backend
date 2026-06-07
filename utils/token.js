const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'mixzy_fallback_secret_2026_change_in_prod'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'mixzy_fallback_refresh_secret_2026_change_in_prod'
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '90d'

/**
 * Generate a signed JWT access token.
 */
exports.generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

/**
 * Generate a refresh token with longer expiry.
 */
exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
  })
}

/**
 * Send token in response body + httpOnly cookie.
 * Response shape: { success, token, refreshToken, user }
 */
exports.sendToken = (user, statusCode, res) => {
  const token = exports.generateToken(user._id, user.role)
  const refreshToken = exports.generateRefreshToken(user._id)

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }

  res.cookie('token', token, cookieOptions)

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  })
}
