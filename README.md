---

# 🚗 Vehicle Rental System (Backend)

**Live Deployment:** [rental-vehicle-mu.vercel.app](https://rental-vehicle-mu.vercel.app/)
**GitHub Repository:** [https://github.com/SajidSojib/vehicle-rental-system-backend](https://github.com/SajidSojib/vehicle-rental-system-backend)

---

## 🎯 Project Overview

The Vehicle Rental System is a backend API for managing a vehicle rental service. It allows admins to manage vehicles, users, and bookings, and enables customers to create and manage their bookings. The system includes secure role-based authentication and automatic booking management.

**Key Features:**

* **Vehicles:** Add, update, view, and delete vehicles with availability tracking.
* **Users:** Manage customer accounts with role-based access control (Admin & Customer roles).
* **Bookings:** Create, update, view, cancel, and auto-return bookings with total price calculation.
* **Authentication:** Secure password hashing and JWT-based login.
* **Authorization:** Role-based access for Admin and Customer functionalities.

---

## 🛠️ Technology Stack

* **Backend:** Node.js + TypeScript
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Authentication:** bcryptjs for password hashing, jsonwebtoken for JWT
* **Development Tools:** tsx, TypeScript

---

## 📁 Code Structure

The project follows a **modular architecture** with feature-based separation:

```
src/
├── app.ts            # Express app initialization
├── server.ts         # Server entry point
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.route.ts
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.route.ts
│   ├── vehicles/
│   │   ├── vehicle.controller.ts
│   │   ├── vehicle.service.ts
│   │   └── vehicle.route.ts
│   └── bookings/
│       ├── booking.controller.ts
│       ├── booking.service.ts
│       └── booking.route.ts
├── config/
│   ├── db.ts         # Database connection
│   └── index.ts      
└── utils/            # Utility Functions
        ├── changeVehicleAvailability.ts
        ├── getCustomer.ts
        ├── getTotalPrice.ts
        ├── getVehicle.ts
        └── perseDate.ts
```

Each module contains **routes**, **controllers**, and **services** for clear separation of concerns.

---

## 📊 Database Schema

### Users Table

| Field    | Type   | Notes                       |
| -------- | ------ | --------------------------- |
| id       | Serial | Auto-generated              |
| name     | String | Required                    |
| email    | String | Required, unique, lowercase |
| password | String | Required, min 6 characters  |
| phone    | String | Required                    |
| role     | String | 'admin' or 'customer'       |

### Vehicles Table

| Field               | Type   | Notes                       |
| ------------------- | ------ | --------------------------- |
| id                  | Serial | Auto-generated              |
| vehicle_name        | String | Required                    |
| type                | String | 'car', 'bike', 'van', 'SUV' |
| registration_number | String | Required, unique            |
| daily_rent_price    | Number | Required, positive          |
| availability_status | String | 'available' or 'booked'     |

### Bookings Table

| Field           | Type   | Notes                                |
| --------------- | ------ | ------------------------------------ |
| id              | Serial | Auto-generated                       |
| customer_id     | Int    | Foreign key to Users table           |
| vehicle_id      | Int    | Foreign key to Vehicles table        |
| rent_start_date | Date   | Required                             |
| rent_end_date   | Date   | Required, must be after start date   |
| total_price     | Number | Required, positive                   |
| status          | String | 'active', 'cancelled', or 'returned' |

---

## 🔐 Authentication & Authorization

* **Admin:** Full access to manage vehicles, users, and all bookings.
* **Customer:** Can register, view vehicles, and manage own bookings.
* **Flow:**

  * Passwords are hashed using `bcryptjs`.
  * Login via `/api/v1/auth/signin` provides JWT token.
  * Protected endpoints require `Authorization: Bearer <token>` header.
  * Role checks ensure proper access (401 Unauthorized / 403 Forbidden).

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint            | Access | Description               |
| ------ | ------------------- | ------ | ------------------------- |
| POST   | /api/v1/auth/signup | Public | Register new user         |
| POST   | /api/v1/auth/signin | Public | Login & receive JWT token |

### Vehicles

| Method | Endpoint                    | Access | Description                          |
| ------ | --------------------------- | ------ | ------------------------------------ |
| POST   | /api/v1/vehicles            | Admin  | Add new vehicle                      |
| GET    | /api/v1/vehicles            | Public | Get all vehicles                     |
| GET    | /api/v1/vehicles/:vehicleId | Public | Get vehicle by ID                    |
| PUT    | /api/v1/vehicles/:vehicleId | Admin  | Update vehicle details               |
| DELETE | /api/v1/vehicles/:vehicleId | Admin  | Delete vehicle if no active bookings |

### Users

| Method | Endpoint              | Access    | Description                       |
| ------ | --------------------- | --------- | --------------------------------- |
| GET    | /api/v1/users         | Admin     | Get all users                     |
| PUT    | /api/v1/users/:userId | Admin/Own | Update user info                  |
| DELETE | /api/v1/users/:userId | Admin     | Delete user if no active bookings |

### Bookings

| Method | Endpoint                    | Access         | Description                                |
| ------ | --------------------------- | -------------- | ------------------------------------------ |
| POST   | /api/v1/bookings            | Customer/Admin | Create booking with auto price calculation |
| GET    | /api/v1/bookings            | Role-based     | Admin sees all, Customer sees own          |
| PUT    | /api/v1/bookings/:bookingId | Role-based     | Cancel (Customer) or Return (Admin)        |


---

## ⚙️ Setup & Usage

1. **Clone the repository**

```bash
git clone https://github.com/SajidSojib/vehicle-rental-system-backend.git
cd vehicle-rental-system-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create `.env` file with:

```
CONNECTION_STRING=postgresql://<username>:<password>@<host>/<db>?sslmode=require&channel_binding=require
JWT_SECRET=<your_jwt_secret>
```

4. **Run in development mode**

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
```

---

