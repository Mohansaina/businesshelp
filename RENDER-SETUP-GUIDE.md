# Render Deployment Setup Guide for AI Review & Reputation Tool

## Overview

This guide will help you deploy your AI Review & Reputation Tool to Render, a cloud platform that supports full-stack applications with backend functionality.

## Prerequisites

1. A Render account (sign up at https://render.com if you don't have one)
2. Your application code on GitHub (already done - https://github.com/Mohansaina/businesshelp)
3. Optional: OpenAI API key for AI features
4. Gmail account for email notifications

## Deploying to Render

### Step 1: Connect Render to GitHub

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "Login" and sign in with your GitHub account
3. Grant Render the necessary permissions when prompted

### Step 2: Create a New Web Service

1. In the Render dashboard, click the "New" button
2. Select "Web Service" from the dropdown menu

### Step 3: Configure Your Web Service

1. **Connect GitHub Repository**:
   - Under "GitHub", select your repository: `Mohansaina/businesshelp`
   - Click "Connect"

2. **Basic Settings**:
   - **Name**: ai-review-tool (or any name you prefer)
   - **Region**: Choose the one closest to your users
   - **Branch**: main
   - **Root Directory**: Leave empty (your app is in the root directory)
   - **Environment**: Node

3. **Build & Deploy Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Instance Settings**:
   - **Instance Type**: Free (you can upgrade later if needed)

### Step 4: Configure Environment Variables

In the "Advanced" section, add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| JWT_SECRET | [Generate a random string] | Used for signing authentication tokens |
| EMAIL_USER | ruttalamohan23@gmail.com | Your Gmail address |
| EMAIL_PASS | your_app_password | Gmail app password (not regular password) |
| OPENAI_API_KEY | your_openai_key | Optional, AI features will be simulated if not provided |
| NODE_ENV | production | Sets the application environment |

#### How to Generate a JWT Secret

You can generate a random JWT secret using this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

#### How to Set Up Gmail for Email Notifications

1. Enable 2-factor authentication on your Google account
2. Generate an app password:
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Use this app password as your EMAIL_PASS

### Step 5: Deploy Your Application

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Run `npm install` to install dependencies
   - Start your application with `npm start`
3. Wait for the deployment to complete (this may take a few minutes)

### Step 6: Access Your Application

1. Once deployment is complete, you'll see a URL like: `https://ai-review-tool-xyz123.onrender.com`
2. Click on this URL to access your application
3. Test the functionality:
   - Register a new user account
   - Log in to the dashboard
   - Set up a business profile
   - Add sample reviews to see the AI analysis

## Auto-Deployment

Your application is configured for auto-deployment. Any changes you push to the `main` branch of your GitHub repository will automatically trigger a new deployment on Render.

To make changes:
1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. Render will automatically detect the changes and redeploy

## Monitoring and Logs

1. In your Render dashboard, click on your service
2. Use the "Logs" tab to monitor your application's output
3. Check for any errors or issues in the logs
4. The "Metrics" tab shows resource usage

## Scaling and Performance

### Free Tier Limitations

The free tier has some limitations:
- Your service will spin down after 15 minutes of inactivity
- Limited resources (512MB RAM, shared CPU)
- No custom domains (available with paid plans)

### Upgrading to Paid Plans

To remove limitations:
1. Go to your service dashboard
2. Click "Settings"
3. Select "Plan"
4. Choose a paid plan that fits your needs

## Troubleshooting Common Issues

### Application Won't Start

1. Check the logs for error messages
2. Verify all required environment variables are set
3. Ensure the build process completed successfully

### Database Issues

The application uses SQLite which stores data in a file. For production use with multiple instances, consider:
1. Migrating to PostgreSQL
2. Using Render's managed database service

### Email Configuration Problems

1. Ensure you're using an app password, not your regular Gmail password
2. Verify 2-factor authentication is enabled
3. Check that the Gmail account allows less secure apps (if using regular password)

### AI Features Not Working

1. If you didn't provide an OpenAI API key, AI features will be simulated
2. If you provided a key but features aren't working, check:
   - The API key is correct
   - You have credits in your OpenAI account
   - Your firewall isn't blocking requests to OpenAI

## Next Steps

1. Customize the application for your specific business needs
2. Add your branding and styling
3. Integrate with review platforms (Google, Yelp, etc.)
4. Set up custom domains (with paid Render plans)
5. Monitor usage and performance
6. Add more features as required

## Support

If you encounter issues:
1. Check the Render documentation: https://render.com/docs
2. Look at the application logs for error messages
3. Review this deployment guide
4. Open an issue on your GitHub repository if you find a bug in the code