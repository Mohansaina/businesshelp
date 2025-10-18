# Email Setup Instructions

## Gmail Configuration

To send real emails through Gmail, you need to set up an App Password since Gmail has security measures that prevent regular password authentication for third-party apps.

### Steps to Set Up Gmail App Password:

1. **Enable 2-Factor Authentication**:
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - In your Google Account, go to Security → 2-Step Verification → App passwords
   - Select "Mail" as the app and "Windows Computer" (or other appropriate option) as the device
   - Google will generate a 16-character app password

3. **Update .env File**:
   - Replace `your_app_password_here` in the [.env](file:///c:/Users/svssw/Downloads/akkamarigae/.env) file with your actual App Password
   - Example:
     ```
     EMAIL_SERVICE=gmail
     EMAIL_USER=ruttalamohan23@gmail.com
     EMAIL_PASS=abcd efgh ijkl mnop  # Your 16-character App Password
     ```

## Testing Email Functionality

If you don't want to set up Gmail right away, the system will automatically fall back to simulated emails:
- Welcome emails will be logged to the console
- Admin notifications will be logged to the console
- No actual emails will be sent

## Email Features

1. **Welcome Email to Users**:
   - Sent when a new user registers
   - Contains personalized greeting and platform information

2. **Admin Notification**:
   - Sent to ruttalamohan23@gmail.com when new users register
   - Contains user details and registration time

## Troubleshooting

If you see authentication errors:
1. Make sure 2-Factor Authentication is enabled
2. Make sure you're using an App Password, not your regular Gmail password
3. Ensure there are no extra spaces in the App Password in your [.env](file:///c:/Users/svssw/Downloads/akkamarigae/.env) file
4. Restart the server after updating the [.env](file:///c:/Users/svssw/Downloads/akkamarigae/.env) file