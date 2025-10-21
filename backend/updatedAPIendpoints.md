I'll help you list all the API routes in your backend. The error occurs because the main server file isn't named `index.js`. Let's find the correct entry point.

Let me check the backend directory structure:

Let me check the root of the backend directory to find the main server file.

I found that this is a Next.js project. Let's list the API routes using the correct approach for Next.js:

Let's check the `pages/api` directory to list all the API routes:

I'll help you list all the API routes in your Next.js backend. Let me examine the main API route files to get a complete list of all available endpoints.

Here are all the available API endpoints in your Next.js backend:

### Auth Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh authentication token

### User Endpoints

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/passengers` - Get all passengers
- `GET /api/users/role/[role]` - Get users by role
- `GET /api/users/passengers/[index]` - Get passenger by index

### Package Endpoints

- `GET /api/packages` - Get all tour packages
- `GET /api/packages/featured` - Get featured packages
- `GET /api/packages/[slug]` - Get package by slug
- `GET /api/packages/region/[region]` - Get packages by region

### Booking Endpoints

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking

### Admin Endpoints

- `GET /api/admin/bookings` - Admin access to all bookings
- `GET /api/admin/dashboard` - Admin dashboard data

### Vehicle Endpoints

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/[id]` - Get vehicle by ID

### Utility Endpoints

- `GET /api/health` - Health check
- `GET /api/docs` - API documentation

To test these endpoints, you can use tools like Postman or curl. For example:

```bash
curl http://localhost:3000/api/health
```

Would you like me to show you the implementation details of any specific endpoint?

I'll scan the backend to understand the current API stack, list available models under `backend/models/`, and inspect existing API routes in `backend/pages/api/` so I can generate consistent controllers, CRUD routes, and middlewares. I'll create a TODO plan first, then open key files.
I'll quickly audit the backend structure and inventory the existing models and API routes to design consistent controllers and middlewares for CRUD. Running parallel directory and file reads for speed.

I'll inspect the backend [src/](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src:0:0-0:0) structure to locate models and any existing middlewares or libs, and open the [pages/api/packages](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/packages:0:0-0:0) routes to see current conventions before adding CRUD. Running directory listings and reading key files in parallel for speed.

I'll open the core model, middleware, and existing API route files in parallel to understand current patterns and avoid duplicating work. This will let me design consistent CRUD controllers and routes.

I'll add controllers for Packages, Bookings, and Users under [backend/src/controllers/](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers:0:0-0:0) and wire up admin CRUD API routes under [backend/pages/api/admin/](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin:0:0-0:0) and resource `[id]` routes, plus a vehicle `[id]` route, following the existing patterns ([adaptExpressRoute](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:35:0-55:1), [withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2)). Creating new files only to avoid overwriting existing work.
I'll add missing controllers for Users and Bookings, plus admin CRUD API routes and a vehicles [id] route, following existing patterns ([withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2), [adaptExpressRoute](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:35:0-55:1)). Then I'll update the existing [admin/bookings.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/bookings.ts:0:0-0:0) to also support POST creation.

I'll add missing controllers and admin CRUD API routes for Users, Bookings, and Packages, plus a vehicle [id] route, and introduce a basic validation middleware. I'll create new files to avoid altering existing ones and follow the existing patterns with [withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2) and [adaptExpressRoute](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:35:0-55:1), calling [connectDB](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/database.ts:8:0-33:1) in the Next.js handlers.
I'll create Next.js API route files to expose CRUD endpoints that adapt the new controllers, using existing middlewares [withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2), [corsMiddleware](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/cors.ts:5:0-55:1), and [connectDB](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/database.ts:8:0-33:1). This will include admin routes for [packages](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/packages:0:0-0:0), [users](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/users:0:0-0:0), and [bookings](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/bookings:0:0-0:0) with `[id]` handlers, plus a `vehicles/[id]` route.

I'll add Next.js API route files to expose admin CRUD for packages, users, and bookings using the new controllers, and a vehicles [id] route. Each handler will apply CORS, connect to MongoDB, and enforce roles via withRole, then call the Express-style controllers through adaptExpressRoute.

I'll create admin CRUD API routes for users and bookings, and a vehicles [id] route, wiring them to the new controllers via adaptExpressRoute and enforcing roles with withRole. I'll also ensure each handler applies CORS and connects to MongoDB.

I'll add the missing admin CRUD [id] route files for bookings and users, and a vehicles [id] route, wiring them to the existing controllers with role-based protection and CORS/DB setup. This avoids modifying existing list endpoints and completes the CRUD surface.
I'll add the missing admin user [id] route and vehicles [id] route, and update the existing [backend/pages/api/admin/bookings.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/bookings.ts:0:0-0:0) to support POST creation via the new controller. This completes CRUD coverage for Users, Packages, Bookings, and Vehicles while following existing middleware and adapter patterns.
I'll update the existing [backend/pages/api/admin/bookings.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/bookings.ts:0:0-0:0) to add POST creation via the new booking controller, and I'll add a `[id]` route under `backend/pages/api/vehicles/[id].ts` for GET/PUT/DELETE using the existing vehicle controller. This aligns with current patterns and completes CRUD coverage.

# Findings

- **Models present**: [backend/src/models/Package.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/Package.ts:0:0-0:0), [User.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/User.ts:0:0-0:0), [Booking.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/Booking.ts:0:0-0:0), [Vehicle.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/Vehicle.ts:0:0-0:0).
- **Middleware present**: [backend/src/middleware/auth.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:0:0-0:0) ([withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2), [authMiddleware](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:12:0-43:2)), [backend/src/middleware/cors.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/cors.ts:0:0-0:0) ([corsMiddleware](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/cors.ts:5:0-55:1)).
- **DB adapter**: [backend/src/lib/database.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/database.ts:0:0-0:0) and Express adapter [backend/src/lib/expressAdapter.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:0:0-0:0).
- **Existing routes**:
  - Public packages: [backend/pages/api/packages/index.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/packages/index.ts:0:0-0:0), `[slug].ts`
  - Bookings (user): [backend/pages/api/bookings/index.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/bookings/index.ts:0:0-0:0)
  - Admin bookings (list): [backend/pages/api/admin/bookings.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/bookings.ts:0:0-0:0)
  - Vehicles: [backend/pages/api/vehicles/index.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/vehicles/index.ts:0:0-0:0), `[id].ts` using `vehicleController`
- **Services**: [backend/src/services/PackagesService.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/services/PackagesService.ts:0:0-0:0), [UsersService.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/services/UsersService.ts:0:0-0:0), [AuthService.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/services/AuthService.ts:0:0-0:0)

# Implemented

- **Controllers (new)**:
  - [backend/src/controllers/packageController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:0:0-0:0)
    - [adminListPackages()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:3:0-27:2)
    - [adminGetPackageById()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:29:0-39:2)
    - [adminCreatePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:41:0-49:2)
    - [adminUpdatePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:51:0-64:2)
    - [adminDeletePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:66:0-76:2)
  - [backend/src/controllers/userController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:0:0-0:0)
    - [adminListUsers()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:4:0-23:2)
    - [adminGetUserById()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:25:0-35:2)
    - [adminCreateUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:37:0-57:2) (hashes password to `passwordHash`)
    - [adminUpdateUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:59:0-77:2) (re-hashes if `password` provided)
    - [adminDeleteUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:79:0-89:2)
  - [backend/src/controllers/bookingController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:0:0-0:0)
    - [adminListBookings()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:3:0-31:2)
    - [adminGetBookingById()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:33:0-45:2)
    - [adminCreateBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:47:0-55:2)
    - [adminUpdateBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:57:0-70:2)
    - [adminDeleteBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:72:0-82:2)

- **Admin API routes (new)**:
  - [backend/pages/api/admin/packages.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/packages.ts:0:0-0:0) (GET list, POST create)
  - `backend/pages/api/admin/packages/[id].ts` (GET by id, PUT update, DELETE)
  - [backend/pages/api/admin/users.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/users.ts:0:0-0:0) (GET list, POST create)
  - `backend/pages/api/admin/users/[id].ts` (GET by id, PUT update, DELETE)
  - `backend/pages/api/admin/bookings/[id].ts` (GET by id, PUT update, DELETE)

- **Admin API route updated**:
  - [backend/pages/api/admin/bookings.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/admin/bookings.ts:0:0-0:0): now also supports POST create using [adminCreateBooking](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:47:0-55:2)

- **Vehicles [id]**: Already existed at `backend/pages/api/vehicles/[id].ts` and correctly wired to `vehicleController` with [withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2) and [adaptExpressRoute](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:35:0-55:1).

All new handlers follow the existing pattern:

- Apply [corsMiddleware](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/cors.ts:5:0-55:1)
- Call [connectDB](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/database.ts:8:0-33:1)
- Protect with [withRole(["admin","super_admin"])](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2)
- Route through [adaptExpressRoute(<controller>)](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:35:0-55:1)

# New Admin Endpoints

- Packages:
  - `GET /api/admin/packages` -> [adminListPackages()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:3:0-27:2)
  - `POST /api/admin/packages` -> [adminCreatePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:41:0-49:2)
  - `GET /api/admin/packages/{id}` -> [adminGetPackageById()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:29:0-39:2)
  - `PUT /api/admin/packages/{id}` -> [adminUpdatePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:51:0-64:2)
  - `DELETE /api/admin/packages/{id}` -> [adminDeletePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:66:0-76:2)

- Users:
  - `GET /api/admin/users` -> [adminListUsers()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:4:0-23:2)
  - `POST /api/admin/users` -> [adminCreateUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:37:0-57:2)
  - `GET /api/admin/users/{id}` -> [adminGetUserById()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:25:0-35:2)
  - `PUT /api/admin/users/{id}` -> [adminUpdateUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:59:0-77:2)
  - `DELETE /api/admin/users/{id}` -> [adminDeleteUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:79:0-89:2)

- Bookings:
  - `GET /api/admin/bookings` -> existing list preserved
  - `POST /api/admin/bookings` -> new [adminCreateBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:47:0-55:2)
  - `GET /api/admin/bookings/{id}` -> [adminGetBookingById()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:33:0-45:2)
  - `PUT /api/admin/bookings/{id}` -> [adminUpdateBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:57:0-70:2)
  - `DELETE /api/admin/bookings/{id}` -> [adminDeleteBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:72:0-82:2)

- Vehicles:
  - Already implemented: `GET/PUT/DELETE/PATCH /api/vehicles/{id}` via `vehicleController` and [adaptExpressRoute](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:35:0-55:1).

# Recommended Actions

- **[validation]** Add DTO validation middleware for create/update routes:
  - Packages: check required fields (title, slug, region, pricing).
  - Users: enforce email/phone formats; ensure role enum.
  - Bookings: enforce passengers array, dates, packageId.
  - Implement either `express-validator` (already in deps) or introduce `zod`.
- **[auth payload]** Confirm [withRole](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2) user payload injection on Next routes. Current pattern wraps the handler correctly; ensure your auth layer populates `req.user`.
- **[OpenAPI]** Update [openapi.yaml](cci:7://file:///d:/tours%20and%20travels/New%20folder/openapi.yaml:0:0-0:0) to include the new admin CRUD endpoints for Packages and Users, and creation endpoint for Admin Bookings.
- **[services alignment]** For Packages, consider routing admin creation/updates via a `PackagesService` method if you want business rules centralized. Currently controllers use models directly (consistent with vehicles).

# TODO Progress

- **Audit backend structure (framework, routing style, existing middlewares)**: completed
- **Inventory data models under [backend/models/](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/models:0:0-0:0)**: completed
- **Design CRUD controller interfaces per model**: in progress (implemented for Packages/Users/Bookings)
- **Create CRUD API routes per model**: in progress (admin routes created; public routes already present)
- **Implement middlewares (auth, validation, error handler)**: pending (auth and CORS exist; validation/error shaping can be added)
- **Wire services (like `PackagesService`) into controllers**: pending (optional refactor)
- **Add validation schemas (Zod/Yup/Joi) for DTOs**: pending
- **Add tests or request examples in [openapi.yaml](cci:7://file:///d:/tours%20and%20travels/New%20folder/openapi.yaml:0:0-0:0) updates**: pending

# Next Steps

- **Confirm desired validation library** (express-validator vs zod). I can add validators per route controller quickly.
- **Extend [openapi.yaml](cci:7://file:///d:/tours%20and%20travels/New%20folder/openapi.yaml:0:0-0:0)** with new admin endpoints.
- **Optional**: Add a centralized error handler shape for controller responses.

Summary: Implemented complete admin CRUD controllers and Next.js API routes for `Packages`, `Users`, and `Bookings`, and enabled POST on `admin/bookings`. Existing vehicles endpoints already cover full CRUD. Pending work: input validation, OpenAPI docs, and optional service-layer refactor.
