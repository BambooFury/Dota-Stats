#!/usr/bin/env node
/**
 * Build script for Dota Stats Millennium plugin
 * Copies compiled webkit bundle to the correct location
 */

const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', '.millennium', 'Dist', 'webkit.js');
const dest = path.join(__dirname, '..', 'webkit', 'webkit.js');

try {
  // Check if source exists
  if (!fs.existsSync(source)) {
    console.error('❌ Source file not found:', source);
    console.error('   Make sure Millennium has built the webkit bundle first.');
    process.exit(1);
  }

  // Ensure webkit directory exists
  const webkitDir = path.dirname(dest);
  if (!fs.existsSync(webkitDir)) {
    fs.mkdirSync(webkitDir, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(source, dest);
  console.log('✅ Successfully copied webkit bundle:');
  console.log('   From:', source);
  console.log('   To:', dest);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
