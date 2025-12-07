# 🚗 Vehicle Rental System (Backend)

**Live Deployment:** [rental-vehicle-mu.vercel.app](https://rental-vehicle-mu.vercel.app/)
**GitHub Repository:** [https://github.com/SajidSojib/vehicle-rental-system-backend](https://github.com/SajidSojib/vehicle-rental-system-backend)

---

## 🎯 Project Overview

The Vehicle Rental System is a backend API for managing a vehicle rental service. It allows admins to manage vehicles, users, and bookings, and enables customers to create and manage their bookings. The system includes secure role-based authentication and automatic booking management.

---

## 🌟 Features

### 1. **User Management**

* **Customer Accounts**: Users can create accounts, login securely, and update their personal information like name, phone number, and email.
* **Admin Controls**: Admins can manage all users in the system, change roles (admin or customer), and delete accounts if necessary.
* **Access Control**: Only authorized users can perform certain actions. For example, only admins can delete vehicles or see all users.

### 2. **Vehicle Inventory Management**

* **Add & Update Vehicles**: Admins can add new vehicles with details like type, registration number, and daily rental price. They can also update information if anything changes.
* **Availability Tracking**: The system tracks whether a vehicle is available for rent or already booked. Customers can only book available vehicles.
* **Vehicle Types**: Supports multiple vehicle types like cars, bikes, vans, and SUVs, making it easy to filter and find the right vehicle.

### 3. **Booking & Rental System**

* **Easy Booking**: Customers can book vehicles for a chosen date range. The system automatically calculates the total cost based on daily rental rates.
* **Booking Status**: Bookings have statuses like `active`, `cancelled`, or `returned`.
* **Automatic Updates**: When a booking is created, the vehicle status changes to `booked`. When a booking ends or is cancelled, the vehicle becomes `available` again.
* **Admin Booking Controls**: Admins can view all bookings, update statuses, and mark vehicles as returned after rental.

### 4. **Secure Authentication**

* **Password Security**: User passwords are encrypted using `bcryptjs` to prevent unauthorized access.
* **JWT Tokens**: After login, users receive a secure token that must be included in requests to protected routes.
* **Role-Based Access**: Customers can only manage their own data and bookings. Admins have full access to manage the system.

### 5. **Data Validation & Error Handling**

* **Input Checks**: Ensures user-provided information is correct, e.g., valid email, minimum password length, and proper booking dates.
* **Consistent Responses**: API responses follow a standard format, so it’s easy to handle success and error messages on the client side.

### 6. **Modular & Scalable Architecture**

* **Feature-Based Modules**: Code is organized into modules like Users, Vehicles, Bookings, and Auth. Each module has its own routes, controllers, and services.
* **Easy to Extend**: New features or modules can be added without affecting existing code, keeping the system maintainable.

### 7. **Admin Dashboard Ready**

* **System Overview**: Admins can see all users, vehicles, and bookings in one place.
* **Quick Actions**: Admins can quickly update vehicle availability, cancel bookings, or change user roles.

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

## 🔐 Authentication & Authorization

* **Admin:** Full access to manage vehicles, users, and all bookings.
* **Customer:** Can register, view vehicles, and manage own bookings.
* **Flow:**

  * Passwords are hashed using `bcryptjs`.
  * Login via `/api/v1/auth/signin` provides JWT token.
  * Protected endpoints require `Authorization: Bearer <token>` header.
  * Role checks ensure proper access (401 Unauthorized / 403 Forbidden).

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

