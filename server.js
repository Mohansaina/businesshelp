require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();
// Use Render's PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files - this should come BEFORE API routes
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      google_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER,
      source TEXT,
      rating INTEGER,
      text TEXT,
      sentiment_score REAL,
      ai_analysis TEXT,
      ai_reply TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses (id)
    )`);
    
    console.log('Database tables created successfully');
  }
});

// Initialize OpenAI client (if API key is provided)
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('OpenAI client initialized');
} else {
  console.log('OpenAI API key not found. AI features will be simulated.');
}

// Initialize Email Transporter
let mailTransporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  mailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  console.log('Email transporter initialized');
} else {
  console.log('Email configuration not found. Email features will be simulated.');
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'reviewai_default_secret';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Function to send welcome email to user
async function sendWelcomeEmail(email, name) {
  // If email is not configured, simulate it
  if (!mailTransporter) {
    console.log('=== SIMULATED WELCOME EMAIL ===');
    console.log('To:', email);
    console.log('Subject: Welcome to ReviewAI!');
    console.log('Message:');
    console.log(`Hello ${name || email.split('@')[0]}!

Welcome to ReviewAI! We're excited to have you on board.

Our platform helps you manage your business reputation with AI-powered insights. You can now:
- Track customer reviews from multiple platforms
- Analyze customer sentiment with AI
- Generate smart replies to reviews
- Monitor your reputation metrics in real-time

Get started by setting up your business profile in the dashboard.

Best regards,
The ReviewAI Team`);
    console.log('=== END SIMULATED EMAIL ===');
    return { messageId: 'simulated' };
  }
  
  try {
    const mailOptions = {
      from: `"ReviewAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to ReviewAI!',
      text: `Hello ${name || email.split('@')[0]}!

Welcome to ReviewAI! We're excited to have you on board.

Our platform helps you manage your business reputation with AI-powered insights. You can now:
- Track customer reviews from multiple platforms
- Analyze customer sentiment with AI
- Generate smart replies to reviews
- Monitor your reputation metrics in real-time

Get started by setting up your business profile in the dashboard.

Best regards,
The ReviewAI Team`
    };
    
    const result = await mailTransporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

// Function to send notification to admin when new user signs up
async function sendAdminNotification(newUserEmail, newUserName) {
  // If email is not configured, simulate it
  if (!mailTransporter) {
    console.log('=== SIMULATED ADMIN NOTIFICATION ===');
    console.log('To:', process.env.EMAIL_USER || 'admin@example.com');
    console.log('Subject: New User Registration - ReviewAI');
    console.log('Message:');
    console.log(`Hello Admin,

A new user has registered on ReviewAI:

Name: ${newUserName}
Email: ${newUserEmail}
Registration Time: ${new Date().toISOString()}

Best regards,
ReviewAI System`);
    console.log('=== END SIMULATED ADMIN NOTIFICATION ===');
    return { messageId: 'simulated' };
  }
  
  try {
    const mailOptions = {
      from: `"ReviewAI System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: 'New User Registration - ReviewAI',
      text: `Hello Admin,

A new user has registered on ReviewAI:

Name: ${newUserName}
Email: ${newUserEmail}
Registration Time: ${new Date().toISOString()}

Best regards,
ReviewAI System`
    };
    
    const result = await mailTransporter.sendMail(mailOptions);
    console.log('Admin notification sent for new user:', newUserEmail);
    return result;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

// API Routes

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert user into database
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already registered' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Generate JWT token
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
        
        // Send welcome email to user
        sendWelcomeEmail(email, name).catch(error => {
          console.error('Failed to send welcome email:', error);
        });
        
        // Send notification to admin (ruttalamohan23@gmail.com)
        sendAdminNotification(email, name).catch(error => {
          console.error('Failed to send admin notification:', error);
        });
        
        res.status(201).json({ 
          message: 'User registered successfully', 
          token,
          user: { id: this.lastID, name, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});

// Get User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  });
});

// Get User Businesses
app.get('/api/businesses', authenticateToken, (req, res) => {
  db.all('SELECT * FROM businesses WHERE user_id = ?', [req.user.id], (err, businesses) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ businesses });
  });
});

// Create Business
app.post('/api/businesses', authenticateToken, (req, res) => {
  const { name, phone, address, google_id } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Business name is required' });
  }
  
  db.run(
    'INSERT INTO businesses (user_id, name, phone, address, google_id) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, name, phone, address, google_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.status(201).json({ 
        message: 'Business created successfully', 
        business: { 
          id: this.lastID, 
          user_id: req.user.id, 
          name, 
          phone, 
          address, 
          google_id 
        }
      });
    }
  );
});

// Get Business Reviews
app.get('/api/reviews/:businessId', authenticateToken, (req, res) => {
  const { businessId } = req.params;
  
  // Check if user owns this business
  db.get('SELECT * FROM businesses WHERE id = ? AND user_id = ?', [businessId, req.user.id], (err, business) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!business) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get reviews for this business
    db.all('SELECT * FROM reviews WHERE business_id = ? ORDER BY created_at DESC', [businessId], (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ reviews });
    });
  });
});

// Simulate AI Analysis (would be replaced with real OpenAI calls)
async function analyzeReviewWithAI(reviewText) {
  // In a real implementation, this would call OpenAI API
  // For now, we'll simulate the response
  
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes customer reviews and provides sentiment analysis and suggested replies."
          },
          {
            role: "user",
            content: `Analyze this review and provide a sentiment score (0-10) and a suggested reply:\n\n${reviewText}`
          }
        ],
        max_tokens: 150
      });
      
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
  }
  
  // Simulated response
  const sentiments = [
    "Very negative - Customer is extremely dissatisfied. Immediate attention needed.",
    "Negative - Customer had a poor experience. Consider reaching out to resolve issues.",
    "Neutral - Customer experience was average. Opportunity to exceed expectations.",
    "Positive - Customer had a good experience. Acknowledge and thank them.",
    "Very positive - Customer is extremely satisfied. Great opportunity for testimonials."
  ];
  
  const replies = [
    "We're truly sorry to hear about your experience. We've addressed this with our team and would like to make it right. Please contact us directly.",
    "Thank you for your feedback. We apologize for any inconvenience and are working to improve our service.",
    "Thank you for your feedback. We're always looking for ways to improve and appreciate you taking the time to share your experience.",
    "Thank you for your kind words! We're thrilled to hear you enjoyed our service and look forward to serving you again.",
    "Wow! Thank you so much for your wonderful review. Your kind words made our day and help us continue to provide excellent service!"
  ];
  
  const randomIndex = Math.floor(Math.random() * 5);
  const sentimentScore = Math.floor(Math.random() * 11);
  
  return {
    sentiment_analysis: sentiments[randomIndex],
    suggested_reply: replies[randomIndex],
    sentiment_score: sentimentScore
  };
}

// Add Review with AI Analysis
app.post('/api/reviews', authenticateToken, async (req, res) => {
  const { businessId, source, rating, text } = req.body;
  
  if (!businessId || !source || !rating || !text) {
    return res.status(400).json({ error: 'Business ID, source, rating, and text are required' });
  }
  
  // Check if user owns this business
  db.get('SELECT * FROM businesses WHERE id = ? AND user_id = ?', [businessId, req.user.id], async (err, business) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!business) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Analyze review with AI
    const aiAnalysis = await analyzeReviewWithAI(text);
    
    // Insert review into database
    db.run(
      'INSERT INTO reviews (business_id, source, rating, text, sentiment_score, ai_analysis, ai_reply) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [businessId, source, rating, text, aiAnalysis.sentiment_score || 5, JSON.stringify(aiAnalysis), aiAnalysis.suggested_reply || 'Thank you for your review!'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({ 
          message: 'Review added successfully', 
          review: { 
            id: this.lastID, 
            business_id: businessId, 
            source, 
            rating, 
            text, 
            sentiment_score: aiAnalysis.sentiment_score || 5,
            ai_analysis: aiAnalysis,
            ai_reply: aiAnalysis.suggested_reply || 'Thank you for your review!',
            created_at: new Date().toISOString()
          }
        });
      }
    );
  });
});

// Get Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  // Get user's businesses
  db.all('SELECT id FROM businesses WHERE user_id = ?', [req.user.id], (err, businesses) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (businesses.length === 0) {
      return res.json({
        totalReviews: 0,
        averageRating: 0,
        customerHappiness: 0,
        sentimentScore: 0
      });
    }
    
    const businessIds = businesses.map(b => b.id);
    const placeholders = businessIds.map(() => '?').join(',');
    
    // Get stats
    db.get(`
      SELECT 
        COUNT(*) as totalReviews,
        AVG(rating) as averageRating,
        AVG(sentiment_score) as sentimentScore
      FROM reviews 
      WHERE business_id IN (${placeholders})
    `, businessIds, (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Calculate customer happiness (simplified)
      const customerHappiness = stats.sentimentScore ? Math.round((stats.sentimentScore / 10) * 100) : 0;
      
      res.json({
        totalReviews: stats.totalReviews || 0,
        averageRating: stats.averageRating ? parseFloat(stats.averageRating).toFixed(1) : 0,
        customerHappiness,
        sentimentScore: stats.sentimentScore ? parseFloat(stats.sentimentScore).toFixed(1) : 0
      });
    });
  });
});

// Serve frontend routes - this should be the last route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});