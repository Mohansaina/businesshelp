# AI Review & Reputation Tool

A micro-SaaS solution for local businesses to manage online reviews and reputation with AI-powered insights.

## Firebase Integration Notice

This version of the application has been updated to use Firebase for authentication and data storage. The original Node.js/SQLite implementation is still available but the recommended approach is to use Firebase for better scalability and real-time features.

Your Firebase project: [thebusinesshelper-baccf](https://console.firebase.google.com/project/thebusinesshelper-baccf/overview)

## Features

- **Landing Page**: Attractive homepage with signup/login options
- **User Authentication**: Secure signup and login with role-based access
- **Dashboard**: Comprehensive overview of review metrics and AI analysis
- **Business Setup**: Easy configuration of business information and platform connections
- **Review Management**: Track review requests and AI-generated responses
- **Analytics**: Detailed insights and reports on review performance
- **Settings**: Complete account and subscription management
- **Order Management**: Track and manage customer orders
- **Admin Dashboard**: View all users and orders (admin only)

## Technology Stack

### Firebase Implementation (Recommended)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Authentication, Firestore, Cloud Functions
- **Hosting**: Firebase Hosting
- **Email Service**: Nodemailer with Gmail SMTP

### Original Implementation (Legacy)
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js with built-in HTTP server
- **Authentication**: JWT with bcrypt password hashing
- **Database**: SQLite for local data storage

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
├── server.js                 # Node.js server (original implementation)
├── package.json              # Project configuration
└── README.md                 # This file
```

## Getting Started (Firebase Implementation)

1. **Install Node.js** (version 14 or higher)

2. **Clone or download this repository**

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up Firebase**:
   - Go to your Firebase project: [thebusinesshelper-baccf](https://console.firebase.google.com/project/thebusinesshelper-baccf/overview)
   - Get your web app configuration from Project Settings
   - Update `public/js/firebase-config.js` with your Firebase configuration
   - Enable Authentication (Email/Password, Google, GitHub)
   - Enable Cloud Firestore

5. **Start the development server**:
   ```bash
   npm start
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## Easy Setup Scripts

We've provided easy setup scripts for your convenience:

- **Windows PowerShell**: Run `setup-firebase.ps1`
- **Windows Batch**: Run `setup-firebase.bat`

These scripts will:
1. Check if Node.js and npm are installed
2. Install project dependencies
3. Verify Firebase configuration
4. Start the development server

## Getting Started (Original Implementation)

1. **Install Node.js** (version 14 or higher)

2. **Clone or download this repository**

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Development (Original Implementation)

To run the server in development mode with auto-restart:
```bash
npm run dev
```

## Firebase Integration Setup

For the new Firebase integration, please refer to the detailed setup instructions in [FIREBASE-INTEGRATION-GUIDE.md](FIREBASE-INTEGRATION-GUIDE.md).

### Quick Firebase Setup:

1. Go to your Firebase project: [thebusinesshelper-baccf](https://console.firebase.google.com/project/thebusinesshelper-baccf/overview)
2. Enable Authentication (Email/Password, Google, GitHub)
3. Enable Cloud Firestore
4. Enable Cloud Functions
5. Update `public/js/firebase-config.js` with your Firebase configuration
6. Deploy with `firebase deploy`

## Deployment

### Firebase Implementation (Recommended)
The Firebase version can be deployed with:
```bash
firebase deploy
```

### Original Implementation
This application can be deployed to any platform that supports Node.js:
- Render
- Heroku
- Vercel
- Netlify (with serverless functions)
- DigitalOcean App Platform

## Integration Points

### Authentication
- Ready for Supabase Auth or Qoder Auth integration
- Firebase Authentication ready (email/password, Google, GitHub)
- Role-based access control (user/admin)

### AI Integration
- OpenAI API ready for:
  - Sentiment analysis of reviews
  - Auto-reply suggestions
  - Customer happiness scoring

### Notifications
- Gmail API integration ready for email notifications
- Twilio integration ready for WhatsApp notifications
- Firebase Cloud Functions with Nodemailer for welcome emails

### Payments
- Stripe integration ready for subscription management
- Pro and Agency plan support

## Customization

To customize this application for your specific needs:

1. Update the branding in `public/css/style.css`
2. Modify the content in each HTML file
3. Add your API keys for third-party integrations
4. Extend the functionality in the JavaScript files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on this repository or contact the development team.