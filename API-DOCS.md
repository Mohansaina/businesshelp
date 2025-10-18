# API Documentation

This document provides detailed information about the REST API endpoints available in the AI Review & Reputation Tool.

## 📡 Base URL

```
http://localhost:3000/api
```

In production, this will be your deployed domain:
```
https://yourdomain.com/api
```

## 🔐 Authentication

Most API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 User Endpoints

### Register a New User

**POST** `/api/register`

Registers a new user account.

#### Request Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### Response
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "string",
    "email": "string"
  }
}
```

#### Status Codes
- `201` - User created successfully
- `400` - Validation error or email already exists
- `500` - Server error

### User Login

**POST** `/api/login`

Authenticates a user and returns a JWT token.

#### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "string",
    "email": "string"
  }
}
```

#### Status Codes
- `200` - Login successful
- `400` - Invalid credentials
- `500` - Server error

### Get User Profile

**GET** `/api/profile`

Retrieves the authenticated user's profile information.

#### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Response
```json
{
  "user": {
    "id": 1,
    "name": "string",
    "email": "string"
  }
}
```

#### Status Codes
- `200` - Profile retrieved successfully
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

## 🏢 Business Endpoints

### Get User Businesses

**GET** `/api/businesses`

Retrieves all businesses associated with the authenticated user.

#### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Response
```json
{
  "businesses": [
    {
      "id": 1,
      "user_id": 1,
      "name": "string",
      "phone": "string",
      "address": "string",
      "google_id": "string",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Status Codes
- `200` - Businesses retrieved successfully
- `401` - Unauthorized
- `500` - Server error

### Create Business

**POST** `/api/businesses`

Creates a new business for the authenticated user.

#### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Request Body
```json
{
  "name": "string",
  "phone": "string",
  "address": "string",
  "google_id": "string"
}
```

#### Response
```json
{
  "message": "Business created successfully",
  "business": {
    "id": 1,
    "user_id": 1,
    "name": "string",
    "phone": "string",
    "address": "string",
    "google_id": "string"
  }
}
```

#### Status Codes
- `201` - Business created successfully
- `400` - Validation error
- `401` - Unauthorized
- `500` - Server error

## 📝 Review Endpoints

### Get Business Reviews

**GET** `/api/reviews/:businessId`

Retrieves all reviews for a specific business.

#### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Parameters
- `businessId` - The ID of the business

#### Response
```json
{
  "reviews": [
    {
      "id": 1,
      "business_id": 1,
      "source": "string",
      "rating": 5,
      "text": "string",
      "sentiment_score": 8.5,
      "ai_analysis": "string",
      "ai_reply": "string",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Status Codes
- `200` - Reviews retrieved successfully
- `401` - Unauthorized
- `403` - Access denied
- `500` - Server error

### Add Review

**POST** `/api/reviews`

Adds a new review for a business with AI analysis.

#### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Request Body
```json
{
  "businessId": 1,
  "source": "string",
  "rating": 5,
  "text": "string"
}
```

#### Response
```json
{
  "message": "Review added successfully",
  "review": {
    "id": 1,
    "business_id": 1,
    "source": "string",
    "rating": 5,
    "text": "string",
    "sentiment_score": 8.5,
    "ai_analysis": {
      "sentiment_analysis": "string",
      "suggested_reply": "string",
      "sentiment_score": 8.5
    },
    "ai_reply": "string",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Status Codes
- `201` - Review added successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Access denied
- `500` - Server error

## 📊 Dashboard Endpoints

### Get Dashboard Stats

**GET** `/api/dashboard/stats`

Retrieves dashboard statistics for the authenticated user.

#### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Response
```json
{
  "totalReviews": 1248,
  "averageRating": 4.7,
  "customerHappiness": 89,
  "sentimentScore": 8.2
}
```

#### Status Codes
- `200` - Stats retrieved successfully
- `401` - Unauthorized
- `500` - Server error

## 📧 Email Integration

The application includes email functionality for user notifications:

### Welcome Emails
- Sent automatically when users register
- Contains personalized greeting and platform information

### Admin Notifications
- Sent to administrator when new users register
- Contains user details and registration time

## 🤖 AI Integration

### Sentiment Analysis
- Reviews are automatically analyzed for sentiment
- Scores range from 0 (very negative) to 10 (very positive)

### Smart Replies
- AI-generated responses to reviews
- Customizable based on sentiment and content

## 🔒 Security

### Authentication
- JWT tokens with 7-day expiration
- Password hashing with bcrypt (10 rounds)
- Secure token storage

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- CORS protection

### Rate Limiting
- Request throttling to prevent abuse
- IP-based rate limiting

## 📈 Rate Limits

To ensure fair usage and prevent abuse, the API implements rate limiting:

- 100 requests per 15 minutes per IP address
- 10 requests per minute for authentication endpoints

Exceeding these limits will result in a `429 Too Many Requests` response.

## 🐛 Error Handling

All API responses follow a consistent error format:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Testing

To test the API endpoints, you can use tools like:

- **Postman**
- **curl**
- **Insomnia**

### Example curl request:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

## 📞 Support

For API-related issues or questions, please open an issue on the GitHub repository or contact the development team.