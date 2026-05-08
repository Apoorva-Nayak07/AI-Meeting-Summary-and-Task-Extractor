import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

console.log('═══════════════════════════════════════════════════════');
console.log('🔍 AI MEETING ASSISTANT - DIAGNOSTIC CHECK');
console.log('═══════════════════════════════════════════════════════\n');

let hasErrors = false;

// Check 1: Environment Variables
console.log('📋 Checking Environment Variables...\n');

const requiredEnvVars = {
  'PORT': process.env.PORT,
  'MONGODB_URI': process.env.MONGODB_URI,
  'JWT_SECRET': process.env.JWT_SECRET,
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  'CLIENT_URL': process.env.CLIENT_URL
};

const optionalEnvVars = {
  'EMAIL_USER': process.env.EMAIL_USER,
  'EMAIL_PASS': process.env.EMAIL_PASS
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: Set`);
  } else {
    console.log(`❌ ${key}: Missing (REQUIRED)`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Variables:\n');
Object.entries(optionalEnvVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: Set`);
  } else {
    console.log(`⚠️  ${key}: Missing (Optional - for email features)`);
  }
});

// Check 2: JWT Secret Length
console.log('\n🔐 Checking JWT Secret...\n');
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length >= 32) {
    console.log(`✅ JWT_SECRET length: ${process.env.JWT_SECRET.length} characters (Good)`);
  } else {
    console.log(`⚠️  JWT_SECRET length: ${process.env.JWT_SECRET.length} characters (Recommended: 32+)`);
  }
}

// Check 3: OpenAI API Key Format
console.log('\n🤖 Checking OpenAI API Key...\n');
if (process.env.OPENAI_API_KEY) {
  if (process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.log('✅ OpenAI API Key format: Valid');
  } else {
    console.log('⚠️  OpenAI API Key format: Should start with "sk-"');
  }
}

// Check 4: Uploads Directory
console.log('\n📁 Checking Uploads Directory...\n');
const uploadsDir = './uploads';
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists');
} else {
  console.log('⚠️  Uploads directory missing (will be created automatically)');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  } catch (err) {
    console.log('❌ Failed to create uploads directory:', err.message);
    hasErrors = true;
  }
}

// Check 5: MongoDB Connection
console.log('\n🗄️  Testing MongoDB Connection...\n');

if (process.env.MONGODB_URI) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    console.log(`   Database: ${mongoose.connection.name}`);
    await mongoose.connection.close();
  } catch (err) {
    console.log('❌ MongoDB connection failed!');
    console.log(`   Error: ${err.message}`);
    console.log('\n   Common fixes:');
    console.log('   1. Check connection string format');
    console.log('   2. Verify username and password');
    console.log('   3. Whitelist IP address in MongoDB Atlas');
    console.log('   4. Check internet connection');
    hasErrors = true;
  }
} else {
  console.log('❌ Cannot test MongoDB - MONGODB_URI not set');
  hasErrors = true;
}

// Check 6: Required npm packages
console.log('\n📦 Checking Required Packages...\n');
const requiredPackages = [
  'express',
  'mongoose',
  'jsonwebtoken',
  'bcryptjs',
  'multer',
  'openai',
  'nodemailer',
  'cors',
  'dotenv'
];

let missingPackages = [];
for (const pkg of requiredPackages) {
  try {
    await import(pkg);
    console.log(`✅ ${pkg}`);
  } catch (err) {
    console.log(`❌ ${pkg} - Not installed`);
    missingPackages.push(pkg);
    hasErrors = true;
  }
}

if (missingPackages.length > 0) {
  console.log('\n⚠️  Missing packages detected!');
  console.log('   Run: npm install');
}

// Final Summary
console.log('\n═══════════════════════════════════════════════════════');
if (hasErrors) {
  console.log('❌ DIAGNOSTIC FAILED - Issues found above');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📖 Next Steps:');
  console.log('   1. Fix the issues marked with ❌');
  console.log('   2. Check TROUBLESHOOTING.md for detailed solutions');
  console.log('   3. Run this diagnostic again: node diagnose.js');
  console.log('   4. Once all checks pass, run: npm run dev\n');
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('🚀 Your backend is ready to run!');
  console.log('   Start the server: npm run dev\n');
  process.exit(0);
}
