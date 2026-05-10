// Quick Backend Test Script
// Run this with: node test-backend.js

const testBackend = async () => {
  console.log('🧪 Testing Backend API...\n');

  const API_URL = 'http://localhost:5000/api';

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Endpoint...');
  try {
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    console.log('⚠️  Backend is not running! Run: npm run dev\n');
    return;
  }

  // Test 2: Register New User
  console.log('\n2️⃣ Testing Registration...');
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'test123456'
  };

  try {
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const registerData = await registerRes.json();
    
    if (registerData.success) {
      console.log('✅ Registration Successful!');
      console.log('   User:', registerData.data.name);
      console.log('   Email:', registerData.data.email);
      console.log('   Token:', registerData.data.token.substring(0, 20) + '...');

      // Test 3: Login
      console.log('\n3️⃣ Testing Login...');
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      const loginData = await loginRes.json();
      
      if (loginData.success) {
        console.log('✅ Login Successful!');
        console.log('   Welcome back:', loginData.data.name);
      } else {
        console.log('❌ Login Failed:', loginData.message);
      }
    } else {
      console.log('❌ Registration Failed:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Test Failed:', error.message);
  }

  console.log('\n✨ Test Complete!\n');
};

testBackend();
