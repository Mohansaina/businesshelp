# Render Environment Variables Configuration

When deploying your AI Review & Reputation Tool to Render, you'll need to configure the following environment variables:

## Required Environment Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| JWT_SECRET | 8db0a3405278bfc1bc7af80ab1a82b88541a3a813286dab7cc7fa006920c68d0 | Secret key for JWT token signing |
| NODE_ENV | production | Sets the application environment |
| EMAIL_USER | ruttalamohan23@gmail.com | Gmail address for sending emails |
| EMAIL_PASS | [YOUR_GMAIL_APP_PASSWORD] | Gmail app password (not your regular password) |
| OPENAI_API_KEY | [YOUR_OPENAI_API_KEY] | Optional - for AI features |

## How to Generate a Gmail App Password

1. Enable 2-factor authentication on your Google account
2. Go to your Google Account settings
3. Navigate to Security > 2-Step Verification > App passwords
4. Generate a new app password for "Mail"
5. Copy the generated password and use it as your EMAIL_PASS value

## How to Get an OpenAI API Key (Optional)

1. Go to https://platform.openai.com/
2. Sign up for an account or log in
3. Navigate to API Keys
4. Create a new secret key
5. Copy the key and use it as your OPENAI_API_KEY value

## Configuration in Render Dashboard

1. After creating your web service in Render, go to the "Environment" tab
2. Add each variable using the "Add Environment Variable" button
3. Enter the key and value for each variable
4. Click "Save Changes"
5. Render will automatically redeploy your application with the new environment variables

## Security Notes

- Never commit environment variables to your repository
- The .gitignore file is already configured to exclude .env files
- Render's environment variable system is the secure way to manage secrets
- Regenerate your JWT_SECRET if you believe it has been compromised