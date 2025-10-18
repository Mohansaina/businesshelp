# Integration Plan

## Overview

This document outlines the integration points for third-party services in the AI Review & Reputation Tool.

## 1. Authentication Integration

### Supabase Auth

**Implementation Plan:**
1. Install Supabase JavaScript client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Initialize Supabase client in `public/js/auth.js`:
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_ANON_KEY
   )
   ```

3. Replace mock authentication with Supabase calls:
   ```javascript
   // Signup
   const { user, error } = await supabase.auth.signUp({
     email: email,
     password: password
   })
   
   // Login
   const { user, error } = await supabase.auth.signIn({
     email: email,
     password: password
   })
   ```

### Qoder Auth

**Implementation Plan:**
1. Follow Qoder documentation for client initialization
2. Replace mock authentication functions with Qoder SDK calls
3. Implement role-based access control using Qoder user metadata

## 2. AI Integration (OpenAI)

### Sentiment Analysis & Auto-Replies

**Implementation Plan:**
1. Install OpenAI package:
   ```bash
   npm install openai
   ```

2. Create backend endpoint in `server.js`:
   ```javascript
   const { Configuration, OpenAIApi } = require("openai");
   
   const configuration = new Configuration({
     apiKey: process.env.OPENAI_API_KEY,
   });
   const openai = new OpenAIApi(configuration);
   
   app.post('/api/analyze-review', async (req, res) => {
     const { reviewText } = req.body;
     
     try {
       const response = await openai.createCompletion({
         model: "text-davinci-003",
         prompt: `Analyze the sentiment of this review and provide a sentiment score (0-10) and suggested reply:\n\n${reviewText}`,
         max_tokens: 150
       });
       
       res.json(response.data.choices[0].text);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

3. Call from frontend in `public/js/dashboard.js`:
   ```javascript
   async function analyzeReview(reviewText) {
     const response = await fetch('/api/analyze-review', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ reviewText })
     });
     
     return await response.json();
   }
   ```

## 3. Notification Integration

### Gmail API

**Implementation Plan:**
1. Set up Google Cloud Project with Gmail API enabled
2. Create OAuth2 credentials
3. Implement email sending in backend:
   ```javascript
   const { google } = require('googleapis');
   
   const sendEmail = async (to, subject, body) => {
     const oauth2Client = new google.auth.OAuth2(
       process.env.GOOGLE_CLIENT_ID,
       process.env.GOOGLE_CLIENT_SECRET,
       process.env.GOOGLE_REDIRECT_URI
     );
     
     oauth2Client.setCredentials({
       refresh_token: process.env.GOOGLE_REFRESH_TOKEN
     });
     
     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
     
     const raw = Buffer.from(
       `To: ${to}\r\n` +
       `Subject: ${subject}\r\n\r\n` +
       `${body}`
     ).toString("base64");
     
     await gmail.users.messages.send({
       userId: 'me',
       requestBody: {
         raw: raw.replace(/\+/g, '-').replace(/\//g, '_')
       }
     });
   };
   ```

### Twilio (WhatsApp)

**Implementation Plan:**
1. Install Twilio package:
   ```bash
   npm install twilio
   ```

2. Implement WhatsApp messaging in backend:
   ```javascript
   const twilio = require('twilio');
   
   const client = twilio(
     process.env.TWILIO_ACCOUNT_SID,
     process.env.TWILIO_AUTH_TOKEN
   );
   
   const sendWhatsAppMessage = async (to, message) => {
     await client.messages.create({
       body: message,
       from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
       to: 'whatsapp:' + to
     });
   };
   ```

## 4. Payment Integration (Stripe)

### Subscription Management

**Implementation Plan:**
1. Install Stripe package:
   ```bash
   npm install stripe
   ```

2. Create subscription endpoint in backend:
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   app.post('/api/create-checkout-session', async (req, res) => {
     const { planId } = req.body;
     
     const session = await stripe.checkout.sessions.create({
       mode: 'subscription',
       payment_method_types: ['card'],
       line_items: [{
         price: planId,
         quantity: 1
       }],
       success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${process.env.DOMAIN}/cancel`
     });
     
     res.json({ sessionId: session.id });
   });
   ```

3. Implement subscription status checking:
   ```javascript
   app.get('/api/subscription-status', async (req, res) => {
     const { userId } = req.query;
     
     // Retrieve subscription status from Stripe
     const subscription = await stripe.subscriptions.retrieve(
       user.subscriptionId
     );
     
     res.json({
       status: subscription.status,
       plan: subscription.items.data[0].price.id
     });
   });
   ```

4. Add frontend integration in `public/js/settings.js`:
   ```javascript
   async function upgradeToAgency() {
     const response = await fetch('/api/create-checkout-session', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ planId: 'agency_plan_price_id' })
     });
     
     const { sessionId } = await response.json();
     
     // Redirect to Stripe Checkout
     const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
     await stripe.redirectToCheckout({ sessionId });
   }
   ```

## 5. Database Integration

### Supabase Database

**Implementation Plan:**
1. Create tables for:
   - Users
   - Businesses
   - Reviews
   - ReviewRequests
   - Analytics
   - Subscriptions

2. Implement data access in backend:
   ```javascript
   // Get user's businesses
   app.get('/api/businesses', async (req, res) => {
     const { userId } = req.query;
     
     const { data, error } = await supabase
       .from('businesses')
       .select('*')
       .eq('user_id', userId);
     
     if (error) {
       res.status(500).json({ error: error.message });
     } else {
       res.json(data);
     }
   });
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google (Gmail)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Domain
DOMAIN=http://localhost:3000
```

## Implementation Priority

1. **Authentication** (High Priority)
   - Essential for user access
   - Required for all other features

2. **Database** (High Priority)
   - Core data storage
   - Required for business information and reviews

3. **AI Integration** (High Priority)
   - Core value proposition
   - Differentiates the product

4. **Payment Integration** (Medium Priority)
   - Required for monetization
   - Can be added after core features

5. **Notification Services** (Medium Priority)
   - Enhances user experience
   - Important but not critical for MVP

## Testing Strategy

1. **Unit Tests**
   - Test authentication functions
   - Test AI analysis functions
   - Test notification sending

2. **Integration Tests**
   - Test complete user flow
   - Test third-party service integrations
   - Test payment processing

3. **End-to-End Tests**
   - Test complete workflows
   - Test error handling
   - Test edge cases

## Security Considerations

1. **API Keys**
   - Store in environment variables
   - Never commit to version control
   - Rotate regularly

2. **User Data**
   - Encrypt sensitive information
   - Implement proper access controls
   - Follow data protection regulations

3. **Authentication**
   - Use secure password hashing
   - Implement rate limiting
   - Use secure session management

4. **Payments**
   - Use Stripe's secure checkout
   - Never store payment information
   - Implement proper webhook validation