# Complete GitHub Setup Guide for Your AI Review & Reputation Tool

This guide will help you push your project to GitHub and deploy it to Render.

## Prerequisites

1. A GitHub account (sign up at https://github.com if you don't have one)
2. Git installed on your local machine (comes with Git Bash on Windows)

## Step-by-Step Instructions

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "businesshelp" or "ai-review-tool")
4. Optionally, add a description
5. Keep the repository public (or private if you prefer)
6. **Do NOT initialize the repository with a README**, .gitignore, or license
7. Click "Create repository"

### 2. Push Your Local Code to GitHub

Open Git Bash or Command Prompt and run these commands from your project directory:

```bash
cd c:\Users\svssw\Downloads\akkamarigae
git add .
git commit -m "Initial commit: AI Review & Reputation Tool"
git branch -M main
git push -u origin main
```

If you get an error about the remote origin already existing, run:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPOSITORY_NAME` with the name of the repository you just created.

### 3. Set Up Environment Variables (Important for Security)

Your project uses sensitive information like API keys and email credentials. These should be set as environment variables on Render rather than committed to GitHub.

Create a `.env.example` file to document what environment variables are needed:

```bash
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OPENAI_API_KEY=your_openai_api_key
```

### 4. Verify the Push

After running the commands above, refresh your GitHub repository page. You should now see all your code files in the repository.

## Deploying to Render from GitHub

Once your code is on GitHub, you can easily deploy it to Render:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub account when prompted
4. Select your repository
5. Configure the settings:
   - Name: ai-review-tool (or any name you prefer)
   - Region: Choose the one closest to you
   - Branch: main
   - Root Directory: Leave empty
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Click "Create Web Service"

## Required Environment Variables on Render

After deployment, you'll need to set these environment variables in your Render dashboard:

1. Go to your Render dashboard
2. Click on your service
3. Go to "Environment" tab
4. Add these variables:
   - `JWT_SECRET` - A random string for signing JWT tokens
   - `EMAIL_USER` - Your Gmail address for sending emails
   - `EMAIL_PASS` - Your Gmail app password (not regular password)
   - `OPENAI_API_KEY` - Your OpenAI API key (optional, AI features will be simulated if not provided)

## Auto-Deployment

After the initial deployment, any changes you push to your GitHub repository will automatically trigger a new deployment on Render, thanks to the auto-deploy configuration in [render.yaml](file:///c%3A/Users/svssw/Downloads/akkamarigae/render.yaml).

## Testing Your Deployment

1. After deployment completes, Render will provide a URL for your application
2. Visit the URL to see your application running
3. Try registering a new user account
4. Log in and explore the dashboard features

## Troubleshooting

### If Your App Doesn't Start

1. Check the logs in Render dashboard for error messages
2. Ensure all required environment variables are set
3. Verify the build process completed successfully

### Database Issues

The application uses SQLite which stores data in a file. For production use, consider migrating to PostgreSQL which Render supports natively.

### Email Configuration

For Gmail to work:
1. Enable 2-factor authentication on your Google account
2. Generate an app password specifically for this application
3. Use the app password instead of your regular Gmail password

## Next Steps

1. Update the documentation in your repository
2. Customize the application for your specific business needs
3. Add more features as required
4. Monitor your application performance on Render