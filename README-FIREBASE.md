# AI Review & Reputation Tool with Firebase Integration

This is a complete micro-SaaS application for local businesses to manage their online reviews and reputation with AI-powered insights, now integrated with Firebase for authentication, data storage, and cloud functions.

## Features

### User Authentication
- User signup with name, email, and password
- Email/password authentication with Firebase Authentication
- Social login (Google, GitHub)
- Secure password handling with Firebase Auth
- Automatic welcome email on signup

### Data Management
- User profiles stored in Firestore
- Business information management
- Order tracking system
- Real-time data synchronization

### Admin Features
- Admin dashboard to view all users
- Order management for all customers
- System analytics and metrics

### Email Notifications
- Automatic welcome emails on user registration
- Configurable email templates

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Authentication, Firestore, Cloud Functions
- **Hosting**: Firebase Hosting
- **Email Service**: Nodemailer with Gmail SMTP

## Project Structure

```
.
├── firebase.json              # Firebase configuration
├── functions/                 # Cloud Functions
│   ├── index.js              # Cloud Functions implementation
│   └── package.json          # Functions dependencies
├── public/                   # Public assets
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── dashboard.html        # User dashboard
│   ├── orders.html           # Order management
│   ├── admin.html            # Admin dashboard
│   ├── business.html         # Business setup
│   ├── reviews.html          # Review management
│   ├── analytics.html        # Analytics dashboard
│   ├── settings.html         # Account settings
│   ├── 404.html              # Error page
│   ├── css/                  # Stylesheets
│   │   ├── style.css         # Main styles
│   │   ├── auth.css          # Authentication styles
│   │   └── dashboard.css     # Dashboard styles
│   └── js/                   # JavaScript files
│       ├── firebase-config.js # Firebase configuration
│       ├── auth-firebase.js  # Authentication functions
│       ├── dashboard-firebase.js # Dashboard functions
│       ├── orders-firebase.js # Order management
│       ├── admin-firebase.js # Admin functions
│       ├── main.js           # Landing page scripts
│       ├── business.js       # Business setup scripts
│       ├── reviews.js        # Review management scripts
│       ├── analytics.js      # Analytics scripts
│       └── settings.js       # Settings scripts
└── README-FIREBASE.md        # This file
```

## Setup Instructions

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project or use an existing one
3. Enable the following Firebase services:
   - Authentication (Email/Password, Google, GitHub)
   - Cloud Firestore
   - Cloud Functions
   - Hosting

### 2. Firebase Configuration

1. In the Firebase Console, go to Project Settings
2. Under "General" tab, copy your Firebase SDK configuration
3. Update `public/js/firebase-config.js` with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 3. Enable Authentication Methods

1. In the Firebase Console, go to Authentication > Sign-in method
2. Enable the following sign-in providers:
   - Email/Password
   - Google
   - GitHub (you'll need to configure OAuth credentials)

### 4. Configure Firestore Security Rules

In the Firebase Console, go to Firestore > Rules and set the following rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own businesses
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can read and write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Admin access to all data (customize as needed)
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

### 5. Set up Cloud Functions

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Install Cloud Functions dependencies:
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. Configure email credentials for welcome emails:
   ```bash
   firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
   ```

5. Deploy Cloud Functions:
   ```bash
   firebase deploy --only functions
   ```

### 6. Deploy to Firebase Hosting

1. Deploy the application:
   ```bash
   firebase deploy --only hosting
   ```

2. Your application will be available at `https://your-project-id.firebaseapp.com`

## Email Configuration

To send welcome emails, you need to configure email credentials:

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Set the Firebase Functions configuration:
   ```bash
   firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
   ```

### SendGrid Setup (Alternative)
If you prefer SendGrid:
1. Create a SendGrid account
2. Generate an API key
3. Update the `functions/index.js` file to use SendGrid instead of Gmail
4. Set the Firebase Functions configuration:
   ```bash
   firebase functions:config:set sendgrid.key="your-sendgrid-api-key"
   ```

## Customization

### Branding
- Update the logo and branding in `public/css/style.css`
- Modify the content in each HTML file
- Customize email templates in `functions/index.js`

### Adding New Features
- Add new HTML pages in the `public/` directory
- Create corresponding JavaScript files in `public/js/`
- Add new collections to Firestore as needed
- Update Firestore security rules accordingly

## Testing

### Local Development
1. Serve the application locally:
   ```bash
   firebase serve
   ```

2. Test the application at `http://localhost:5000`

### Testing Authentication
1. Test user signup with email and password
2. Test social login (Google, GitHub)
3. Verify welcome emails are sent
4. Test login/logout functionality

### Testing Data Management
1. Create a business profile
2. Place sample orders
3. Verify data is stored in Firestore
4. Test admin dashboard functionality

## Security Considerations

1. Never commit sensitive information like API keys to version control
2. Use Firebase Security Rules to control data access
3. Implement proper input validation on both client and server
4. Regularly review and update dependencies
5. Use HTTPS in production (Firebase Hosting provides this automatically)

## Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   - Verify your Firebase configuration in `firebase-config.js`
   - Check that the correct authentication providers are enabled
   - Ensure your Firebase project is properly set up

2. **Firestore Permission Errors**
   - Review your Firestore security rules
   - Ensure users can only access their own data
   - Check that the rules match your data structure

3. **Email Not Sending**
   - Verify email credentials in Firebase Functions configuration
   - Check that you're using an App Password for Gmail
   - Review Cloud Functions logs for error messages

4. **Deployment Issues**
   - Ensure you're logged into Firebase CLI
   - Check that your project ID matches your Firebase project
   - Verify you have the necessary permissions

### Getting Help

- Check the Firebase documentation: https://firebase.google.com/docs
- Review the browser console for JavaScript errors
- Check Firebase Functions logs: `firebase functions:log`
- Review Firestore usage and security rules in the Firebase Console

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on this repository or contact the development team.