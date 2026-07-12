# Employee Management System

A full-stack Employee Management System with JWT authentication, role-based access control (Admin/Employee), and complete CRUD functionality for employee records.

## Tech Stack

### Backend
- **Django** — web framework
- **Django REST Framework (DRF)** — REST API layer
- **PyMongo** — direct MongoDB driver (no Django ORM)
- **MongoDB** — database (two collections: `users`, `employees`)
- **djangorestframework-simplejwt** — JWT token generation/validation
- **bcrypt** — password hashing
- **django-cors-headers** — CORS handling for the frontend
- **python-dotenv** — environment variable management

### Frontend
- **React 19** + **TypeScript**
- **Vite** — build tool / dev server
- **Redux Toolkit** + **react-redux** — auth/session state management
- **TanStack Query (React Query)** — server-state management (fetching, caching, mutations)
- **React Router** — client-side routing + route protection
- **Axios** — HTTP client
- **Tailwind CSS v4** — styling, custom "deep ocean" light theme

---

## Project Structure

```
employee-management-system/
├── backend/
│   ├── core/                     # Django project settings, root urls
│   ├── employees/
│   │   ├── db.py                 # PyMongo connection (users_collection, employees_collection)
│   │   ├── serializers.py        # EmployeeSerializer
│   │   ├── auth_serializers.py   # UserSerializer, LoginSerializer
│   │   ├── authentication.py     # MongoJWTAuthentication (custom JWT auth for Mongo users)
│   │   ├── auth_views.py         # register, login views
│   │   ├── views.py              # employee_list, employee_detail views
│   │   └── urls.py
│   ├── .env                      # MONGO_URI, MONGO_DB_NAME, SECRET_KEY
│   └── manage.py
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── AxiosInstance.ts  # configured Axios instance + JWT interceptor
    │   │   ├── authApi.ts        # registerUser, loginUser
    │   │   └── employeeApi.ts    # employee CRUD calls
    │   ├── app/
    │   │   ├── store.ts          # Redux store
    │   │   └── hooks.ts          # typed useAppDispatch / useAppSelector
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── authSlice.ts  # Redux slice: user, accessToken, refreshToken
    │   │   │   ├── LoginPage.tsx
    │   │   │   └── RegisterPage.tsx
    │   │   └── employees/
    │   │       ├── EmployeeListPage.tsx
    │   │       ├── EmployeeForm.tsx      # shared create/edit form
    │   │       └── useEmployeeQueries.ts # TanStack Query hooks
    │   ├── components/
    │   │   └── layout/
    │   │       ├── Navbar.tsx
    │   │       └── ProtectedRoute.tsx
    │   ├── App.tsx                # routes
    │   ├── main.tsx                # Redux + React Query providers
    │   └── index.css               # Tailwind + theme tokens
    └── vite.config.ts
```

---

## Architecture Overview

```
┌──────────────────┐        HTTP / JSON        ┌───────────────────┐       PyMongo        ┌─────────────┐
│  React Frontend   │ ◄───────────────────────► │  Django Backend    │ ◄──────────────────► │  MongoDB     │
│  localhost:5173   │          (Axios)          │  localhost:8000    │      (driver)         │  port 27017  │
└──────────────────┘                            └───────────────────┘                       └─────────────┘
```

- MongoDB database: `employee_management_db`
  - `users` collection — login credentials (username, email, hashed password, role)
  - `employees` collection — HR records (name, email, department, role, salary)

These are intentionally separate: a `user` account is a login credential; an `employee` record is a business/HR data entry. They're loosely linked by matching `email`.

---

## Authentication & Token Flow

1. **Login** — client sends `username` + `password` to `/api/auth/login/`. Backend verifies the password against the bcrypt hash stored in MongoDB, then issues a signed JWT `access` + `refresh` token pair (containing `user_id`, `role`, `email` as custom claims).
2. **Storage** — frontend stores `access_token`, `refresh_token`, and `user` in both Redux state and `localStorage` (so login persists across refreshes).
3. **Requests** — an Axios request interceptor automatically attaches `Authorization: Bearer <access_token>` to every outgoing request except `register/` and `login/` (public endpoints).
4. **Verification** — a custom `MongoJWTAuthentication` class (since users live in MongoDB, not Django's built-in SQL user table) decodes the token, looks up the user in MongoDB by `user_id`, and attaches it to `request.user` for use in permission checks.
5. **Expiry** — access tokens expire after 1 hour (`ACCESS_TOKEN_LIFETIME`); refresh tokens after 7 days.

---

## Role-Based Permissions

| Action              | Admin              | Employee                          |
|---------------------|---------------------|------------------------------------|
| View employee list   | All records          | Only their own record              |
| View single record    | Any record            | Only their own record              |
| Create employee       | ✅                    | ❌                                   |
| Update employee       | Any field, any record | Only `name`/`email`, own record only |
| Delete employee       | ✅                    | ❌                                   |

All permission checks are enforced **server-side** in `employees/views.py` — the frontend only mirrors these restrictions in the UI (disabling buttons/fields) for user experience, not as a security boundary.

**Registration:** Public self-registration always forces `role: "employee"` server-side, regardless of what's submitted — admin accounts cannot be created through public sign-up. Existing admin accounts must be created manually (e.g. via `mongosh`) or promoted directly in the database.

---

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install django djangorestframework pymongo djangorestframework-simplejwt django-cors-headers python-dotenv bcrypt
```

Create `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=employee_management_db
SECRET_KEY=your-secret-key-here
```

Ensure MongoDB is running (as a systemd service is recommended for auto-start):
```bash
sudo systemctl enable mongod
sudo systemctl start mongod
```

Run the server:
```bash
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint                    | Auth required | Description                      |
|--------|------------------------------|----------------|-----------------------------------|
| POST   | `/api/auth/register/`        | No             | Register a new user (forced `employee` role) |
| POST   | `/api/auth/login/`           | No             | Log in, returns JWT tokens + user |
| GET    | `/api/auth/list/`            | Yes            | List employees (filtered by role) |
| POST   | `/api/auth/list/`            | Yes (admin)    | Create an employee record         |
| GET    | `/api/auth/<employee_id>/`   | Yes            | Get a single employee record      |
| PUT    | `/api/auth/<employee_id>/`   | Yes            | Update an employee record         |
| DELETE | `/api/auth/<employee_id>/`   | Yes (admin)    | Delete an employee record         |

---

## Notes

- MongoDB `Decimal` values (from DRF's `DecimalField`) are converted to `float` before insertion, since PyMongo/BSON cannot serialize Python's `Decimal` type natively.
- `_id` (MongoDB's ObjectId) is converted to a string in all serializer `to_representation` methods before being returned as JSON.
