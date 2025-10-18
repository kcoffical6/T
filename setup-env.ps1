# Environment setup script for XYZ Tours Backend (PowerShell)
# Run this script to set up environment variables

Write-Host "Setting up environment variables for XYZ Tours Backend..." -ForegroundColor Green

# Create .env file in backend directory
$envContent = @"
# Database
MONGODB_URI=mongodb://localhost:27017/xyz-tours

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
"@

$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8

Write-Host "✅ Environment file created at backend\.env" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Start MongoDB and Redis services (or use docker-compose up mongodb redis)"
Write-Host "2. Run 'npm run dev' in the backend directory"
Write-Host "3. The backend should now connect successfully!"
Write-Host ""
Write-Host "🔧 To start services with Docker:" -ForegroundColor Cyan
Write-Host "   docker-compose up mongodb redis -d"
Write-Host ""
Write-Host "🚀 To start the backend:" -ForegroundColor Cyan
Write-Host "   cd backend && npm run dev"


