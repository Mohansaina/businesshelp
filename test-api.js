async function testAPI() {
  try {
    const { default: fetch } = await import('node-fetch');
    
    // Test the dashboard stats endpoint (should return 401 without token)
    const response = await fetch('http://localhost:3000/api/dashboard/stats');
    console.log('Dashboard stats endpoint status:', response.status);
    
    if (response.status === 401) {
      console.log('✓ API routes are working correctly - authentication required');
    } else {
      console.log('✗ Unexpected response from API');
    }
    
    // Test user registration
    const registerResponse = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log('Registration endpoint status:', registerResponse.status);
    
    if (registerResponse.status === 201) {
      console.log('✓ User registration is working');
      const data = await registerResponse.json();
      console.log('Registration response:', data);
    } else {
      console.log('✗ User registration failed');
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();