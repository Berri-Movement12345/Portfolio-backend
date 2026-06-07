#!/usr/bin/env node
/**
 * Reset Rate Limiter Script
 * Clears rate limit data for development
 */

console.log('═══════════════════════════════════════════════════════')
console.log('🔄 RATE LIMITER RESET')
console.log('═══════════════════════════════════════════════════════\n')

console.log('ℹ️  Rate limiter uses in-memory storage by default.')
console.log('   Simply restart the server to reset all rate limits.\n')

console.log('📋 Current Rate Limit Configuration:')
console.log('─────────────────────────────────────────────────────')
console.log('General API Limiter:')
console.log('  • Window: 15 minutes')
console.log('  • Max requests: 200')
console.log()
console.log('Auth Limiter:')
console.log('  • Window: 15 minutes')
console.log('  • Max requests: 100 (development) / 20 (production)')
console.log('  • Skip successful requests: YES')
console.log('  • Skip failed requests: NO')
console.log()

console.log('✅ TO RESET RATE LIMITS:')
console.log('─────────────────────────────────────────────────────')
console.log('1. Stop the backend server (Ctrl+C)')
console.log('2. Start the server again: npm start')
console.log('3. All rate limits will be cleared')
console.log()

console.log('💡 TIPS:')
console.log('─────────────────────────────────────────────────────')
console.log('• Development mode allows 100 auth attempts per 15 minutes')
console.log('• Production mode allows 20 auth attempts per 15 minutes')
console.log('• Successful logins do NOT count toward the limit')
console.log('• Only failed attempts are counted')
console.log()

console.log('🔧 IF YOU STILL GET "TOO MANY ATTEMPTS":')
console.log('─────────────────────────────────────────────────────')
console.log('1. Check for infinite loops in frontend code')
console.log('2. Check browser Network tab for repeated requests')
console.log('3. Clear browser cache and localStorage')
console.log('4. Restart both frontend and backend servers')
console.log()

console.log('✅ Rate limiter information displayed successfully!')
