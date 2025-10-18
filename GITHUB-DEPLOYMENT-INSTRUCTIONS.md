# GitHub Deployment Instructions

Follow these steps to deploy your AI Review & Reputation Tool to GitHub:

## Prerequisites

1. A GitHub account
2. Git installed on your local machine

## Steps to Deploy to GitHub

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "businesshelp" or "ai-review-tool")
4. Optionally, add a description
5. Keep the repository public (or private if you prefer)
6. **Do NOT initialize the repository with a README**, .gitignore, or license
7. Click "Create repository"

### 2. Connect Your Local Repository to GitHub

Run these commands in your terminal (from the project directory):

```bash
cd c:\Users\svssw\Downloads\akkamarigae
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPOSITORY_NAME` with the name of the repository you just created.

### 3. Verify the Push

After running the commands above, refresh your GitHub repository page. You should now see all your code files in the repository.

## Deploying to Render from GitHub

Once your code is on GitHub, you can easily deploy it to Render:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub account when prompted
4. Select your repository
5. Configure the settings as described in DEPLOYMENT-GUIDE.md
6. Click "Create Web Service"

Your application will automatically deploy and will be available at the URL provided by Render.

## Auto-Deployment

After the initial deployment, any changes you push to your GitHub repository will automatically trigger a new deployment on Render, thanks to the auto-deploy configuration in render.yaml.