# XYZ Tours and Travels - Deployment Guide

This guide covers the complete deployment process for the XYZ Tours and Travels platform, including local development, staging, and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Staging Deployment](#staging-deployment)
6. [Production Deployment](#production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- Node.js 24 LTS
- Docker & Docker Compose
- MongoDB Atlas account (or local MongoDB)
- Redis instance (Redis 8.2.2+ patched)
- Kubernetes cluster (for production)
- kubectl configured
- Git

### Required Accounts

- MongoDB Atlas
- Redis Cloud or AWS ElastiCache
- AWS S3 (or S3-compatible storage)
- Payment Gateway (UPI/PSP)
- Email Service (SMTP)
- SMS Service (optional)
- Sentry (for error tracking)

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd xyz-tours-travels
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm run install:all
```

### 3. Environment Setup

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit environment files with your local settings
```

### 4. Start Development Environment

```bash
# Using Docker Compose (recommended)
npm run docker:up

# Or start individual services
npm run dev
```

### 5. Seed Database

```bash
npm run seed
```

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` with the following variables:

```env
# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/xyz-tours?authSource=admin
REDIS_URL=redis://:redis123@localhost:6379

# JWT Secrets (generate strong secrets for production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Payment Integration
UPI_MERCHANT_ID=your-upi-merchant-id
PSP_API_KEY=your-psp-api-key
PSP_WEBHOOK_SECRET=your-webhook-secret
PAYMENT_EXPIRY_MINUTES=30

# Storage (S3-compatible)
S3_BUCKET=xyz-tours-storage
S3_REGION=ap-south-1
S3_ACCESS_KEY=your-s3-access-key
S3_SECRET_KEY=your-s3-secret-key
S3_ENDPOINT=http://localhost:9000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (optional)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=XYZTOURS

# App Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:4321

# Commission Settings
DEFAULT_COMMISSION_PERCENT=10
DEFAULT_ADVANCE_PERCENT=30

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Monitoring
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_PORT=9090
```

### Frontend Environment Variables

Create `frontend/.env` with the following variables:

```env
# API Configuration
PUBLIC_API_URL=http://localhost:3000
PUBLIC_SITE_URL=http://localhost:4321

# Site Configuration
PUBLIC_SITE_NAME=XYZ Tours and Travels
PUBLIC_SITE_DESCRIPTION=Premium South India Tours for International Travelers
PUBLIC_CONTACT_EMAIL=info@xyztours.com
PUBLIC_CONTACT_PHONE=+91-9876543210

# Analytics
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX

# Maps
PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Payment
PUBLIC_PAYMENT_METHODS=upi,psp,card
PUBLIC_CURRENCY_DEFAULT=INR
PUBLIC_CURRENCY_SUPPORTED=INR,USD,EUR

# Features
PUBLIC_ENABLE_BLOG=true
PUBLIC_ENABLE_REVIEWS=true
PUBLIC_ENABLE_CHAT=true

# SEO
PUBLIC_DEFAULT_LOCALE=en
PUBLIC_SUPPORTED_LOCALES=en,hi,ta,te,kn,ml
PUBLIC_SITEMAP_URL=https://xyztours.com/sitemap.xml
```

## Database Setup

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Whitelist your IP addresses
4. Get the connection string
5. Update `MONGODB_URI` in your environment file

### Redis Setup

1. Create a Redis instance (Redis 8.2.2+ patched)
2. Configure authentication
3. Get the connection URL
4. Update `REDIS_URL` in your environment file

### Database Migration

```bash
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

## Staging Deployment

### 1. Prepare Staging Environment

```bash
# Build Docker images
docker build -t xyz-tours-backend:staging ./backend
docker build -t xyz-tours-frontend:staging ./frontend

# Push to registry
docker tag xyz-tours-backend:staging your-registry/xyz-tours-backend:staging
docker push your-registry/xyz-tours-backend:staging
```

### 2. Deploy to Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f infra/k8s/backend.yaml

# Update image
kubectl set image deployment/xyz-tours-backend backend=your-registry/xyz-tours-backend:staging -n xyz-tours

# Check deployment status
kubectl rollout status deployment/xyz-tours-backend -n xyz-tours
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n xyz-tours

# Check services
kubectl get services -n xyz-tours

# Check logs
kubectl logs -f deployment/xyz-tours-backend -n xyz-tours
```

## Production Deployment

### 1. Security Checklist

- [ ] All secrets are stored in Kubernetes secrets
- [ ] JWT secrets are cryptographically strong
- [ ] Redis is patched to version 8.2.2+
- [ ] Rate limiting is configured
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation is enabled
- [ ] Security headers are set

### 2. Production Environment Variables

Update the Kubernetes secrets with production values:

```bash
# Create secrets
kubectl create secret generic xyz-tours-secrets \
  --from-literal=MONGODB_URI="your-production-mongodb-uri" \
  --from-literal=REDIS_URL="your-production-redis-url" \
  --from-literal=JWT_SECRET="your-production-jwt-secret" \
  --from-literal=JWT_REFRESH_SECRET="your-production-jwt-refresh-secret" \
  --from-literal=UPI_MERCHANT_ID="your-production-upi-merchant-id" \
  --from-literal=PSP_API_KEY="your-production-psp-api-key" \
  --from-literal=PSP_WEBHOOK_SECRET="your-production-webhook-secret" \
  --from-literal=S3_BUCKET="your-production-s3-bucket" \
  --from-literal=S3_REGION="your-production-s3-region" \
  --from-literal=S3_ACCESS_KEY="your-production-s3-access-key" \
  --from-literal=S3_SECRET_KEY="your-production-s3-secret-key" \
  --from-literal=S3_ENDPOINT="your-production-s3-endpoint" \
  --from-literal=SMTP_HOST="your-production-smtp-host" \
  --from-literal=SMTP_PORT="your-production-smtp-port" \
  --from-literal=SMTP_USER="your-production-smtp-user" \
  --from-literal=SMTP_PASS="your-production-smtp-pass" \
  --from-literal=SMS_API_KEY="your-production-sms-api-key" \
  --from-literal=SMS_SENDER_ID="your-production-sms-sender-id" \
  --from-literal=SENTRY_DSN="your-production-sentry-dsn" \
  -n xyz-tours
```

### 3. Deploy to Production

```bash
# Apply production configuration
kubectl apply -f infra/k8s/backend.yaml

# Deploy latest image
kubectl set image deployment/xyz-tours-backend backend=your-registry/xyz-tours-backend:latest -n xyz-tours

# Wait for rollout
kubectl rollout status deployment/xyz-tours-backend -n xyz-tours

# Run database migrations
kubectl exec -n xyz-tours deployment/xyz-tours-backend -- npm run migrate

# Seed database
kubectl exec -n xyz-tours deployment/xyz-tours-backend -- npm run seed
```

### 4. Frontend Deployment

Deploy the frontend to Vercel or Cloudflare Pages:

```bash
# Build frontend
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Cloudflare Pages
wrangler pages publish dist
```

## Monitoring & Maintenance

### 1. Health Checks

The application provides health check endpoints:

- Backend: `https://api.xyztours.com/health`
- Frontend: `https://xyztours.com`

### 2. Monitoring Setup

Configure monitoring with:

- **Sentry**: Error tracking and performance monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Uptime monitoring**: External service monitoring

### 3. Log Management

```bash
# View application logs
kubectl logs -f deployment/xyz-tours-backend -n xyz-tours

# View specific pod logs
kubectl logs <pod-name> -n xyz-tours

# Follow logs with timestamps
kubectl logs -f deployment/xyz-tours-backend -n xyz-tours --timestamps
```

### 4. Database Maintenance

```bash
# Backup database
mongodump --uri="your-mongodb-uri" --out=backup-$(date +%Y%m%d)

# Restore database
mongorestore --uri="your-mongodb-uri" backup-$(date +%Y%m%d)

# Monitor database performance
# Use MongoDB Atlas monitoring or set up custom monitoring
```

### 5. Scaling

```bash
# Scale backend horizontally
kubectl scale deployment xyz-tours-backend --replicas=5 -n xyz-tours

# Scale based on CPU usage
kubectl autoscale deployment xyz-tours-backend --cpu-percent=70 --min=3 --max=10 -n xyz-tours
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check MongoDB connectivity
kubectl exec -n xyz-tours deployment/xyz-tours-backend -- npm run test:db

# Check Redis connectivity
kubectl exec -n xyz-tours deployment/xyz-tours-backend -- redis-cli ping
```

#### 2. Payment Issues

- Verify UPI merchant ID and PSP API keys
- Check webhook endpoint accessibility
- Verify payment gateway configuration

#### 3. Performance Issues

```bash
# Check resource usage
kubectl top pods -n xyz-tours

# Check HPA status
kubectl get hpa -n xyz-tours

# Scale up if needed
kubectl scale deployment xyz-tours-backend --replicas=5 -n xyz-tours
```

#### 4. SSL Certificate Issues

```bash
# Check certificate status
kubectl get certificates -n xyz-tours

# Check certificate details
kubectl describe certificate xyz-tours-backend-tls -n xyz-tours
```

### Debug Commands

```bash
# Get pod details
kubectl describe pod <pod-name> -n xyz-tours

# Get service details
kubectl describe service xyz-tours-backend-service -n xyz-tours

# Get ingress details
kubectl describe ingress xyz-tours-backend-ingress -n xyz-tours

# Check events
kubectl get events -n xyz-tours --sort-by='.lastTimestamp'
```

### Rollback Procedures

```bash
# Rollback deployment
kubectl rollout undo deployment/xyz-tours-backend -n xyz-tours

# Check rollout history
kubectl rollout history deployment/xyz-tours-backend -n xyz-tours

# Rollback to specific revision
kubectl rollout undo deployment/xyz-tours-backend --to-revision=2 -n xyz-tours
```

## Security Considerations

### 1. Secrets Management

- Use Kubernetes secrets for sensitive data
- Rotate secrets regularly
- Use external secret management systems (HashiCorp Vault, AWS Secrets Manager)

### 2. Network Security

- Configure network policies
- Use service mesh (Istio) for advanced traffic management
- Implement proper firewall rules

### 3. Application Security

- Enable rate limiting
- Implement proper CORS policies
- Use HTTPS everywhere
- Regular security audits

### 4. Data Protection

- Encrypt data at rest and in transit
- Implement proper backup strategies
- Follow GDPR compliance guidelines

## Support

For deployment issues or questions:

1. Check the troubleshooting section above
2. Review application logs
3. Check monitoring dashboards
4. Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
