# XYZ Tours and Travels - South India Platform

A modern, mobile-first, SEO-first marketing and booking platform built with Astro SSG and React 19 client-islands, designed specifically for international travelers exploring South India.

## 🚀 Overview

XYZ Tours and Travels is a comprehensive travel platform that showcases the beauty of South India through curated tour packages. The platform features a sophisticated booking system with admin approval workflows, hidden commission management, and seamless payment integration.

## 🏗️ Architecture

- **Frontend**: Astro (SSG) with React 19 islands for optimal performance
- **Backend**: NestJS with MongoDB for scalable API development
- **Cache**: Redis 8.2.2+ (patched) for session management and queues
- **Storage**: S3-compatible storage for images and documents
- **Deployment**: Docker + Kubernetes for production scalability
- **Payment**: UPI QR codes and PSP integration
- **Monitoring**: Sentry, Prometheus, and Grafana

## ✨ Key Features

### 🎯 Core Functionality
- ✅ **Marketing Site**: SEO-optimized static site with 10+ South India packages
- ✅ **4-Step Booking Wizard**: Intuitive React component for tour bookings
- ✅ **Admin Approval Workflow**: All bookings require admin approval before payment
- ✅ **Hidden Commission System**: Transparent commission management for admins
- ✅ **UPI/PSP Payment Integration**: Secure payment processing with QR codes
- ✅ **Mobile-First Admin PWA**: Responsive admin dashboard for approvals
- ✅ **Driver Assignment Portal**: PWA for driver trip management
- ✅ **Vehicle Availability Management**: Real-time fleet management
- ✅ **Audit Logging**: Complete audit trail for all actions
- ✅ **JSON-LD SEO**: Structured data for search engines

### 🔐 Security & Compliance
- JWT-based authentication with refresh tokens
- Role-based access control (Super Admin, Admin, Driver, User)
- Rate limiting and input validation
- HTTPS enforcement and security headers
- GDPR-compliant data handling

### 📱 Mobile Experience
- Mobile-first design for admin and driver interfaces
- PWA capabilities for offline functionality
- Touch-optimized interactions
- Responsive design across all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 24 LTS
- Docker & Docker Compose
- MongoDB Atlas account
- Redis instance (8.2.2+ patched)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd xyz-tours-travels
   npm install
   ```

2. **Environment setup**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit both .env files with your credentials
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Start with Docker (Recommended)**
   ```bash
   npm run docker:up
   ```

5. **Seed initial data**
   ```bash
   npm run seed
   ```

## 📁 Project Structure

```
xyz-tours-travels/
├── frontend/                 # Astro SSG marketing site
│   ├── src/
│   │   ├── pages/           # Astro pages
│   │   ├── components/      # Astro & React components
│   │   ├── layouts/         # Page layouts
│   │   └── react/           # React 19 islands
│   ├── public/              # Static assets
│   └── astro.config.mjs     # Astro configuration
├── backend/                  # NestJS API server
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── packages/        # Tour packages
│   │   ├── bookings/        # Booking system
│   │   ├── vehicles/        # Vehicle management
│   │   ├── drivers/         # Driver management
│   │   ├── payments/        # Payment processing
│   │   ├── admin/           # Admin functions
│   │   └── reports/         # Reporting system
│   ├── scripts/             # Database scripts
│   └── Dockerfile           # Backend container
├── shared/                   # Shared types and utilities
│   └── src/
│       └── index.ts         # TypeScript definitions
├── infra/                    # Infrastructure
│   └── k8s/                 # Kubernetes manifests
├── docs/                     # Documentation
│   └── deployment.md        # Deployment guide
├── tests/                    # E2E tests
├── storybook/               # Component library
├── .github/                 # CI/CD workflows
├── docker-compose.yml       # Local development
├── openapi.yaml            # API specification
└── README.md               # This file
```

## 🎯 South India Packages

The platform includes 10 carefully curated tour packages:

1. **7-Day Kerala Backwaters & Hill Stations** - ₹45,000
2. **5-Day Tamil Nadu Temple Circuit & Hill Stations** - ₹35,000
3. **6-Day Karnataka Heritage & Nature Tour** - ₹40,000
4. **4-Day Pondicherry French Quarter & Auroville** - ₹25,000
5. **3-Day Kanyakumari & Trivandrum Coastal Tour** - ₹18,000
6. **5-Day Chennai & Mahabalipuram Heritage Tour** - ₹28,000
7. **4-Day Tirupati & Andhra Pradesh Temple Tour** - ₹22,000
8. **6-Day Goa & South India Coastal Experience** - ₹32,000
9. **8-Day Complete South India Grand Tour** - ₹65,000

Each package includes detailed itineraries, inclusions, exclusions, and pricing information.

## 🔄 Booking Workflow

### Customer Journey
1. **Browse Packages**: Explore South India tour packages
2. **Select Package**: Choose dates, pickup location, and travelers
3. **Submit Booking**: Complete 4-step booking wizard
4. **Await Approval**: Booking status: `pending_approval`
5. **Admin Approval**: Admin reviews and approves booking
6. **Payment Request**: Generate UPI QR or PSP link
7. **Payment Confirmation**: Complete advance payment
8. **Trip Confirmation**: Booking status: `confirmed`

### Admin Workflow
1. **Review Pending**: View all pending booking requests
2. **Approve/Reject**: Quick approve with vehicle assignment
3. **Commission Override**: Adjust commission if needed
4. **Payment Generation**: Create payment request
5. **Monitor Status**: Track payment and trip progress

## 💳 Payment System

### Supported Methods
- **UPI QR Codes**: Instant payment via UPI apps
- **PSP Links**: Payment gateway integration
- **Future**: Stripe/card payments (planned)

### Payment Flow
1. Admin approves booking
2. System generates payment request (30-minute expiry)
3. Customer receives UPI QR or payment link
4. Payment confirmation via webhook
5. Booking status updated to `confirmed`

## 🔐 Admin Access

### Default Credentials
- **Super Admin**: admin@xyztours.com / admin123
- **Secondary Admin**: admin2@xyztours.com / admin123

### Admin Features
- Pending booking approvals
- Vehicle fleet management
- Driver assignment
- Commission management
- Revenue reports
- CSV exports

## 📊 API Documentation

Once running, visit:
- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **OpenAPI Spec**: See `openapi.yaml`

### Key Endpoints
- `GET /api/packages` - List all packages
- `POST /api/bookings` - Create booking request
- `POST /api/admin/bookings/:id/approve` - Approve booking
- `POST /api/payments/generate-upi` - Generate payment
- `POST /api/payments/webhook` - Payment confirmation

## 🚀 Deployment

### Local Development
```bash
npm run docker:up
```

### Staging
```bash
kubectl apply -f infra/k8s/backend.yaml
```

### Production
See [deployment guide](./docs/deployment.md) for complete production setup.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📈 Monitoring

### Health Checks
- Backend: `http://localhost:3000/health`
- Frontend: `http://localhost:4321`

### Monitoring Stack
- **Sentry**: Error tracking and performance
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Uptime monitoring**: External service monitoring

## 🔧 Development

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for version control
- Comprehensive test coverage

### Contributing
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Update documentation
5. Submit a pull request

## 📋 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
UPI_MERCHANT_ID=your-merchant-id
PSP_API_KEY=your-api-key
S3_BUCKET=your-bucket
# ... see backend/.env.example
```

### Frontend (.env)
```env
PUBLIC_API_URL=http://localhost:3000
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_GA_ID=G-XXXXXXXXXX
# ... see frontend/.env.example
```

## 🛡️ Security

### Implemented Security Measures
- JWT authentication with refresh tokens
- Rate limiting on all endpoints
- Input validation with class-validator
- CORS configuration
- HTTPS enforcement
- Security headers (Helmet.js)
- Redis ACLs (8.2.2+ patched)

### Security Checklist
- [ ] All secrets stored in Kubernetes secrets
- [ ] JWT secrets are cryptographically strong
- [ ] Redis patched to version 8.2.2+
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Security headers set

## 📞 Support

For technical support or questions:

1. Check the [deployment guide](./docs/deployment.md)
2. Review application logs
3. Check monitoring dashboards
4. Contact the development team

## 📄 License

Private - XYZ Tours and Travels

---

**Built with ❤️ for South India Tourism**

*Last Updated: January 2024 | Version: 1.0.0*
