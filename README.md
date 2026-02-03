 Google Authentication Backend with Email Verification

Node.js + Express + MongoDB + JWT + Zod

A production-ready backend implementing Google Login, Email Verification, and JWT-based authentication.

 Features

 Google Sign-In (OAuth 2.0)

Email verification on first login

 JWT authentication

 Zod request validation

 MongoDB (Mongoose)

 Environment-based configuration

 Scalable project structure

 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

Google OAuth (google-auth-library)

JWT (jsonwebtoken)

Zod

Nodemailer

dotenv

 Packages Used
Dependencies
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "dotenv": "^16.4.0",
  "jsonwebtoken": "^9.0.2",
  "google-auth-library": "^9.4.1",
  "zod": "^3.22.4",
  "nodemailer": "^6.9.8",
  "cors": "^2.8.5"
}

Dev Dependencies
{
  "nodemon": "^3.0.2"
}

 Project Structure
src/
├── controllers/
│   ├── googleAuthController.js
│   └── emailVerifyController.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── validations/
│   └── authValidation.js
├── middlewares/
│   └── validate.js
├── utils/
│   └── sendEmail.js
├── app.js
└── server.js

 Environment Variables

Create a .env file:

PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/google_auth_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:5173

 Installation
git clone https://github.com/your-username/google-auth-backend.git
cd google-auth-backend
npm install

▶ Run the Server
npm run dev

 API Endpoints
Google Login
POST /api/auth/google-login


Request Body

{
  "idToken": "GOOGLE_ID_TOKEN"
}

Verify Email
GET /api/auth/verify-email/:token

 Authentication Flow

User signs in with Google

Backend verifies Google ID Token

If email not verified → send verification email

User verifies email

Backend issues JWT

 Email Verification

Secure verification token

One-time link

Token expiration support

Example:

http://localhost:7002/web/userauth/register
http://localhost:7002/web/userauth/verify-email/<token>
http://localhost:7002/web/userauth/login
http://localhost:7002/web/userauth/forget-password

 Future Enhancements

 Refresh tokens

 OTP-based verification

 Role-based authentication

 Email/password login
