# XYZ Tours Backend - Next.js API

This is the backend API for XYZ Tours and Travels, built with Next.js API routes.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **User Management**: User profiles, saved passengers, role-based access
- **Package Management**: Tour packages with filtering and search
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, rate limiting, input validation
- **TypeScript**: Full TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB
- Redis (optional, for caching)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/profile` - Get user profile

### Packages
- `GET /api/packages` - List packages with filters
- `GET /api/packages/[slug]` - Get package by slug
- `GET /api/packages/featured` - Get featured packages
- `GET /api/packages/region/[region]` - Get packages by region

### Users
- `GET /api/users` - List users (admin only)
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/passengers` - Add saved passenger
- `DELETE /api/users/passengers/[index]` - Remove saved passenger
- `GET /api/users/role/[role]` - Get users by role

### Health & Documentation
- `GET /api/health` - Health check
- `GET /api/docs` - API documentation

## Environment Variables

Required:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret

Optional:
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` - Redis configuration
- `CORS_ORIGIN` - CORS allowed origin
- `PORT` - Server port (default: 3000)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Database Models

### User
- Basic user information
- Role-based access (user, admin, super_admin, driver)
- Saved passengers for quick booking

### Package
- Tour package details
- Itinerary with daily activities
- Pricing and availability
- Region and category filtering

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message"
}
```

## Development

The project uses:
- Next.js 14 with API routes
- TypeScript for type safety
- Mongoose for MongoDB operations
- JWT for authentication
- CORS middleware for cross-origin requests

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

Or use Docker:
```bash
docker build -t xyz-tours-backend .
docker run -p 3000:3000 xyz-tours-backend
```
