// ============================================
// Backend API Response Tester
// ============================================
// Use this in browser console to test your backend response

// Test Login API and check role field
async function testLoginAPI() {
  const apiUrl = 'https://backend.pmums.com/api/auth/login'; // Update with your backend URL
  
  const testCredentials = {
    username: 'admin', // Change to your test username
    password: 'admin123' // Change to your test password
  };

  console.log('🔄 Testing login API...');
  console.log('URL:', apiUrl);
  console.log('Credentials:', testCredentials);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });

    console.log('📡 Response Status:', response.status);
    
    const data = await response.json();
    console.log('📦 Full Response:', data);
    
    // Extract user data
    const userData = data.user || data.data?.user || data;
    console.log('👤 User Data:', userData);
    
    // Check for role field
    const role = userData?.role || userData?.roles;
    console.log('🎭 Role Field:', role);
    
    if (role) {
      console.log('✅ SUCCESS: Role field found!');
      console.log('   Role value:', role);
      console.log('   Role type:', typeof role);
      if (Array.isArray(role)) {
        console.log('   Roles array:', role);
      }
    } else {
      console.log('❌ ERROR: Role field NOT found in response!');
      console.log('   Available fields:', Object.keys(userData));
      console.log('   👉 You need to add role field to backend response');
    }
    
    // Check token
    const token = data.token || data.data?.token || data.accessToken;
    if (token) {
      console.log('🔐 Token:', token.substring(0, 50) + '...');
    } else {
      console.log('⚠️  WARNING: No token found');
    }
    
    return {
      success: true,
      hasRole: !!role,
      role: role,
      userData: userData,
      fullResponse: data
    };
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('   Make sure:');
    console.log('   1. Backend is running');
    console.log('   2. URL is correct');
    console.log('   3. CORS is configured');
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
console.log('='.repeat(50));
console.log('🧪 BACKEND ROLE AUTHENTICATION TEST');
console.log('='.repeat(50));
testLoginAPI();

// Instructions:
console.log(`
📋 INSTRUCTIONS:
1. Open browser console (F12)
2. Paste this entire script
3. Update the apiUrl, username, and password
4. Press Enter to run
5. Check the output for role field

✅ If you see "Role field found" - You're good to go!
❌ If you see "Role field NOT found" - Update your backend to include role
`);
