#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking OAuth structure...');

// Check for OAuth-related files
const oauthFiles = [
  'src/lib/kick-oauth.ts',
  'src/lib/youtube-oauth.ts',
  'src/app/api/auth/kick/callback/route.ts',
  'src/app/auth/youtube/callback/route.ts'
];

const missingFiles = [];
const existingFiles = [];

oauthFiles.forEach(file => {
  if (fs.existsSync(file)) {
    existingFiles.push(file);
    console.log(`✅ Found: ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ Missing: ${file}`);
  }
});

// Check for OAuth configuration
const envVars = [
  'KICK_CLIENT_ID',
  'KICK_CLIENT_SECRET',
  'YOUTUBE_CLIENT_ID',
  'YOUTUBE_CLIENT_SECRET'
];

const missingEnvVars = envVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing OAuth environment variables:', missingEnvVars.join(', '));
} else {
  console.log('✅ OAuth environment variables found');
}

// Summary
console.log('\n📊 OAuth Structure Summary:');
console.log(`   Existing files: ${existingFiles.length}`);
console.log(`   Missing files: ${missingFiles.length}`);

if (missingFiles.length > 0) {
  console.log('\n🔧 To fix missing files:');
  missingFiles.forEach(file => {
    console.log(`   - Create ${file}`);
  });
}

if (missingFiles.length === 0 && missingEnvVars.length === 0) {
  console.log('\n✅ OAuth structure is complete!');
} else {
  console.log('\n⚠️  OAuth structure needs attention');
}

process.exit(0);
