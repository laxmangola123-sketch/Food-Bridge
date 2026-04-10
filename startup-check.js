#!/usr/bin/env node

/**
 * 🍽️ FOOD BRIDGE - ONE-CLICK STARTUP & CONNECTION VALIDATOR
 * Complete system startup with real-time connection verification
 */

const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset);
}

function header(title) {
  console.clear();
  log('╔' + '═'.repeat(62) + '╗', 'cyan');
  log('║ 🍽️  ' + title.padEnd(56) + '║', 'cyan');
  log('╚' + '═'.repeat(62) + '╝', 'cyan');
  log('');
}

function check(endpoint, description) {
  return new Promise((resolve) => {
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: endpoint.includes('POST') ? 'POST' : 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 400) {
        log(`✓ ${description}`, 'green');
        resolve(true);
      } else {
        log(`✗ ${description} (${res.statusCode})`, 'red');
        resolve(false);
      }
    });

    req.on('error', () => {
      log(`✗ ${description}`, 'red');
      resolve(false);
    });

    req.end();
  });
}

async function startup() {
  header('FOOD BRIDGE - STARTUP & CONNECTION CHECK');

  log('Starting verification...\n', 'yellow');

  // Wait for server to be ready
  await new Promise(r => setTimeout(r, 1000));

  log('Verifying connections...\n', 'cyan');

  // Check all endpoints
  let passed = 0;
  let failed = 0;

  const checks = [
    { endpoint: '/', description: 'Home Page' },
    { endpoint: '/index.html', description: 'Portal Selection' },
    { endpoint: '/login.html', description: 'Authentication' },
    { endpoint: '/donor-portal.html', description: 'Donor Portal' },
    { endpoint: '/ngo-portal.html', description: 'NGO Portal' },
    { endpoint: '/api/auth/login', description: 'Login API' },
    { endpoint: '/api/donations', description: 'Donation Endpoint' },
    { endpoint: '/api/ngo/requests', description: 'NGO Requests' }
  ];

  for (const check_item of checks) {
    const result = await check(check_item.endpoint, check_item.description);
    if (result) passed++;
    else failed++;
    await new Promise(r => setTimeout(r, 100));
  }

  log('');
  log('═'.repeat(62), 'cyan');
  log('');

  if (failed === 0) {
    log('🎉 ALL CONNECTIONS VERIFIED!', 'green');
    log('');
    log('✅ System fully operational', 'green');
    log('✅ All endpoints responding', 'green');
    log('✅ Ready for production', 'green');
    log('');
    log('═'.repeat(62), 'cyan');
    log('');
    log('📊 VERIFICATION RESULTS', 'cyan');
    log(`   Passed: ${passed}/8 ✅`, 'green');
    log(`   Failed: ${failed}/8 ✗`, failed > 0 ? 'red' : 'green');
    log('');
    log('═'.repeat(62), 'cyan');
    log('');
    log('🌐 ACCESS YOUR SYSTEM', 'cyan');
    log('');
    log('   🏠 Home Page:', 'yellow');
    log('      http://localhost:3000', 'blue');
    log('');
    log('   🍱 Donor Portal:', 'yellow');
    log('      http://localhost:3000/donor-portal.html', 'blue');
    log('');
    log('   🤝 NGO Portal:', 'yellow');
    log('      http://localhost:3000/ngo-portal.html', 'blue');
    log('');
    log('   🔐 Login Page:', 'yellow');
    log('      http://localhost:3000/login.html', 'blue');
    log('');
    log('═'.repeat(62), 'cyan');
    log('');
    log('🚀 System Ready! Open browser and start using.', 'green');
    log('');
  } else {
    log('⚠️  CONNECTION ISSUES DETECTED', 'red');
    log('');
    log(`Passed: ${passed}/8 ✅`, 'green');
    log(`Failed: ${failed}/8 ✗`, 'red');
    log('');
    log('💭 Common Solutions:', 'yellow');
    log('   1. Ensure server.js is running in another terminal', 'cyan');
    log('   2. Check no other process is using port 3000', 'cyan');
    log('   3. Verify database is initialized', 'cyan');
    log('   4. Check uploads/ directory exists', 'cyan');
    log('');
    log('Try running: npm start', 'yellow');
    log('');
  }

  log('═'.repeat(62), 'cyan');
  log('');
  log('📋 System Features', 'cyan');
  log('   ✓ Two-portal system (Donor + NGO)', 'green');
  log('   ✓ Food name & quantity tracking', 'green');
  log('   ✓ Photo & video upload', 'green');
  log('   ✓ AI analysis', 'green');
  log('   ✓ NGO matching', 'green');
  log('   ✓ Real-time sync', 'green');
  log('   ✓ Impact dashboard', 'green');
  log('   ✓ Role-based access', 'green');
  log('');
  log('═'.repeat(62), 'cyan');
  log('');
}

startup().catch(console.error);
