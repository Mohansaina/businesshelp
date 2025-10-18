# Personal Deployment Guide for Mohan Ruttala

## Your AI Review & Reputation Tool Deployment

Hello Mohan! This guide will help you deploy your AI Review & Reputation Tool to Render with minimal effort.

## Your Personalized Deployment Link

Click this link to start your deployment:
[Deploy Your AI Review Tool to Render](https://dashboard.render.com/new?repo=https://github.com/Mohansaina/businesshelp)

## Step-by-Step Deployment Process

### Step 1: Connect to GitHub
1. Click the link above
2. Sign in to Render with your GitHub account
3. Grant Render access to your repositories when prompted

### Step 2: Configure Your Web Service
Render will automatically detect your repository settings. Verify these are correct:
- **Repository**: Mohansaina/businesshelp
- **Branch**: main
- **Environment**: Node
- **Build Command**: npm install
- **Start Command**: npm start

### Step 3: Add Your Personal Environment Variables
In the "Advanced" section, add these environment variables:

| Key | Value | Instructions |
|-----|-------|--------------|
| JWT_SECRET | 8db0a3405278bfc1bc7af80ab1a82b88541a3a813286dab7cc7fa006920c68d0 | Pre-generated for you |
| EMAIL_USER | ruttalamohan23@gmail.com | Your Gmail address |
| EMAIL_PASS | [YOUR_APP_PASSWORD] | See instructions below |
| NODE_ENV | production | Pre-filled |

### Step 4: Generate Your Gmail App Password
To enable email notifications:

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication if not already enabled
3. Navigate to Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Copy this password (you'll use it as EMAIL_PASS)

### Step 5: Complete Deployment
1. Click "Create Web Service"
2. Wait 2-5 minutes for deployment to complete
3. Your application URL will appear at the top of the dashboard

## What You'll Get After Deployment

✅ **Full User Authentication**
- Registration with email verification
- Secure login/logout
- Password hashing with bcrypt

✅ **Database Functionality**
- User accounts stored securely
- Business profiles management
- Review storage with analytics

✅ **AI Features**
- Sentiment analysis of customer reviews
- AI-generated response suggestions
- Customer happiness scoring

✅ **Email Notifications**
- Welcome emails for new users
- Review notifications
- Admin alerts

✅ **Complete Dashboard**
- Real-time analytics
- Review management
- Business performance metrics

## Post-Deployment Steps

### 1. Test Your Application
1. Visit your new URL
2. Register a new account
3. Log in and create a business profile
4. Add a sample review to test AI features

### 2. (Optional) Add OpenAI API Key
For real AI features instead of simulations:
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it as OPENAI_API_KEY in Render environment variables
3. Restart your service

### 3. Set Up Custom Domain (Optional)
1. In Render dashboard, go to your service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Follow instructions to add your domain

## Troubleshooting

### If Your App Doesn't Start
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Ensure your Gmail app password is correct

### Email Issues
1. Double-check your app password
2. Verify 2-factor authentication is enabled
3. Check spam folder for test emails

### Database Problems
The application uses SQLite which works fine for Render deployments. If you experience issues:
1. Check logs for database errors
2. Restart the service from Render dashboard

## Support

If you encounter any issues:
1. Check the logs in your Render dashboard
2. Review this guide
3. Contact support through Render's website

Your application will be available at a URL like:
`https://ai-review-tool-xyz123.onrender.com`

(Your actual URL will be provided after deployment)