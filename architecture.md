# Gym Trainer & Discovery Platform - System Architecture

## 🎯 Project Overview
A multi-role platform connecting gym members, trainers, and gym owners with built-in test automation support.

---

## 📦 Module Breakdown

### Module 1: User Module (Gym Members)
**Responsibilities:**
- Search and filter gyms by location, facilities, pricing
- Browse trainer profiles with ratings and specializations
- Request trainer sessions
- View booking history
- Rate and review trainers

**Key Entities:**
- User Profile (name, email, password, location, fitness goals)
- Booking Request (userId, trainerId, gymId, date, status)
- Review (userId, trainerId, rating, comment)

---

### Module 2: Trainer Module
**Responsibilities:**
- Create and manage trainer profile (bio, certifications, specializations)
- Apply to gyms (submit applications)
- View and respond to user booking requests
- Manage availability schedule
- View earnings/session history

**Key Entities:**
- Trainer Profile (userId, certifications, specializations, experience, hourlyRate)
- Application (trainerId, gymId, status, appliedDate)
- Availability (trainerId, dayOfWeek, timeSlots)

---

### Module 3: Gym Owner Module
**Responsibilities:**
- Register and manage gym details
- Post trainer requirements/job listings
- Review and approve/reject trainer applications
- Manage gym facilities and pricing
- View analytics (bookings, revenue, ratings)

**Key Entities:**
- Gym Profile (ownerId, name, address, facilities, pricing, photos)
- Job Posting (gymId, requirements, salary, status)
- Gym-Trainer Relationship (gymId, trainerId, status, joinDate)

---

### Module 4: Admin Module
**Responsibilities:**
- Verify gym owner registrations
- Monitor platform activity
- Handle disputes and reports
- Manage user/trainer/gym suspensions
- View platform-wide analytics

**Key Entities:**
- Admin User (adminId, permissions, role)
- Report (reporterId, reportedId, type, status, resolution)
- Audit Log (action, userId, timestamp, details)

---

## 🏗️ System Architecture

### Architecture Diagram (3-Tier)

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  User    │  │ Trainer  │  │   Gym    │  │  Admin  │ │
│  │  Pages   │  │  Pages   │  │  Owner   │  │  Panel  │ │
│  │          │  │          │  │  Pages   │  │         │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │             │             │             │       │
│       └─────────────┴─────────────┴─────────────┘       │
│                         │                                │
│              HTML/CSS/JavaScript                         │
└─────────────────────────┼───────────────────────────────┘
                          │
                  REST API (JSON)
                          │
┌─────────────────────────┼───────────────────────────────┐
│                    BACKEND LAYER                         │
│                   Node.js + Express                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API Routes & Controllers             │   │
│  │  /api/users  /api/trainers  /api/gyms  /api/admin│   │
│  └───────────────────┬──────────────────────────────┘   │
│                      │                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Business Logic Layer                    │   │
│  │  - Authentication (JWT)                           │   │
│  │  - Authorization (Role-based)                     │   │
│  │  - Validation & Error Handling                    │   │
│  └───────────────────┬──────────────────────────────┘   │
│                      │                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Database Access Layer (DAL)             │   │
│  │  - Mongoose Models & Schemas                      │   │
│  │  - Query Builders                                 │   │
│  └───────────────────┬──────────────────────────────┘   │
└──────────────────────┼───────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────────┐
│                 DATABASE LAYER                           │
│                    MongoDB                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐   │
│  │  users  │  │trainers │  │  gyms   │  │ bookings │   │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐   │
│  │ reviews │  │  jobs   │  │ reports │  │auditlogs │   │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Key Workflows

### Workflow 1: User Books a Trainer
```
1. User logs in → JWT token stored
2. User searches gyms → GET /api/gyms?location=XX&facilities=YY
3. User views gym details → GET /api/gyms/:gymId
4. User browses trainers at gym → GET /api/trainers?gymId=XX
5. User views trainer profile → GET /api/trainers/:trainerId
6. User requests booking → POST /api/bookings
   Body: { trainerId, gymId, date, timeSlot }
7. System validates availability → Check trainer schedule
8. Booking created with status "pending"
9. Trainer receives notification
10. Trainer approves → PATCH /api/bookings/:bookingId
11. User receives confirmation
```

**Testing Points:** Login authentication, search filters, booking creation, status updates, notifications

---

### Workflow 2: Trainer Applies to Gym
```
1. Trainer logs in
2. Trainer creates/updates profile → POST/PUT /api/trainers/profile
3. Trainer searches gyms → GET /api/gyms
4. Trainer views job postings → GET /api/jobs?gymId=XX
5. Trainer submits application → POST /api/applications
   Body: { trainerId, gymId, jobId, coverLetter }
6. System validates trainer profile completeness
7. Application status set to "pending"
8. Gym owner receives notification
9. Gym owner reviews application → GET /api/applications/:id
10. Gym owner approves/rejects → PATCH /api/applications/:id
11. Trainer receives notification
12. If approved: Trainer added to gym's trainer list
```

**Testing Points:** Profile validation, application submission, approval workflow, notification delivery

---

### Workflow 3: Gym Owner Posts Job & Hires
```
1. Gym owner registers → POST /api/auth/register (role: gymOwner)
2. Admin verifies gym owner → PATCH /api/admin/verify/:userId
3. Gym owner creates gym profile → POST /api/gyms
4. Gym owner posts job listing → POST /api/jobs
   Body: { gymId, title, requirements, salary, description }
5. System publishes job (visible to trainers)
6. Gym owner receives applications
7. Gym owner reviews applicants → GET /api/applications?gymId=XX
8. Gym owner approves trainer → PATCH /api/applications/:id
9. Gym-Trainer relationship created
10. Trainer can now accept bookings at this gym
```

**Testing Points:** Registration flow, admin verification, job posting, application review, relationship creation

---

### Workflow 4: Admin Handles Report
```
1. User/Trainer/Owner submits report → POST /api/reports
   Body: { reporterId, reportedId, type, description }
2. Admin views all reports → GET /api/admin/reports
3. Admin investigates report details → GET /api/admin/reports/:id
4. Admin takes action:
   - Warning → POST /api/admin/warnings
   - Suspension → PATCH /api/admin/users/:id/suspend
   - Ban → DELETE /api/admin/users/:id
5. Admin updates report status → PATCH /api/reports/:id
6. Affected parties receive notifications
7. Action logged in audit log
```

**Testing Points:** Report submission, admin dashboard access, moderation actions, audit trail

---

## 🧪 End-to-End Testing Strategy

### Why This System is Ideal for Test Automation

**1. Multiple User Journeys**
- Each role (User, Trainer, Gym Owner, Admin) has distinct workflows
- Perfect for role-based testing scenarios

**2. Rich API Surface**
- RESTful APIs with predictable endpoints
- Easy to test with Selenium (UI) + API validation

**3. State Transitions**
- Bookings: pending → approved → completed
- Applications: submitted → reviewed → accepted/rejected
- Perfect for state machine testing

**4. Data Dependencies**
- User depends on Gym, Gym depends on Trainer, etc.
- Great for testing data integrity and cascading effects

---

### Testing Approach with Selenium/Cypress

#### Test Suite Structure

**1. Smoke Tests (Critical Path)**
```javascript
// Example Cypress test
describe('Critical User Journeys', () => {
  it('User can search gym and book trainer', () => {
    cy.login('user@test.com', 'password123')
    cy.get('[data-testid="search-location"]').type('New York')
    cy.get('[data-testid="search-btn"]').click()
    cy.get('[data-testid="gym-card"]').first().click()
    cy.get('[data-testid="trainer-list"]').should('be.visible')
    cy.get('[data-testid="book-btn"]').first().click()
    cy.get('[data-testid="booking-confirmation"]').should('exist')
  })
})
```

**2. Module-Level Tests**
- **User Module:** Registration, login, search, booking, reviews
- **Trainer Module:** Profile creation, applications, schedule management
- **Gym Owner Module:** Gym creation, job posting, trainer approval
- **Admin Module:** Report handling, user management, analytics

**3. Integration Tests**
- Cross-module workflows (e.g., User books → Trainer approves → Admin monitors)
- API + UI validation (check DB state after UI action)

**4. Regression Tests**
- Core functionality after each deployment
- Automated with CI/CD (GitHub Actions + Selenium Grid)

---

### Key Testable Elements (Data Attributes)

Add `data-testid` attributes to critical elements:

```html
<!-- Login Form -->
<input data-testid="email-input" type="email" />
<input data-testid="password-input" type="password" />
<button data-testid="login-btn">Login</button>

<!-- Search -->
<input data-testid="search-location" placeholder="Enter location" />
<select data-testid="filter-facilities">
  <option value="pool">Pool</option>
  <option value="sauna">Sauna</option>
</select>

<!-- Booking -->
<button data-testid="book-trainer-btn">Book Now</button>
<div data-testid="booking-status">Pending</div>

<!-- Admin Panel -->
<table data-testid="reports-table">
  <tr data-testid="report-row-1">...</tr>
</table>
```

---

### Database Schema (MongoDB Collections)

**users**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String (enum: 'user', 'trainer', 'gymOwner', 'admin'),
  profile: {
    name: String,
    phone: String,
    location: String
  },
  createdAt: Date,
  isActive: Boolean
}
```

**trainers**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  bio: String,
  certifications: [String],
  specializations: [String],
  experience: Number,
  hourlyRate: Number,
  rating: Number,
  totalReviews: Number,
  availability: [{
    day: String,
    slots: [String]
  }]
}
```

**gyms**
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: users),
  name: String,
  address: String,
  location: {
    city: String,
    state: String,
    zip: String
  },
  facilities: [String],
  pricing: {
    monthly: Number,
    annual: Number
  },
  photos: [String],
  rating: Number,
  isVerified: Boolean
}
```

**bookings**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  trainerId: ObjectId (ref: trainers),
  gymId: ObjectId (ref: gyms),
  date: Date,
  timeSlot: String,
  status: String (enum: 'pending', 'approved', 'completed', 'cancelled'),
  createdAt: Date,
  updatedAt: Date
}
```

**applications**
```javascript
{
  _id: ObjectId,
  trainerId: ObjectId (ref: trainers),
  gymId: ObjectId (ref: gyms),
  jobId: ObjectId (ref: jobs),
  coverLetter: String,
  status: String (enum: 'submitted', 'reviewed', 'accepted', 'rejected'),
  appliedDate: Date,
  reviewedDate: Date
}
```

---

## 🚀 Implementation Roadmap for Lab Project

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Node.js + Express server
- [ ] Configure MongoDB connection
- [ ] Implement JWT authentication
- [ ] Create user registration/login APIs

### Phase 2: Core Modules (Week 3-4)
- [ ] Build User module (search, booking)
- [ ] Build Trainer module (profile, applications)
- [ ] Build Gym Owner module (gym management, hiring)
- [ ] Create basic frontend pages

### Phase 3: Admin & Polish (Week 5)
- [ ] Implement Admin panel
- [ ] Add notifications system
- [ ] Implement rating/review system
- [ ] Enhance UI/UX

### Phase 4: Testing (Week 6-7)
- [ ] Write Selenium/Cypress test suites
- [ ] Implement Page Object Model
- [ ] Set up test data management
- [ ] Create test reports

### Phase 5: Demo Preparation (Week 8)
- [ ] Run full regression suite
- [ ] Document test coverage
- [ ] Prepare presentation
- [ ] Deploy to test environment

---

## 📊 Test Coverage Matrix

| Module       | Feature                | UI Test | API Test | Integration Test |
|--------------|------------------------|---------|----------|------------------|
| User         | Registration           | ✅      | ✅       | ✅               |
| User         | Search Gyms            | ✅      | ✅       | ✅               |
| User         | Book Trainer           | ✅      | ✅       | ✅               |
| Trainer      | Create Profile         | ✅      | ✅       | ✅               |
| Trainer      | Apply to Gym           | ✅      | ✅       | ✅               |
| Gym Owner    | Post Job               | ✅      | ✅       | ✅               |
| Gym Owner    | Approve Application    | ✅      | ✅       | ✅               |
| Admin        | Handle Report          | ✅      | ✅       | ✅               |
| Cross-Module | End-to-End Booking     | ✅      | ✅       | ✅               |

---

## 🎓 Learning Outcomes

This project helps you master:
1. **Full-stack development** with MERN-like stack
2. **RESTful API design** and implementation
3. **Role-based access control** (RBAC)
4. **Test automation frameworks** (Selenium/Cypress)
5. **Page Object Model** design pattern
6. **CI/CD integration** with automated testing
7. **Database modeling** for complex relationships
8. **Real-world workflows** with multiple user types

---

## 💡 Testing Best Practices

1. **Use Test Data Builders**
   - Create helper functions to generate test users, gyms, trainers
   - Reset database to known state before each test

2. **Implement Page Object Model**
   - Separate test logic from page interactions
   - Reusable page classes for maintainability

3. **Parallel Execution**
   - Run independent tests in parallel
   - Use Selenium Grid or Cypress Cloud

4. **Continuous Integration**
   - Trigger tests on every commit
   - Generate test reports automatically

5. **Test Pyramid Approach**
   - Many unit tests (fast, isolated)
   - Some integration tests (modules working together)
   - Few E2E tests (critical user journeys)

---

## 📝 Next Steps

1. Set up your development environment
2. Create the project structure (frontend/backend/tests folders)
3. Start with authentication module (most critical)
4. Build one complete workflow end-to-end
5. Write your first test case
6. Iterate and expand!

Good luck with your lab project! 🚀
