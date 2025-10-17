# XYZ Tours - Admin Panel & API Access Guide

## 🚀 Quick Start Options

### Option 1: Using Docker (Recommended)
1. **Start Docker Desktop** on your Windows machine
2. **Run the following commands:**
   ```bash
   # Start all services (MongoDB, Redis, Backend)
   npm run docker:up
   
   # Start admin panel
   cd admin-pwa
   npm install
   npm run dev
   
   # Seed initial data
   npm run seed
   ```

### Option 2: Manual Setup (If Docker is not available)
1. **Install MongoDB locally** or use MongoDB Atlas
2. **Install Redis locally** or use Redis Cloud
3. **Update backend/.env** with your database URLs
4. **Start services manually:**
   ```bash
   # Terminal 1 - Backend API
   cd backend
   npm install
   npm run start:dev
   
   # Terminal 2 - Admin Panel
   cd admin-pwa
   npm install
   npm run dev
   
   # Terminal 3 - Seed data
   npm run seed
   ```

## 🔐 Admin Panel Access

### URLs
- **Admin Panel**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Frontend Website**: http://localhost:4321

### Default Admin Credentials
- **Super Admin**: 
  - Email: `superadmin@xyztours.com`
  - Password: `password123`
- **Admin**: 
  - Email: `admin@xyztours.com`
  - Password: `password123`

## 📱 Admin Panel Features

### Dashboard
- Overview of bookings, revenue, and key metrics
- Recent activity and notifications
- Quick actions for common tasks

### Pending Approvals
- Review booking requests
- Approve/reject bookings with comments
- Assign vehicles and drivers
- Set commission overrides

### Fleet Management
- Manage vehicles (add, edit, remove)
- Block dates for maintenance
- Assign drivers to vehicles
- Track vehicle status and availability

### Reports
- Revenue reports with filters
- Booking analytics
- Driver performance metrics
- Export data to CSV

### Settings
- System configuration
- User management
- Payment settings
- Notification preferences

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/approve` - Approve booking
- `POST /api/bookings/:id/reject` - Reject booking
- `PUT /api/bookings/:id` - Update booking

### Packages
- `GET /api/packages` - List all packages
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Add vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `POST /api/vehicles/:id/block-dates` - Block dates

### Drivers
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Add driver
- `PUT /api/drivers/:id` - Update driver
- `POST /api/drivers/:id/assign` - Assign to booking

### Payments
- `POST /api/payments/generate-upi` - Generate UPI QR
- `POST /api/payments/generate-psp` - Generate PSP link
- `POST /api/payments/webhook` - Payment confirmation

## 🛠️ Development Commands

```bash
# Start all services
npm run dev

# Start individual services
npm run dev:frontend    # Frontend website
npm run dev:backend     # Backend API
npm run dev:admin       # Admin panel (manual)

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Docker commands
npm run docker:up       # Start containers
npm run docker:down      # Stop containers
npm run docker:build    # Build containers

# Database commands
npm run seed            # Seed initial data
npm run migrate         # Run migrations
```

## 🔧 Troubleshooting

### Common Issues

1. **Docker not starting**
   - Ensure Docker Desktop is running
   - Check if virtualization is enabled in BIOS
   - Try restarting Docker Desktop

2. **Database connection errors**
   - Check MongoDB is running on port 27017
   - Verify connection string in .env file
   - Ensure Redis is running on port 6379

3. **Admin panel not loading**
   - Check if backend API is running on port 3000
   - Verify CORS settings in backend
   - Check browser console for errors

4. **Authentication issues**
   - Ensure JWT secrets are set in .env
   - Check if user exists in database
   - Verify password hashing

### Ports Used
- **3000**: Backend API
- **4321**: Frontend website
- **5173**: Admin panel
- **27017**: MongoDB
- **6379**: Redis

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all services are running
3. Check the API documentation at http://localhost:3000/api/docs
4. Review the environment configuration

## 🎯 Next Steps

1. **Start the services** using one of the options above
2. **Access the admin panel** at http://localhost:5173
3. **Login** with the provided credentials
4. **Seed initial data** to populate the system
5. **Explore the features** and customize as needed
