#!/usr/bin/env node
/**
 * Rate Limit Configuration Checker
 * Shows current rate limit settings
 */

require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV || 'development'

console.log('═══════════════════════════════════════════════════════')
console.log('🔍 RATE LIMIT CONFIGURATION CHECK')
console.log('═══════════════════════════════════════════════════════\n')

console.log('📋 Current Environment:', NODE_ENV.toUpperCase())
console.log()

console.log('🔐 AUTH RATE LIMITER SETTINGS:')
console.log('─────────────────────────────────────────────────────')
console.log(`Environment: ${NODE_ENV}`)
console.log(`Window: 5 minutes`)
console.log(`Max Attempts: ${NODE_ENV === 'development' ? '1000' : '50'}`)
console.log(`Skip Successful Requests: YES ✅`)
console.log(`Skip Failed Requests: NO ❌`)
console.log(`Localhost Bypass: ${NODE_ENV === 'development' ? 'YES ✅' : 'NO ❌'}`)
console.log()

console.log('📊 GENERAL API LIMITER SETTINGS:')
console.log('─────────────────────────────────────────────────────')
console.log(`Window: 15 minutes`)
console.log(`Max Requests: 200`)
console.log(`Localhost Bypass: ${NODE_ENV === 'development' ? 'YES ✅' : 'NO ❌'}`)
console.log()

console.log('💡 WHAT THIS MEANS:')
console.log('─────────────────────────────────────────────────────')
if (NODE_ENV === 'development') {
  console.log('✅ You can make 1000 login attempts per 5 minutes')
  console.log('✅ Localhost requests bypass rate limiting')
  console.log('✅ Successful logins do NOT count toward limit')
  console.log('✅ Only failed login attempts are counted')
  console.log('✅ Rate limits reset every 5 minutes')
} else {
  console.log('⚠️  Production mode: 50 login attempts per 5 minutes')
  console.log('⚠️  No localhost bypass in production')
  console.log('✅ Successful logins do NOT count toward limit')
  console.log('✅ Only failed login attempts are counted')
}
console.log()

console.log('🔄 TO RESET RATE LIMITS:')
console.log('─────────────────────────────────────────────────────')
console.log('1. Stop the backend server (Ctrl+C)')
console.log('2. Start the server again: npm start')
console.log('3. All rate limits will be cleared')
console.log()

console.log('🐛 IF YOU STILL GET "TOO MANY ATTEMPTS":')
console.log('─────────────────────────────────────────────────────')
console.log('1. Check browser console for duplicate requests')
console.log('2. Look for "[LOGIN] Submission blocked" messages')
console.log('3. Check Network tab for multiple /auth/login requests')
console.log('4. Clear browser cache and localStorage')
console.log('5. Restart both frontend and backend')
console.log()

console.log('🔧 TEMPORARY DISABLE (DEV ONLY):')
console.log('─────────────────────────────────────────────────────')
console.log('Edit backend/server.js line ~280:')
console.log('// app.use(\'/api/auth\', authLimiter, authRoutes)')
console.log('app.use(\'/api/auth\', authRoutes) // No limiter')
console.log()

console.log('✅ Configuration check complete!')
console.log('═══════════════════════════════════════════════════════')
