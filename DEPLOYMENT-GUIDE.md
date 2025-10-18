# Production Deployment Guide

This guide will help you deploy the AI Review & Reputation Tool to production for real market use.

## 🚀 Deployment Options

### 1. Render (Recommended for Node.js version)
- Platform: [https://render.com](https://render.com)
- Type: Full-stack Node.js deployment
- Database: SQLite (file-based) or PostgreSQL
- Domain: Custom domain support
- SSL: Automatic HTTPS

### 2. Firebase (Recommended for scalable version)
- Platform: [https://firebase.google.com](https://firebase.google.com)
- Type: Serverless with Firebase services
- Database: Firestore
- Hosting: Firebase Hosting
- Authentication: Firebase Auth

### 3. Heroku
- Platform: [https://heroku.com](https://heroku.com)
- Type: PaaS deployment
- Database: PostgreSQL addon
- Domain: Custom domain support

## 📋 Production Requirements

### System Requirements
- Node.js v14 or higher
- npm v6 or higher
- Git for version control
- Domain name (optional but recommended)

### Environment Variables
Create a `.env.production` file with:

```bash
# Server Configuration
PORT=80
NODE_ENV=production

# Security
JWT_SECRET=your_secure_jwt_secret_here
COOKIE_SECRET=your_secure_cookie_secret_here

# Database (if using PostgreSQL)
DATABASE_URL=your_database_connection_string

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Integration
OPENAI_API_KEY=your_openai_api_key

# Payment Processing
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Social Logins
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🔧 Render Deployment Steps

### 1. Prepare for Render Deployment

Create a `render.yaml` file:

```yaml
services:
  - type: web
    name: reviewai
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        sync: false
      - key: EMAIL_USER
        sync: false
      - key: EMAIL_PASS
        sync: false
```

### 2. Update package.json

```json
{
  "name": "ai-review-reputation-tool",
  "version": "1.0.0",
  "description": "A micro-SaaS for local businesses to manage reviews and reputation with AI",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'Build completed'",
    "postinstall": "npm run build"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "node-fetch": "^3.3.2",
    "nodemailer": "^6.9.7",
    "openai": "^4.20.0",
    "sqlite3": "^5.1.6"
  }
}
```

### 3. Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New+" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: reviewai
   - Region: Choose closest to your users
   - Branch: main
   - Root Directory: /
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in the dashboard
7. Click "Create Web Service"

## 🔥 Firebase Deployment Steps

### 1. Set up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable services:
   - Authentication (Email/Password, Google, GitHub)
   - Cloud Firestore
   - Cloud Functions
   - Hosting

### 2. Configure Firebase

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "runtime": "nodejs18"
  }
}
```

### 3. Deploy Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy
firebase deploy
```

## 🛡️ Security Considerations

### 1. Environment Variables
Never commit sensitive information to version control:
- Use environment variables for all secrets
- Use Render/Firebase dashboard to set secrets

### 2. HTTPS
- Render and Firebase provide automatic HTTPS
- Always use HTTPS in production

### 3. CORS
Update CORS settings in `server.js`:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 4. Rate Limiting
Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## 📊 Monitoring and Analytics

### 1. Error Tracking
- Sentry: `npm install @sentry/node @sentry/tracing`
- LogRocket for frontend session replay

### 2. Performance Monitoring
- Render provides built-in metrics
- Google Analytics for frontend

### 3. Uptime Monitoring
- UptimeRobot
- Better Uptime

## 💰 Payment Integration

### Stripe Integration

1. Install Stripe:
```bash
npm install stripe
```

2. Add to server.js:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create checkout session
app.post('/api/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: req.user.id,
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📈 Marketing and SEO

### 1. SEO Optimization
- Add meta tags to HTML files
- Create a sitemap.xml
- Add robots.txt

### 2. Social Media Integration
- Open Graph tags for social sharing
- Twitter Cards

### 3. Email Marketing
- Mailchimp or ConvertKit integration
- Welcome email series

## 🆘 Support and Maintenance

### 1. Documentation
- User guides
- API documentation
- FAQ section

### 2. Customer Support
- Help desk (Zendesk, Freshdesk)
- Live chat (Crisp, Intercom)
- Contact form

### 3. Updates and Maintenance
- Semantic versioning
- Changelog
- Backup strategy

## 🚨 Common Issues and Solutions

### 1. Database Connection
- Use connection pooling for PostgreSQL
- Implement retry logic

### 2. Email Deliverability
- Use verified sender addresses
- Monitor spam complaints

### 3. Performance
- Implement caching (Redis)
- Optimize database queries
- Use CDN for static assets

## 📞 Next Steps

1. Choose your deployment platform
2. Set up environment variables
3. Configure domain and SSL
4. Test thoroughly
5. Launch to production
6. Monitor and iterate

For any issues, please open an issue on the GitHub repository or contact the development team.

# Deployment Guide

This guide will help you deploy the AI Review & Reputation Tool to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free tier available)
3. A Gmail account for email notifications (optional)
4. An OpenAI API key for AI features (optional)

## Deploying to Render

### Step 1: Fork the Repository

1. Go to your GitHub account
2. Fork this repository to your account

### Step 2: Create a Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub account when prompted
4. Select your forked repository
5. Configure the following settings:
   - **Name**: ai-review-tool (or any name you prefer)
   - **Region**: Choose the region closest to you
   - **Branch**: main
   - **Root Directory**: Leave empty
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select a paid plan for production)

### Step 3: Configure Environment Variables

In the "Environment Variables" section, add the following variables:

1. `JWT_SECRET` - Generate a strong secret key for JWT token signing
2. `EMAIL_USER` - Your Gmail address (for sending welcome emails)
3. `EMAIL_PASS` - Your Gmail app password (not your regular password)
4. `OPENAI_API_KEY` - Your OpenAI API key (optional, for AI features)

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying your application
3. Wait for the deployment to complete (this may take a few minutes)
4. Once deployed, you'll see your application URL in the Render dashboard

### Step 5: Configure Gmail for Email Notifications (Optional)

To enable email notifications:

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to your Google Account settings
   - Navigate to Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"
   - Use this app password as your `EMAIL_PASS` environment variable

### Step 6: Configure OpenAI for AI Features (Optional)

To enable AI features:

1. Sign up for an OpenAI account at [platform.openai.com](https://platform.openai.com/)
2. Create an API key
3. Add the API key as the `OPENAI_API_KEY` environment variable in Render

## Auto-Deployment

This application is configured for auto-deployment. Any changes pushed to the main branch of your GitHub repository will automatically trigger a new deployment on Render.

## Health Checks

Render will automatically check the `/health` endpoint to ensure your application is running properly.

## Troubleshooting

### Common Issues

1. **Deployment fails**: Check the build logs in Render for specific error messages
2. **Application crashes**: Check the application logs in Render
3. **Emails not sending**: Verify your Gmail credentials and app password
4. **AI features not working**: Ensure your OpenAI API key is valid and has sufficient credits

### Support

For additional help, please open an issue on the GitHub repository.