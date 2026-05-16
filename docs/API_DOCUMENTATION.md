# API Documentation

Base URL: `http://localhost:5000/api`

All endpoints (except `/auth/login` and `/auth/register`) require an `Authorization` header with a valid JWT token: `Authorization: Bearer <token>`

---

## 1. Authentication APIs

### `POST /auth/register`
- **Description**: Register a new user.
- **Access**: Public
- **Body**: `{ name, email, password, role, department, managerId }`

### `POST /auth/login`
- **Description**: Authenticate user and get token.
- **Access**: Public
- **Body**: `{ email, password }`
- **Response**: `{ _id, name, email, role, token }`

### `GET /auth/me`
- **Description**: Get current user data.
- **Access**: Private

---

## 2. Goal APIs

### `GET /goals`
- **Description**: Get goals. Employees get their own. Managers get team goals. Admins get all.
- **Access**: Private

### `POST /goals`
- **Description**: Create a draft goal.
- **Access**: Private (Employee)
- **Body**: `{ title, description, thrustArea, uomType, target, weightage }`

### `POST /goals/submit`
- **Description**: Submit all draft goals for approval. Validates weightage = 100%.
- **Access**: Private (Employee)

### `PUT /goals/:id/status`
- **Description**: Approve or reject a goal.
- **Access**: Private (Manager)
- **Body**: `{ status: 'Approved' | 'Rejected', managerComment }`

---

## 3. Check-in APIs

### `POST /checkins`
- **Description**: Submit quarterly check-in for a goal.
- **Access**: Private (Employee)
- **Body**: `{ goalId, quarter, actualAchievement, status }`

### `GET /checkins/:goalId`
- **Description**: Get check-in history for a goal.
- **Access**: Private

---

## 4. Admin APIs

### `GET /admin/config`
- **Description**: Get system cycle configuration.
- **Access**: Private (Admin)

### `PUT /admin/config`
- **Description**: Update system cycle phase.
- **Access**: Private (Admin)
- **Body**: `{ currentCycle }`

### `GET /admin/audit-logs`
- **Description**: Get system audit logs.
- **Access**: Private (Admin)
