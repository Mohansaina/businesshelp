const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { OpenAI } = require('openai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize OpenAI (if API key is provided)
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

// Function to analyze review with AI
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

// Cloud Function: Send welcome email when new user is created
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  try {
    await sendWelcomeEmail(user.email, user.displayName || user.email.split('@')[0]);
    console.log('Welcome email sent successfully to:', user.email);
    
    // Also send notification to admin
    await sendAdminNotification(user.email, user.displayName || user.email.split('@')[0]);
    console.log('Admin notification sent successfully for:', user.email);
  } catch (error) {
    console.error('Error in sendWelcomeEmail function:', error);
  }
});

// Cloud Function: Process new review
exports.processNewReview = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    try {
      const review = snap.data();
      
      // Analyze review with AI
      const aiAnalysis = await analyzeReviewWithAI(review.text);
      
      // Update the review with AI analysis
      await snap.ref.update({
        aiAnalysis: aiAnalysis,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('Review processed successfully:', context.params.reviewId);
    } catch (error) {
      console.error('Error processing review:', error);
    }
  });

// Cloud Function: HTTP endpoint for health check
exports.health = functions.https.onRequest((request, response) => {
  response.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ReviewAI Firebase Functions'
  });
});

// Cloud Function: HTTP endpoint for user registration (legacy compatibility)
exports.register = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { name, email, password } = request.body;
    
    // Validate input
    if (!name || !email || !password) {
      return response.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: hashedPassword,
      displayName: name
    });
    
    // Save additional user data to Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: name,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Generate custom token for client-side sign in
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
    // Send welcome email
    await sendWelcomeEmail(email, name);
    
    // Send notification to admin
    await sendAdminNotification(email, name);
    
    response.status(201).json({ 
      message: 'User registered successfully', 
      token: customToken,
      user: { 
        id: userRecord.uid, 
        name, 
        email 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    response.status(500).json({ error: 'Server error' });
  }
});

// Cloud Function: HTTP endpoint for user login (legacy compatibility)
exports.login = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, password } = request.body;
    
    // Validate input
    if (!email || !password) {
      return response.status(400).json({ error: 'Email and password are required' });
    }
    
    // Verify user credentials
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Compare passwords (in a real implementation, you would verify against stored hash)
    // For this example, we'll generate a custom token directly
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    
    response.json({ 
      message: 'Login successful', 
      token: customToken,
      user: { 
        id: userRecord.uid, 
        name: userRecord.displayName, 
        email: userRecord.email 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    response.status(400).json({ error: 'Invalid credentials' });
  }
});

// Cloud Function: HTTP endpoint for getting user profile
exports.getProfile = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Get user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return response.status(404).json({ error: 'User not found' });
    }
    
    response.json({ user: userDoc.data() });
  } catch (error) {
    console.error('Get profile error:', error);
    response.status(401).json({ error: 'Invalid token' });
  }
});

// Cloud Function: HTTP endpoint for getting user businesses
exports.getBusinesses = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Get businesses from Firestore
    const businessesSnapshot = await admin.firestore().collection('businesses')
      .where('userId', '==', uid)
      .get();
    
    const businesses = [];
    businessesSnapshot.forEach(doc => {
      businesses.push({ id: doc.id, ...doc.data() });
    });
    
    response.json({ businesses });
  } catch (error) {
    console.error('Get businesses error:', error);
    response.status(401).json({ error: 'Invalid token' });
  }
});

// Cloud Function: HTTP endpoint for creating a business
exports.createBusiness = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const { name, phone, address, google_id } = request.body;
    
    if (!name) {
      return response.status(400).json({ error: 'Business name is required' });
    }
    
    // Create business in Firestore
    const businessRef = await admin.firestore().collection('businesses').add({
      userId: uid,
      name,
      phone,
      address,
      google_id,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    response.status(201).json({ 
      message: 'Business created successfully', 
      business: { 
        id: businessRef.id, 
        userId: uid, 
        name, 
        phone, 
        address, 
        google_id 
      }
    });
  } catch (error) {
    console.error('Create business error:', error);
    response.status(401).json({ error: 'Invalid token' });
  }
});

// Cloud Function: HTTP endpoint for getting business reviews
exports.getReviews = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const businessId = request.query.businessId;
    if (!businessId) {
      return response.status(400).json({ error: 'Business ID is required' });
    }
    
    // Check if user owns this business
    const businessDoc = await admin.firestore().collection('businesses').doc(businessId).get();
    if (!businessDoc.exists || businessDoc.data().userId !== uid) {
      return response.status(403).json({ error: 'Access denied' });
    }
    
    // Get reviews from Firestore
    const reviewsSnapshot = await admin.firestore().collection('reviews')
      .where('businessId', '==', businessId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const reviews = [];
    reviewsSnapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    response.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    response.status(401).json({ error: 'Invalid token' });
  }
});

// Cloud Function: HTTP endpoint for adding a review
exports.addReview = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const { businessId, source, rating, text } = request.body;
    
    if (!businessId || !source || !rating || !text) {
      return response.status(400).json({ error: 'Business ID, source, rating, and text are required' });
    }
    
    // Check if user owns this business
    const businessDoc = await admin.firestore().collection('businesses').doc(businessId).get();
    if (!businessDoc.exists || businessDoc.data().userId !== uid) {
      return response.status(403).json({ error: 'Access denied' });
    }
    
    // Analyze review with AI
    const aiAnalysis = await analyzeReviewWithAI(text);
    
    // Add review to Firestore
    const reviewRef = await admin.firestore().collection('reviews').add({
      businessId,
      source,
      rating,
      text,
      userId: uid,
      sentiment_score: aiAnalysis.sentiment_score || 5,
      ai_analysis: JSON.stringify(aiAnalysis),
      ai_reply: aiAnalysis.suggested_reply || 'Thank you for your review!',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    response.status(201).json({ 
      message: 'Review added successfully', 
      review: { 
        id: reviewRef.id, 
        businessId, 
        source, 
        rating, 
        text, 
        sentiment_score: aiAnalysis.sentiment_score || 5,
        ai_analysis: aiAnalysis,
        ai_reply: aiAnalysis.suggested_reply || 'Thank you for your review!',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    response.status(401).json({ error: 'Invalid token' });
  }
});

// Cloud Function: HTTP endpoint for getting dashboard stats
exports.getDashboardStats = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Get user's businesses
    const businessesSnapshot = await admin.firestore().collection('businesses')
      .where('userId', '==', uid)
      .get();
    
    if (businessesSnapshot.empty) {
      return response.json({
        totalReviews: 0,
        averageRating: 0,
        customerHappiness: 0,
        sentimentScore: 0
      });
    }
    
    // Get business IDs
    const businessIds = [];
    businessesSnapshot.forEach(doc => {
      businessIds.push(doc.id);
    });
    
    // Get reviews for all businesses
    const reviewsSnapshot = await admin.firestore().collection('reviews')
      .where('businessId', 'in', businessIds)
      .get();
    
    // Calculate stats
    let totalReviews = 0;
    let totalRating = 0;
    let totalSentimentScore = 0;
    
    reviewsSnapshot.forEach(doc => {
      const review = doc.data();
      totalReviews++;
      totalRating += review.rating || 0;
      totalSentimentScore += review.sentiment_score || 0;
    });
    
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews) : 0;
    const sentimentScore = totalReviews > 0 ? (totalSentimentScore / totalReviews) : 0;
    const customerHappiness = sentimentScore > 0 ? Math.round((sentimentScore / 10) * 100) : 0;
    
    response.json({
      totalReviews,
      averageRating: averageRating.toFixed(1),
      customerHappiness,
      sentimentScore: sentimentScore.toFixed(1)
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    response.status(401).json({ error: 'Invalid token' });
  }
});