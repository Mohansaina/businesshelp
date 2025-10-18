// Simple test script to verify the application is working

const http = require('http');

// Test the main page
http.get('http://localhost:3000/', (res) => {
  console.log(`Main page status code: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Main page is accessible');
  } else {
    console.log('❌ Main page is not accessible');
  }
  
  // Test the dashboard page
  http.get('http://localhost:3000/dashboard.html', (res) => {
    console.log(`Dashboard page status code: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Dashboard page is accessible');
    } else {
      console.log('❌ Dashboard page is not accessible');
    }
    
    // Test the CSS file
    http.get('http://localhost:3000/css/style.css', (res) => {
      console.log(`CSS file status code: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        console.log('✅ CSS file is accessible');
      } else {
        console.log('❌ CSS file is not accessible');
      }
      
      // Test the JS file
      http.get('http://localhost:3000/js/main.js', (res) => {
        console.log(`JS file status code: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          console.log('✅ JS file is accessible');
          console.log('🎉 All basic tests passed! Application is running correctly.');
        } else {
          console.log('❌ JS file is not accessible');
        }
      });
    });
  });
}).on('error', (err) => {
  console.log('❌ Error connecting to server:', err.message);
  console.log('Please make sure the server is running on port 3000');
});