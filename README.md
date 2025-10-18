# AI Review & Reputation Tool

A micro-SaaS solution for local businesses to manage online reviews and reputation with AI-powered insights.

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

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **Authentication**: JWT with bcrypt password hashing
- **Database**: SQLite for local data storage
- **AI Integration**: OpenAI API ready for sentiment analysis and auto-replies
- **Email Service**: Nodemailer with Gmail SMTP

## Getting Started

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

## Development

To run the server in development mode with auto-restart:
```bash
npm run dev
```

## Deployment

This application can be deployed to any platform that supports Node.js:
- Render
- Heroku
- Vercel
- Netlify (with serverless functions)
- DigitalOcean App Platform

### Render Deployment

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your forked repository
4. Configure the following environment variables:
   - `JWT_SECRET` - Your JWT secret key
   - `EMAIL_USER` - Your Gmail address for sending emails
   - `EMAIL_PASS` - Your Gmail app password
   - `OPENAI_API_KEY` - Your OpenAI API key (optional)
5. Set the build command to `npm install`
6. Set the start command to `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
OPENAI_API_KEY=your_openai_api_key (optional)
```

## Integration Points

### Authentication
- Ready for Supabase Auth or Qoder Auth integration
- Role-based access control (user/admin)

### AI Integration
- OpenAI API ready for:
  - Sentiment analysis of reviews
  - Auto-reply suggestions
  - Customer happiness scoring

### Notifications
- Gmail API integration ready for email notifications
- Twilio integration ready for WhatsApp notifications

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

This project is licensed under the MIT License.

## Support

For support, please open an issue on this repository.