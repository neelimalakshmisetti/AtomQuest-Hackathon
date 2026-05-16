# Architecture & Schema Documentation

## High-Level Architecture
The project follows a standard decoupled Full-Stack Architecture pattern:

1. **Client Tier (Frontend)**
   - **Framework**: React.js built with Vite.
   - **Routing**: React Router DOM handles SPA navigation.
   - **Styling**: Tailwind CSS for utility-first styling.
   - **State Management**: Context API (`AuthContext`) manages global authentication state.

2. **Application Tier (Backend)**
   - **Framework**: Node.js with Express.js.
   - **Security**: JWT for stateless authentication; custom middleware for Role-Based Access Control (RBAC).
   - **Controllers**: Thin controllers handling request parsing and response formatting.
   - **Error Handling**: Global error handling middleware intercepts thrown errors and returns consistent JSON error responses.

3. **Data Tier (Database)**
   - **Database**: MongoDB (NoSQL) allows for flexible schemas.
   - **ORM/ODM**: Mongoose manages relationships and schema validations.

## Database Schema Design

### 1. User
Stores authentication and organizational hierarchy data.
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum ('Employee', 'Manager', 'Admin')
- `department`: String
- `managerId`: ObjectId (Ref -> User)

### 2. Goal
Core entity representing an objective.
- `_id`: ObjectId
- `employeeId`: ObjectId (Ref -> User)
- `title`: String
- `description`: String
- `thrustArea`: String
- `uomType`: Enum ('Numeric', 'Percentage', 'Timeline', 'Zero-based')
- `target`: Number
- `weightage`: Number (Must sum to 100 per employee on submit)
- `status`: Enum ('Draft', 'Pending Approval', 'Approved', 'Rejected')
- `progress`: Number (Calculated overall progress)
- `managerComment`: String

### 3. QuarterlyCheckin
Records periodic achievements against a specific goal.
- `_id`: ObjectId
- `goalId`: ObjectId (Ref -> Goal)
- `employeeId`: ObjectId (Ref -> User)
- `quarter`: Enum ('Q1', 'Q2', 'Q3', 'Q4')
- `actualAchievement`: Number
- `status`: Enum ('Not Started', 'On Track', 'Completed')
- `progressPercentage`: Number (Calculated)

### 4. AuditLog
Tracks critical system actions for compliance.
- `_id`: ObjectId
- `action`: String (e.g., 'UPDATE_GOAL', 'STATUS_CHANGE')
- `entityType`: String
- `entityId`: ObjectId
- `performedBy`: ObjectId (Ref -> User)
- `oldValue` / `newValue`: Mixed

### 5. SystemConfig
Stores global settings managed by HR/Admin.
- `currentCycle`: Enum ('Goal Setting', 'Q1', 'Q2', 'Q3', 'Q4')

## Scalability Suggestions
1. **Caching**: Implement Redis to cache frequently accessed data like the User Hierarchy and System Configuration.
2. **Database Indexing**: Add compound indexes on `(employeeId, status)` for faster dashboard queries.
3. **Microservices**: As the application grows, the Notification module and Analytics module can be decoupled into separate services using message queues (e.g., RabbitMQ, Kafka).
