# Render Deployment Guide

This guide will walk you through deploying the AI Review & Reputation Tool to Render, a cloud platform that makes it easy to deploy full-stack web applications.

## 📋 Prerequisites

Before you begin, you'll need:

1. A GitHub account
2. A Render account (free available at [render.com](https://render.com))
3. This repository pushed to GitHub
4. Environment variables ready (JWT_SECRET, EMAIL_USER, EMAIL_PASS, etc.)

## 🚀 Deployment Steps

### Step 1: Fork or Push to GitHub

If you haven't already, push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-review-reputation-tool.git
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up for a free account
3. Verify your email address

### Step 3: Create Web Service

1. Click "New+" → "Web Service"
2. Connect your GitHub account when prompted
3. Select your repository
4. Configure the service:

#### Basic Settings
- **Name**: ai-review-tool
- **Region**: Choose the region closest to your users
- **Branch**: main
- **Root Directory**: / (leave blank)
- **Environment**: Node

#### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Configure Environment Variables

In the "Advanced" section, add these environment variables:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_secure_jwt_secret_here
EMAIL_USER=ruttalamohan23@gmail.com
EMAIL_PASS=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key (optional)
```

To add environment variables:
1. Scroll to the "Advanced" section
2. Click "Add Environment Variable"
3. Add each variable one by one
4. Make sure to mark sensitive variables as "Secret"

### Step 5: Configure Database (Optional but Recommended)

For production use, you might want to use PostgreSQL instead of SQLite:

1. In Render dashboard, click "New+" → "PostgreSQL"
2. Name it "review-tool-db"
3. Choose the free tier
4. After creation, copy the "External Database URL"
5. Add this environment variable to your web service:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

### Step 6: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Run `npm install`
   - Start your application
3. Wait for deployment to complete (usually 2-5 minutes)

### Step 7: Configure Custom Domain (Optional)

1. In your web service dashboard, go to "Settings"
2. Scroll to "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions

## 🔧 Environment Variables

### Required Variables
- `JWT_SECRET`: A secure random string for JWT token signing
- `EMAIL_USER`: Your Gmail address (ruttalamohan23@gmail.com)
- `EMAIL_PASS`: Your Gmail App Password (not regular password)

### Optional Variables
- `OPENAI_API_KEY`: For AI features (get from [OpenAI](https://platform.openai.com))
- `DATABASE_URL`: For PostgreSQL database (if using)

### Generating Secure Secrets

For `JWT_SECRET`, you can generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🌐 Render-Specific Configuration

### Port Configuration

Render uses the PORT environment variable. Our application is configured to use:
- PORT 10000 in production (Render)
- PORT 3000 in development

### Health Check

Render automatically checks if your application is healthy by making requests to the root path (`/`).

### Auto-Deploy

Render can automatically deploy new commits to your GitHub repository:
1. In your web service settings
2. Go to "Deploy"
3. Enable "Auto-Deploy" for the main branch

## 💰 Render Pricing

### Free Tier
- Web Services: 750 free hours per month
- PostgreSQL: 1 free database
- Custom Domains: Supported
- SSL: Automatic HTTPS

### Paid Plans
- **Starter**: $7/month per 1GB RAM
- **Standard**: $35/month per 1GB RAM
- **Pro**: $60/month per 1GB RAM

## 📊 Monitoring and Logs

### View Logs
1. Go to your web service dashboard
2. Click "Logs" tab
3. View real-time application logs

### Metrics
Render provides built-in metrics:
- CPU usage
- Memory usage
- Response times
- Error rates

## 🔄 Continuous Deployment

### GitHub Integration
1. Ensure your GitHub repository is connected
2. Enable auto-deploy for the main branch
3. Every push to main will trigger a new deployment

### Manual Deploy
1. Go to your web service dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

## 🔒 Security Considerations

### Environment Variables
- Store sensitive data as "Secret" environment variables
- Never commit secrets to version control
- Rotate secrets regularly

### HTTPS
- Render provides automatic HTTPS
- All traffic is encrypted by default
- No additional configuration needed

### CORS
Our application is configured to work with Render's domain structure.

## 🆘 Troubleshooting

### Common Issues

#### Application Crashes
- Check logs for error messages
- Verify environment variables are set correctly
- Ensure all required dependencies are in package.json

#### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check if the database service is running
- Ensure proper credentials

#### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS are correct
- Ensure you're using an App Password, not regular password
- Check Gmail security settings

### Support Resources
- Render Documentation: [https://render.com/docs](https://render.com/docs)
- Render Community: [https://community.render.com](https://community.render.com)
- This Repository Issues: [https://github.com/yourusername/ai-review-reputation-tool/issues](https://github.com/yourusername/ai-review-reputation-tool/issues)

## 📈 Scaling

### Manual Scaling
1. Go to your web service dashboard
2. Click "Settings"
3. Adjust "Instance Count" and "Plan"

### Auto Scaling
Render's paid plans include auto-scaling based on traffic.

## 🔄 Backup and Recovery

### Database Backup
If using Render PostgreSQL:
1. Automatic daily backups
2. Point-in-time recovery
3. Manual backup snapshots

### Application Backup
- GitHub repository serves as code backup
- Environment variables stored securely in Render
- Regular git commits recommended

## 📞 Next Steps

1. Complete the deployment process
2. Test your application
3. Configure custom domain (if needed)
4. Set up monitoring alerts
5. Share with your first users

For any issues during deployment, please check the logs in your Render dashboard or open an issue on the GitHub repository.