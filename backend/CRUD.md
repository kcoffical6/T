# How to Create and Update: Endpoints and Example Data

Below are concise, working examples to create and update all key resources. Admin CRUD routes are protected by [withRole(["admin","super_admin"])](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/middleware/auth.ts:45:0-77:2) and expect an Authorization header. See handlers under:

- `backend/pages/api/admin/packages*.ts`
- `backend/pages/api/admin/users*.ts`
- `backend/pages/api/admin/bookings*.ts`
- Vehicles admin endpoints already exist: `backend/pages/api/vehicles/[id].ts`, [backend/pages/api/vehicles/index.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/vehicles/index.ts:0:0-0:0)

Use a valid admin JWT:

- Header: `Authorization: Bearer <token>`

## Packages

Models: [backend/src/models/Package.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/Package.ts:0:0-0:0)
Admin Controller: [backend/src/controllers/packageController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:0:0-0:0)

- Create: `POST /api/admin/packages` calls [adminCreatePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:41:0-50:2)
- Update: `PUT /api/admin/packages/{id}` calls [adminUpdatePackage()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:51:0-64:2)

Example create body:

```json
{
  "title": "Munnar Getaway 3D2N",
  "slug": "munnar-getaway-3d2n",
  "shortDesc": "Tea gardens and misty hills",
  "longDesc": "Detailed itinerary and inclusions...",
  "itinerary": [
    {
      "day": 1,
      "activities": ["Arrival", "Tea Museum"],
      "meals": ["Breakfast"]
    },
    { "day": 2, "activities": ["Eravikulam NP"], "meals": ["Breakfast"] },
    { "day": 3, "activities": ["Shopping", "Depart"], "meals": [] }
  ],
  "minPax": 2,
  "maxPax": 10,
  "basePricePerPax": 6500,
  "images": ["https://cdn/img1.jpg"],
  "region": "kerala",
  "tags": ["family", "nature"],
  "featured": true,
  "inclusions": ["Breakfast", "Sightseeing"],
  "exclusions": ["Flights"],
  "cancellationPolicy": "Free cancel 7 days prior",
  "termsAndConditions": "Standard T&C",
  "commissionOverride": 8,
  "isActive": true
}
```

Example update (by ID):

```json
{
  "title": "Munnar Getaway 3D2N - Updated",
  "basePricePerPax": 6800,
  "featured": false
}
```

Notes:

- `slug` must be unique. Indices: `slug`, [region](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/packages/region:0:0-0:0), `featured`, `isActive`, text index on `title/shortDesc/longDesc`.
- `minPax/maxPax/basePricePerPax` must be numeric; [region](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/packages/region:0:0-0:0) enum enforced.

## Users

Models: [backend/src/models/User.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/User.ts:0:0-0:0)
Admin Controller: [backend/src/controllers/userController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:0:0-0:0)

- Create: `POST /api/admin/users` calls [adminCreateUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:37:0-57:2)
- Update: `PUT /api/admin/users/{id}` calls [adminUpdateUser()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:59:0-77:2)

Example create body:

```json
{
  "name": "Priya Admin",
  "email": "priya.admin@example.com",
  "phone": "9998887777",
  "country": "IN",
  "password": "StrongPassword@123",
  "role": "admin"
}
```

Example update (by ID):

```json
{
  "name": "Priya A.",
  "role": "super_admin",
  "password": "NewStrongPassword@123"
}
```

Notes:

- Controller hashes `password` to `passwordHash`. Unique indices on `email`, `phone`. `role` enum: `user|admin|super_admin|driver`.

## Bookings

Models: [backend/src/models/Booking.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/Booking.ts:0:0-0:0)
Admin Controller: [backend/src/controllers/bookingController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:0:0-0:0)

- Create: `POST /api/admin/bookings` calls [adminCreateBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:47:0-55:2)
- Update: `PUT /api/admin/bookings/{id}` calls [adminUpdateBooking()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:57:0-70:2)

Example create body:

```json
{
  "userId": "66f2b2c6c8ab8c6c8f1a1234",
  "packageId": "66f2b310c8ab8c6c8f1a5678",
  "passengers": [
    { "name": "Arun", "age": 30 },
    { "name": "Meera", "age": 28, "passport": "P1234567" }
  ],
  "totalAmount": 13000,
  "status": "pending",
  "paymentStatus": "pending",
  "bookingDate": "2025-10-21T09:00:00.000Z",
  "travelDate": "2025-11-02T05:30:00.000Z",
  "specialRequests": "Anniversary decoration"
}
```

Example update (by ID):

```json
{
  "status": "approved",
  "paymentStatus": "paid",
  "totalAmount": 13500
}
```

Notes:

- Enums: [status](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/lib/expressAdapter.ts:16:6-19:8) (pending|approved|rejected|cancelled|completed), `paymentStatus` (pending|paid|refunded).
- Dates must be ISO strings.

## Vehicles

Models: [backend/src/models/Vehicle.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/models/Vehicle.ts:0:0-0:0)
Controller: [backend/src/controllers/vehicleController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/vehicleController.ts:0:0-0:0)

- Create (admin): `POST /api/vehicles` via [backend/pages/api/vehicles/index.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/pages/api/vehicles/index.ts:0:0-0:0) → [createVehicle()](cci:1://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/vehicleController.ts:3:0-126:2)
- Get/Update/Delete: `GET|PUT|DELETE /api/vehicles/{id}` → `getVehicleById|updateVehicle|deleteVehicle`
- Toggle availability: `PATCH /api/vehicles/{id}?action=toggle-availability`

Example create body:

```json
{
  "make": "Toyota",
  "model": "Innova Crysta",
  "year": 2023,
  "type": "suv",
  "seatingCapacity": 7,
  "features": ["AC", "Music", "Captain Seats"],
  "description": "Comfortable family SUV",
  "images": ["https://cdn/innova1.jpg"],
  "isAvailable": true,
  "basePricePerDay": 4500,
  "driver": {
    "name": "Suresh",
    "mobile": "9876543210",
    "experience": 8,
    "licenseNumber": "TN99A1234567"
  }
}
```

Example update (by ID):

```json
{
  "isAvailable": false,
  "basePricePerDay": 4800,
  "driver": { "experience": 9 }
}
```

Notes:

- Validations in [vehicleController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/vehicleController.ts:0:0-0:0) and schema: year range, feature/image limits, driver fields.

## Curl Examples

- Create package:

```bash
curl -X POST http://localhost:3000/api/admin/packages \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{ "title":"Munnar Getaway 3D2N", "slug":"munnar-getaway-3d2n", "shortDesc":"Tea gardens", "longDesc":"...", "itinerary":[{"day":1,"activities":["Arrival"],"meals":["Breakfast"]}], "minPax":2, "maxPax":10, "basePricePerPax":6500, "images":[], "region":"kerala", "tags":[], "featured":true, "inclusions":[], "exclusions":[], "isActive":true }'
```

- Update package:

```bash
curl -X PUT http://localhost:3000/api/admin/packages/<PACKAGE_ID> \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{ "basePricePerPax": 6800, "featured": false }'
```

- Create user:

```bash
curl -X POST http://localhost:3000/api/admin/users \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{ "name":"Priya Admin","email":"priya.admin@example.com","phone":"9998887777","country":"IN","password":"StrongPassword@123","role":"admin" }'
```

- Create booking:

```bash
curl -X POST http://localhost:3000/api/admin/bookings \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{ "userId":"66f2b2c6c8ab8c6c8f1a1234","packageId":"66f2b310c8ab8c6c8f1a5678","passengers":[{"name":"Arun","age":30}],"totalAmount":10000,"bookingDate":"2025-10-21T09:00:00.000Z","travelDate":"2025-11-02T05:30:00.000Z" }'
```

- Create vehicle:

```bash
curl -X POST http://localhost:3000/api/vehicles \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $TOKEN" \
 -d '{ "make":"Toyota","model":"Innova Crysta","year":2023,"type":"suv","seatingCapacity":7,"features":["AC"],"description":"...","images":[],"isAvailable":true,"basePricePerDay":4500,"driver":{"name":"Suresh","mobile":"9876543210","experience":8,"licenseNumber":"TN99A1234567"} }'
```

# Where This Is Implemented

- Packages CRUD: [backend/src/controllers/packageController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/packageController.ts:0:0-0:0), routes in `backend/pages/api/admin/packages*.ts`
- Users CRUD: [backend/src/controllers/userController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/userController.ts:0:0-0:0), routes in `backend/pages/api/admin/users*.ts`
- Bookings CRUD: [backend/src/controllers/bookingController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/bookingController.ts:0:0-0:0), routes in `backend/pages/api/admin/bookings*.ts`
- Vehicles CRUD: [backend/src/controllers/vehicleController.ts](cci:7://file:///d:/tours%20and%20travels/New%20folder/backend/src/controllers/vehicleController.ts:0:0-0:0), routes in `backend/pages/api/vehicles/*.ts`

# Recommended Actions

- **[validation]** Add request validation for create/update to prevent bad data.
- **[docs]** Update [openapi.yaml](cci:7://file:///d:/tours%20and%20travels/New%20folder/openapi.yaml:0:0-0:0) for new admin endpoints so frontend can consume them easily.
- **[uniqueness]** Ensure unique `slug` for packages before create; handle duplicate key errors gracefully.

Summary: You can create/update Packages, Users, Bookings, and Vehicles via the admin endpoints above using the example JSON bodies. Controllers and routes are already in place and protected via role-based middleware.
