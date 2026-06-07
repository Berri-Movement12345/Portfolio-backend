const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Resource not found with id: ${err.value}`
    error.statusCode = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    error.message = `Duplicate value for field: ${field}`
    error.statusCode = 400
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((e) => e.message).join(', ')
    error.statusCode = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token.'
    error.statusCode = 401
  }
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired.'
    error.statusCode = 401
  }

  const statusCode = error.statusCode || err.statusCode || 500

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.path} — ${statusCode}: ${error.message}`)
    if (err.stack) console.error(err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler
