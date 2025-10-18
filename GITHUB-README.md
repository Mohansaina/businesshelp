# AI Review & Reputation Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/ai-review-reputation-tool/pulls)

A production-ready micro-SaaS solution for local businesses to manage online reviews and reputation with AI-powered insights.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT
- **Dashboard**: Real-time review metrics and AI analysis
- **Business Management**: Profile setup and platform connections
- **Review Tracking**: Monitor reviews from multiple sources
- **AI-Powered Analytics**: Sentiment analysis and smart replies
- **Email Notifications**: Welcome emails and admin alerts
- **Responsive Design**: Works on all devices
- **Admin Panel**: User and order management

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-review-reputation-tool.git

# Navigate to project directory
cd ai-review-reputation-tool

# Install dependencies
npm install

# Start the development server
npm start

# Open your browser to http://localhost:3000
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** for development database
- **PostgreSQL** for production (Render deployment)
- **JWT** for authentication
- **Nodemailer** for email services

### Frontend
- **HTML5/CSS3/JavaScript** (Vanilla)
- **Responsive Design** with mobile-first approach
- **Modern UI** with consistent styling

### AI Integration
- **OpenAI API** for sentiment analysis
- **Simulated AI** for development/testing

### Deployment
- **Render** (Recommended)
- **Firebase** (Alternative)
- **Heroku** (Alternative)

## 📁 Project Structure

```
.
├── public/                 # Frontend assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── *.html             # HTML pages
├── functions/             # Firebase Cloud Functions
├── server.js              # Node.js server
├── package.json           # Project dependencies
├── .env                   # Environment variables
└── README.md              # This file
```

## 🎯 Core Functionality

### Authentication
- Email/password signup and login
- JWT token-based session management
- Password hashing with bcrypt
- Welcome email notifications

### Dashboard
- Review metrics visualization
- Sentiment analysis charts
- Business performance overview
- Real-time data updates

### Business Management
- Business profile creation
- Platform connection setup
- Contact information management

### Review Management
- Review tracking from multiple sources
- AI-powered sentiment analysis
- Smart reply suggestions
- Response management

### Admin Features
- User management
- Order tracking
- System analytics
- Email notifications

## 🚀 Deployment

### Render Deployment (Recommended)

1. Fork this repository
2. Create a Render account at [render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables:
   - `JWT_SECRET` - Your JWT secret
   - `EMAIL_USER` - Your email address
   - `EMAIL_PASS` - Your email app password
   - `OPENAI_API_KEY` - (Optional) OpenAI API key
6. Deploy!

### Firebase Deployment

1. Create a Firebase project
2. Enable Authentication, Firestore, and Hosting
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Run: `firebase init` and `firebase deploy`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_secure_jwt_secret_here

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Integration (Optional)
OPENAI_API_KEY=your_openai_api_key
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Create a new Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Start development server with auto-restart
npm run dev

# Run tests (if available)
npm test
```

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT-GUIDE.md) - Complete deployment instructions
- [Email Setup](EMAIL-SETUP.md) - Email configuration guide
- [API Documentation](API-DOCS.md) - Backend API endpoints
- [User Guide](USER-GUIDE.md) - How to use the application

## 🛡️ Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- CORS protection
- Input validation and sanitization
- Secure environment variable management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- OpenAI for providing powerful AI capabilities
- The open-source community for amazing tools and libraries

## 📞 Support

For support, please open an issue on this repository or contact the development team.

---

⭐ **If you find this project useful, please consider giving it a star!**