# AIRB Employee Management API

Production-grade REST API for employee and partner management with salary tracking and commission monitoring.

## Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8+

### Installation

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create Database**
   ```sql
   CREATE DATABASE airb_employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## API Architecture

### Database Schema

#### Core Entities
- **users** - System users with roles (admin, gestionnaire, lecture_seule)
- **employees** - Employee records with photos
- **partners** - Organizations/Cooperatives employing employees
- **assignments** - Contracts linking employees to partners

#### Financial Tracking
- **salary_settings** - Monthly gross/commission/net salary configurations
- **commission_transactions** - Commission payment history
- **activity_logs** - Audit trail of all modifications

### Authentication

**Google OAuth** (for mobile/web)
```bash
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google-token-from-client"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "lecture_seule",
    "avatarUrl": "url-to-google-avatar"
  }
}
```

**JWT Authentication**
Include token in all protected requests:
```
Authorization: Bearer <jwt-token>
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| admin | All operations + user/role management + deletions |
| gestionnaire | Create, read, update (employees, partners, assignments) |
| lecture_seule | Read-only access |

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/verify` - Verify current token

### Users
- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

### Partners
- `GET /api/partners` - List all partners
- `GET /api/partners/:id` - Get partner details with assignments
- `POST /api/partners` - Create partner
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee with assignments
- `POST /api/employees` - Create employee (with photo upload)
- `PUT /api/employees/:id` - Update employee (with photo upload)
- `DELETE /api/employees/:id` - Delete employee

#### File Upload
```bash
POST /api/employees
Content-Type: multipart/form-data

Form Data:
- firstName: "John"
- lastName: "Doe"
- phone: "+243..."
- origin: "Kinshasa"
- availability: "disponible"
- file: <image-file-5mb-max>
```

### Assignments
- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get assignment with salary history
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

**Create Assignment**
```json
{
  "employeeId": 1,
  "partnerId": 2,
  "contractType": "prestation_mensuelle",
  "startDate": "2026-08-20",
  "durationMonths": 12,
  "renewable": true,
  "status": "actif"
}
```

### Salary Settings
- `GET /api/salary` - List salary settings
- `GET /api/salary/:id` - Get salary detail
- `POST /api/salary` - Create salary setting (auto-calculates net)
- `PUT /api/salary/:id` - Update salary
- `DELETE /api/salary/:id` - Delete salary setting

**Create Salary Setting**
```json
{
  "assignmentId": 1,
  "grossSalary": 2000.00,
  "commissionRate": 15,
  "effectiveMonth": "2026-08-01"
}
```
Response includes auto-calculated:
- `commissionAmount` = grossSalary × (commissionRate / 100)
- `netSalary` = grossSalary - commissionAmount

### Commissions
- `GET /api/commissions` - List all commissions (filterable)
- `GET /api/commissions?partnerId=1&employeeId=2` - Filter commissions
- `GET /api/commissions/summary` - Get commission summary by period
- `POST /api/commissions` - Record commission transaction
- `DELETE /api/commissions/:id` - Delete commission entry

**Query Commission Summary**
```bash
GET /api/commissions/summary?startDate=2026-08-01&endDate=2026-08-31&partnerId=1
```

Response:
```json
{
  "success": true,
  "summary": [
    {
      "period": "mois",
      "totalAmount": 3500.50,
      "count": 5
    }
  ],
  "totalAmount": 3500.50
}
```

### Activity Logs
- `GET /api/activity-logs` - List all activity logs
- `GET /api/activity-logs?entityType=employee&action=creation` - Filter logs
- `GET /api/activity-logs/user/:userId` - Get user's activity
- `GET /api/activity-logs/entity/:entityType/:entityId` - Get entity history
- `GET /api/activity-logs/stats` - Activity statistics

## File Upload

### Supported Formats
- JPEG, PNG, GIF, WebP
- Max file size: 5MB

### Upload Location
Files saved to `/uploads/` directory and served at `http://localhost:5000/uploads/filename`

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "error": "Details (dev mode only)"
}
```

Common status codes:
- 400 - Bad request / missing fields
- 401 - Unauthorized / invalid token
- 403 - Forbidden / insufficient permissions
- 404 - Resource not found
- 500 - Server error

## Environment Variables

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=airb_employee_db

JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id

UPLOADS_DIR=./uploads
```

## Database Relationships

```
User (1) ----< (N) Employee
User (1) ----< (N) ActivityLog

Employee (1) ----< (N) Assignment
Partner (1) ----< (N) Assignment

Assignment (1) ----< (N) SalarySetting
SalarySetting (1) ----< (N) CommissionTransaction

Employee (1) ----< (N) CommissionTransaction
Partner (1) ----< (N) CommissionTransaction
```

## Features

✅ Google OAuth integration
✅ JWT-based authentication
✅ Role-based access control (3 roles)
✅ Employee photo uploads (multer)
✅ Partner photo uploads
✅ Automatic salary calculations
✅ Commission transaction tracking
✅ Comprehensive activity logging
✅ Date range filtering
✅ Aggregation & summary endpoints
✅ MySQL with Sequelize ORM
✅ Production security (helmet, CORS)
✅ Request logging (morgan)
✅ Error handling middleware

## Project Structure

```
├── config/
│   └── database.js          # Sequelize config
├── models/
│   ├── index.js             # Model associations
│   ├── User.js
│   ├── Partner.js
│   ├── Employee.js
│   ├── Assignment.js
│   ├── SalarySetting.js
│   ├── CommissionTransaction.js
│   └── ActivityLog.js
├── controllers/
│   ├── AuthController.js
│   ├── UserController.js
│   ├── PartnerController.js
│   ├── EmployeeController.js
│   ├── AssignmentController.js
│   ├── SalaryController.js
│   ├── CommissionController.js
│   └── ActivityLogController.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── partners.js
│   ├── employees.js
│   ├── assignments.js
│   ├── salary.js
│   ├── commissions.js
│   └── activityLogs.js
├── middleware/
│   ├── auth.js              # JWT + role validation
│   └── upload.js            # Multer config
├── uploads/                 # Avatar storage
├── app.js                   # Express app setup
├── index.js                 # Entry point
├── config.js                # Environment config
└── .env                     # Environment variables
```

## Notes

- All timestamps use UTC timezone
- Salary calculations use DECIMAL(10,2) for precision
- Commission rates stored as percentages (0-100)
- Photos can be replaced on update
- All CRUD operations logged to activity_logs
- Mobile app uses Google auth (no password storage needed)
- Users created via Google auth default to "lecture_seule" role

## Support

For issues or questions, check the route handlers in `/controllers/` for implementation details.
