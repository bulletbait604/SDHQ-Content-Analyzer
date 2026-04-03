#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build environment...');

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'OPENAI_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing environment variables:', missingEnvVars.join(', '));
  console.log('   These may be needed for full functionality, but build will continue...');
}

// Check for required directories
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'public'
];

const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

if (missingDirs.length > 0) {
  console.error('❌ Missing required directories:', missingDirs.join(', '));
  process.exit(1);
}

// Check for required files
const requiredFiles = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'package.json',
  'next.config.ts'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles.join(', '));
  process.exit(1);
}

// Check TypeScript configuration
if (!fs.existsSync('tsconfig.json')) {
  console.warn('⚠️  TypeScript configuration not found');
}

console.log('✅ Build validation passed!');
process.exit(0);
