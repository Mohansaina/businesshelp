// Launch script to start the application and open it in the browser

const { spawn } = require('child_process');
const { openApp } = require('open');

// Start the server
const server = spawn('node', ['server.js'], { stdio: 'inherit' });

console.log('Starting AI Review & Reputation Tool...');
console.log('Server will be available at http://localhost:3000');

// Wait a moment for the server to start, then open the browser
setTimeout(() => {
  openApp('http://localhost:3000')
    .then(() => {
      console.log('Opening browser to http://localhost:3000');
      console.log('Press Ctrl+C to stop the server');
    })
    .catch(err => {
      console.log('Could not automatically open browser. Please visit http://localhost:3000 manually');
      console.log('Press Ctrl+C to stop the server');
    });
}, 2000);

// Handle server exit
server.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.kill();
  process.exit(0);
});