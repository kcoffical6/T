#!/bin/bash

# Environment setup script for XYZ Tours Backend
# Run this script to set up environment variables

echo "Setting up environment variables for XYZ Tours Backend..."

# Create .env file in backend directory
cat > backend/.env << 'EOF'
# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/xyz_tours?authSource=admin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123
REDIS_URL=redis://:redis123@localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
API_PREFIX=api
CORS_ORIGIN=http://localhost:4321

# Payment
UPI_MERCHANT_ID=your-upi-merchant-id
PSP_API_KEY=your-psp-api-key
PSP_WEBHOOK_SECRET=your-psp-webhook-secret
PAYMENT_EXPIRY_MINUTES=30

# Storage (MinIO/S3)
S3_BUCKET=xyz-tours-storage
S3_REGION=ap-south-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_ENDPOINT=http://localhost:9000

# Email
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# SMS
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=XYZTOURS

# Commission
DEFAULT_COMMISSION_PERCENT=10
DEFAULT_ADVANCE_PERCENT=30

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Monitoring
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_PORT=9090
EOF

echo "✅ Environment file created at backend/.env"
echo ""
echo "📋 Next steps:"
echo "1. Start MongoDB and Redis services (or use docker-compose up mongodb redis)"
echo "2. Run 'npm run dev' in the backend directory"
echo "3. The backend should now connect successfully!"
echo ""
echo "🔧 To start services with Docker:"
echo "   docker-compose up mongodb redis -d"
echo ""
echo "🚀 To start the backend:"
echo "   cd backend && npm run dev"


