# Smart Hostel API - Route Testing & Verification Specification

Comprehensive route testing documentation and verification manual for the **Smart Hostel Management System**.

- **Branch**: `sourabh`
- **Base URL**: `http://localhost:5001`
- **Frontend Console URL**: `http://localhost:5173`
- **Default Environment**: `development`

---

## 1. Route Summary Table

| Endpoint | Method | Access Level | Description | Rate Limiting |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/health` | `GET` | Public | System status and environment heartbeat | 100 req / 15 min |
| `/api/v1/test` | `GET` | Public | General API connectivity test route | 100 req / 15 min |
| `/api/v1/auth/test` | `GET` | Public | Auth subsystem development test route | 100 req / 15 min |
| `/api/v1/auth/register` | `POST` | Public | Student account registration | 5 attempts / IP / hr |
| `/api/v1/auth/login` | `POST` | Public | User authentication & HTTP-Only cookie issue | 10 failed / IP / 15 min |
| `/api/v1/auth/profile-check` | `GET` | Authenticated | JWT session verification | 100 req / 15 min |
| `/api/v1/auth/warden-check` | `GET` | Warden / Admin | Role-based authorization check | 100 req / 15 min |

---

## 2. Test Scenarios & Detailed Verification

### Test 1: API Health Check (`GET /api/v1/health`)
Verifies that the Express application is running and responding.

- **Request**:
  ```bash
  curl -X GET http://localhost:5001/api/v1/health
  ```
  *PowerShell alternative:*
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5001/api/v1/health" -Method Get
  ```

- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Smart Hostel API is running",
    "environment": "development"
  }
  ```

---

### Test 2: General API Test Route (`GET /api/v1/test`)
Tests base routing functionality.

- **Request**:
  ```bash
  curl -X GET http://localhost:5001/api/v1/test
  ```
  *PowerShell alternative:*
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5001/api/v1/test" -Method Get
  ```

- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Smart Hostel API test route is running successfully",
    "environment": "development",
    "timestamp": "2026-10-12T01:10:00.000Z"
  }
  ```

---

### Test 3: Auth Subsystem Test Route (`GET /api/v1/auth/test`)
Verifies that the `/api/v1/auth` router is mounted and accessible in development.

- **Request**:
  ```bash
  curl -X GET http://localhost:5001/api/v1/auth/test
  ```
  *PowerShell alternative:*
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5001/api/v1/auth/test" -Method Get
  ```

- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Auth module test route is working successfully",
    "data": null
  }
  ```

---

### Test 4: Student Registration (`POST /api/v1/auth/register`)

#### Case 4A: Successful Registration
Registers a new student account with valid fields matching the Zod schema.

- **Request**:
  ```bash
  curl -X POST http://localhost:5001/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Sourabh Sharma",
      "email": "sourabh@example.com",
      "password": "Password@123",
      "phone": "+919876543210"
    }'
  ```
  *PowerShell alternative:*
  ```powershell
  $body = @{
    name = "Sourabh Sharma"
    email = "sourabh@example.com"
    password = "Password@123"
    phone = "+919876543210"
  } | ConvertTo-Json

  Invoke-RestMethod -Uri "http://localhost:5001/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json"
  ```

- **Expected Status**: `201 Created`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Student registered successfully",
    "data": {
      "user": {
        "id": "675ab...",
        "name": "Sourabh Sharma",
        "email": "sourabh@example.com",
        "phone": "+919876543210",
        "role": "student",
        "isActive": true
      }
    }
  }
  ```

#### Case 4B: Schema Validation Failure
Sends invalid fields (e.g., short password or invalid email format).

- **Request Body**:
  ```json
  {
    "name": "S",
    "email": "notanemail",
    "password": "123"
  }
  ```
- **Expected Status**: `400 Bad Request`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Request validation failed",
    "errors": [
      {
        "field": "name",
        "message": "Name must have at least 2 characters"
      },
      {
        "field": "email",
        "message": "Invalid email address"
      },
      {
        "field": "password",
        "message": "Password must have at least 8 characters"
      }
    ]
  }
  ```

#### Case 4C: Duplicate Email
Re-registering with the same email.

- **Expected Status**: `409 Conflict`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Email is already registered"
  }
  ```

---

### Test 5: User Login (`POST /api/v1/auth/login`)

#### Case 5A: Successful Login
Authenticates and returns an HTTP-Only session cookie.

- **Request**:
  ```bash
  curl -i -X POST http://localhost:5001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -c cookies.txt \
    -d '{
      "email": "sourabh@example.com",
      "password": "Password@123"
    }'
  ```

- **Expected Status**: `200 OK`
- **Expected Headers**:
  `Set-Cookie: accessToken=eyJhbGciOi...; Path=/; HttpOnly; SameSite=Lax`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "name": "Sourabh Sharma",
        "email": "sourabh@example.com",
        "role": "student"
      }
    }
  }
  ```

#### Case 5B: Invalid Credentials
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

---

### Test 6: Authenticated Profile Check (`GET /api/v1/auth/profile-check`)

#### Case 6A: Authenticated Request with Session Cookie
- **Request**:
  ```bash
  curl -X GET http://localhost:5001/api/v1/auth/profile-check -b cookies.txt
  ```
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "user": {
        "id": "675ab...",
        "name": "Sourabh Sharma",
        "email": "sourabh@example.com",
        "role": "student"
      }
    }
  }
  ```

#### Case 6B: Unauthenticated Request (No Cookie)
- **Request**:
  ```bash
  curl -X GET http://localhost:5001/api/v1/auth/profile-check
  ```
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Authentication required. Please login."
  }
  ```

---

### Test 7: Role Authorization Check (`GET /api/v1/auth/warden-check`)

#### Case 7A: Student Role (Forbidden)
- **Expected Status**: `403 Forbidden`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "You do not have permission to access this resource"
  }
  ```

#### Case 7B: Warden or Admin Role (Authorized)
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Authorization successful",
    "data": {
      "user": {
        "role": "warden"
      }
    }
  }
  ```

---

### Test 8: Unknown Route Handling (`GET /api/v1/undefined-endpoint`)
Verifies standard `notFound.middleware.js` 404 response.

- **Request**:
  ```bash
  curl -X GET http://localhost:5001/api/v1/undefined-endpoint
  ```
- **Expected Status**: `404 Not Found`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Cannot GET /api/v1/undefined-endpoint"
  }
  ```

---

### Test 9: Rate Limiting Enforcement (`429 Too Many Requests`)
- Sending more than 5 rapid registration attempts triggers `registerLimiter`.
- Sending more than 10 bad login attempts triggers `loginLimiter`.

- **Expected Status**: `429 Too Many Requests`
- **Expected Response**:
  ```json
  {
    "success": false,
    "message": "Too many requests. Please try again later."
  }
  ```

---

## 3. How to Run the Automated Test Suite

A standalone test runner script is included at [`server/scripts/testRoutes.js`](file:///c:/Users/soura/Desktop/SmartHostel-/server/scripts/testRoutes.js).

To execute the test script:
```bash
# From workspace root:
node server/scripts/testRoutes.js

# Or using npm:
npm run test:routes
```

---

## 4. How to Test via the React Client Console

1. Start the client application:
   ```bash
   cd client
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.
3. Select any endpoint from the left-hand panel (Health check, General test route, Auth test route, Register, Login, Profile check, Warden check).
4. Click **Send** to inspect real-time response payload, status codes, and execution latency.
