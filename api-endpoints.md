# REST API Endpoints - Gym Trainer & Discovery Platform

## 📋 API Documentation

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT Bearer Token (except public endpoints)

**Standard Response Format:**
```json
{
  "success": true/false,
  "message": "Descriptive message",
  "data": { ... },
  "error": "Error details (if any)"
}
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Register User
```
POST | /api/auth/register | Register new user (any role)
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-1234",
  "role": "user",
  "location": {
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Cases:**
- Valid registration → 201
- Duplicate email → 409 (Conflict)
- Missing required fields → 400 (Bad Request)
- Invalid email format → 400

---

### 2. Login
```
POST | /api/auth/login | Login existing user
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Cases:**
- Valid credentials → 200
- Invalid password → 401 (Unauthorized)
- User not found → 404
- Inactive account → 403 (Forbidden)

---

### 3. Logout
```
POST | /api/auth/logout | Logout user (invalidate token)
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Get Current User
```
GET | /api/auth/me | Get logged-in user details
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "location": {
      "city": "New York",
      "state": "NY"
    }
  }
}
```

---

## 👤 USER ENDPOINTS (Gym Members)

### 5. Update User Profile
```
PUT | /api/users/profile | Update user profile
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "555-9999",
  "location": {
    "city": "Los Angeles",
    "state": "CA"
  },
  "fitnessGoals": ["weight_loss", "muscle_gain"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

---

## 🏋️ TRAINER ENDPOINTS

### 6. Create Trainer Profile
```
POST | /api/trainers/profile | Create trainer profile (only for users with role='trainer')
```

**Request Body:**
```json
{
  "bio": "Certified personal trainer with 5 years experience",
  "specializations": ["weight_training", "cardio"],
  "certifications": [
    {
      "name": "NASM-CPT",
      "issuedBy": "NASM",
      "issuedDate": "2019-01-15",
      "expiryDate": "2025-01-15"
    }
  ],
  "experienceYears": 5,
  "hourlyRate": 50,
  "availability": [
    {
      "day": "monday",
      "timeSlots": [
        { "startTime": "09:00", "endTime": "10:00" }
      ]
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Trainer profile created successfully",
  "data": {
    "trainerId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "isProfileComplete": true
  }
}
```

**Test Cases:**
- Valid profile creation → 201
- User not a trainer → 403
- Profile already exists → 409
- Invalid specialization → 400

---

### 7. Update Trainer Profile
```
PUT | /api/trainers/profile | Update trainer profile
```

**Request Body:** (Same as create, partial updates allowed)

**Response (200):**
```json
{
  "success": true,
  "message": "Trainer profile updated",
  "data": { /* updated trainer object */ }
}
```

---

### 8. Get Trainer Profile
```
GET | /api/trainers/:trainerId | Get specific trainer details (public)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trainerId": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "bio": "Certified personal trainer...",
    "specializations": ["weight_training"],
    "experienceYears": 5,
    "hourlyRate": 50,
    "rating": 4.8,
    "totalReviews": 25,
    "gyms": [
      {
        "gymId": "507f1f77bcf86cd799439013",
        "name": "FitZone Gym",
        "city": "New York"
      }
    ]
  }
}
```

---

### 9. Search Trainers
```
GET | /api/trainers | Search/filter trainers (public)
```

**Query Parameters:**
```
?specialization=weight_training
&city=New York
&minRating=4.0
&maxRate=60
&sortBy=rating
&order=desc
&page=1
&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trainers": [
      {
        "trainerId": "...",
        "name": "John Doe",
        "specializations": ["weight_training"],
        "rating": 4.8,
        "hourlyRate": 50
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 48,
      "limit": 10
    }
  }
}
```

**Test Cases:**
- No filters → return all trainers (paginated)
- Filter by specialization → return matching trainers
- Invalid specialization → 400
- Empty results → 200 with empty array

---

## 🏢 GYM ENDPOINTS

### 10. Create Gym
```
POST | /api/gyms | Create new gym (only gym owners)
```

**Request Body:**
```json
{
  "name": "FitZone Gym",
  "description": "Premium fitness facility",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "phone": "555-5678",
  "facilities": ["cardio_machines", "free_weights", "swimming_pool"],
  "pricing": {
    "monthlyMembership": 99,
    "annualMembership": 999
  },
  "operatingHours": [
    {
      "day": "monday",
      "openTime": "06:00",
      "closeTime": "22:00"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Gym created successfully",
  "data": {
    "gymId": "507f1f77bcf86cd799439013",
    "name": "FitZone Gym",
    "isVerified": false
  }
}
```

**Test Cases:**
- Valid gym creation → 201
- Non-gym owner tries to create → 403
- Missing required fields → 400
- Duplicate gym name (same owner) → 409

---

### 11. Update Gym
```
PUT | /api/gyms/:gymId | Update gym details
```

**Request Body:** (Same structure as create, partial updates allowed)

**Response (200):**
```json
{
  "success": true,
  "message": "Gym updated successfully",
  "data": { /* updated gym object */ }
}
```

**Test Cases:**
- Owner updates own gym → 200
- Non-owner tries to update → 403
- Gym not found → 404

---

### 12. Get Gym Details
```
GET | /api/gyms/:gymId | Get specific gym details (public)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "gymId": "507f1f77bcf86cd799439013",
    "name": "FitZone Gym",
    "description": "Premium fitness facility",
    "address": { ... },
    "facilities": ["cardio_machines", "free_weights"],
    "pricing": { ... },
    "rating": 4.5,
    "totalReviews": 120,
    "trainers": [
      {
        "trainerId": "...",
        "name": "John Doe",
        "specializations": ["weight_training"]
      }
    ]
  }
}
```

---

### 13. Search Gyms
```
GET | /api/gyms | Search/filter gyms (public)
```

**Query Parameters:**
```
?city=New York
&state=NY
&facilities=swimming_pool,sauna
&minRating=4.0
&maxPrice=150
&sortBy=rating
&order=desc
&page=1
&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "gyms": [
      {
        "gymId": "...",
        "name": "FitZone Gym",
        "city": "New York",
        "facilities": ["swimming_pool"],
        "pricing": {
          "monthlyMembership": 99
        },
        "rating": 4.5
      }
    ],
    "pagination": { ... }
  }
}
```

**Test Cases:**
- Search by city → return gyms in that city
- Filter by facilities → return gyms with those facilities
- Multiple filters → return gyms matching all criteria
- No results → 200 with empty array

---

## 💼 JOB POSTING ENDPOINTS

### 14. Create Job Posting
```
POST | /api/jobs | Post trainer requirement (gym owners only)
```

**Request Body:**
```json
{
  "gymId": "507f1f77bcf86cd799439013",
  "title": "Personal Trainer - Weight Training Specialist",
  "description": "Looking for experienced trainer specializing in weight training",
  "requiredSpecializations": ["weight_training"],
  "requiredCertifications": ["NASM-CPT", "ACE-CPT"],
  "minimumExperience": 2,
  "salaryType": "hourly",
  "salaryRange": {
    "min": 40,
    "max": 60
  },
  "workType": "part_time",
  "schedule": "Weekdays 6AM-2PM",
  "benefits": ["health_insurance", "gym_membership"],
  "applicationDeadline": "2026-03-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "jobId": "507f1f77bcf86cd799439014",
    "title": "Personal Trainer - Weight Training Specialist",
    "status": "active"
  }
}
```

**Test Cases:**
- Gym owner posts job for their gym → 201
- Try to post for another's gym → 403
- Invalid salary type → 400
- Gym not found → 404

---

### 15. Update Job Posting
```
PUT | /api/jobs/:jobId | Update job details
```

**Request Body:** (Partial updates allowed)

**Response (200):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": { /* updated job object */ }
}
```

---

### 16. Close Job Posting
```
PATCH | /api/jobs/:jobId/close | Close job posting
```

**Request Body:**
```json
{
  "closedReason": "Position filled"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job closed successfully",
  "data": {
    "jobId": "507f1f77bcf86cd799439014",
    "status": "closed"
  }
}
```

---

### 17. Get Job Details
```
GET | /api/jobs/:jobId | Get specific job details (public)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "jobId": "507f1f77bcf86cd799439014",
    "title": "Personal Trainer - Weight Training Specialist",
    "gym": {
      "gymId": "...",
      "name": "FitZone Gym",
      "city": "New York"
    },
    "description": "...",
    "requiredSpecializations": ["weight_training"],
    "salaryRange": { "min": 40, "max": 60 },
    "status": "active",
    "totalApplications": 12
  }
}
```

---

### 18. Search Jobs
```
GET | /api/jobs | Search job postings (public)
```

**Query Parameters:**
```
?city=New York
&specialization=weight_training
&workType=part_time
&minSalary=40
&status=active
&page=1
&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "jobId": "...",
        "title": "Personal Trainer - Weight Training Specialist",
        "gym": { "name": "FitZone Gym", "city": "New York" },
        "salaryRange": { "min": 40, "max": 60 },
        "workType": "part_time",
        "postedAt": "2026-01-15"
      }
    ],
    "pagination": { ... }
  }
}
```

**Test Cases:**
- Filter by status=active → return only active jobs
- Filter by specialization → return matching jobs
- Expired deadline jobs → excluded from results

---

## 📝 TRAINER APPLICATION ENDPOINTS

### 19. Submit Application
```
POST | /api/applications | Trainer applies to job
```

**Request Body:**
```json
{
  "jobId": "507f1f77bcf86cd799439014",
  "coverLetter": "I am very interested in this position...",
  "expectedSalary": 55,
  "availableStartDate": "2026-02-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "507f1f77bcf86cd799439015",
    "jobId": "507f1f77bcf86cd799439014",
    "status": "submitted",
    "appliedAt": "2026-01-27T10:30:00Z"
  }
}
```

**Test Cases:**
- Valid application → 201
- Duplicate application (same trainer, same job) → 409
- Job not found → 404
- Job closed → 400
- Incomplete trainer profile → 400

---

### 20. Get Application Details
```
GET | /api/applications/:applicationId | Get application details
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applicationId": "507f1f77bcf86cd799439015",
    "trainer": {
      "trainerId": "...",
      "name": "John Doe",
      "specializations": ["weight_training"],
      "experienceYears": 5
    },
    "job": {
      "jobId": "...",
      "title": "Personal Trainer"
    },
    "coverLetter": "...",
    "expectedSalary": 55,
    "status": "submitted",
    "appliedAt": "2026-01-27T10:30:00Z"
  }
}
```

**Test Cases:**
- Trainer views own application → 200
- Gym owner views application for their job → 200
- Other user tries to view → 403

---

### 21. Get Trainer's Applications
```
GET | /api/applications/my-applications | Get logged-in trainer's applications
```

**Query Parameters:**
```
?status=submitted
&sortBy=appliedAt
&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "applicationId": "...",
        "job": {
          "title": "Personal Trainer",
          "gym": { "name": "FitZone Gym" }
        },
        "status": "submitted",
        "appliedAt": "2026-01-27"
      }
    ]
  }
}
```

---

### 22. Get Applications for Job (Gym Owner)
```
GET | /api/jobs/:jobId/applications | Get all applications for a job
```

**Query Parameters:**
```
?status=submitted
&sortBy=appliedAt
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "applicationId": "...",
        "trainer": {
          "trainerId": "...",
          "name": "John Doe",
          "specializations": ["weight_training"],
          "rating": 4.8,
          "experienceYears": 5
        },
        "expectedSalary": 55,
        "status": "submitted",
        "appliedAt": "2026-01-27"
      }
    ]
  }
}
```

**Test Cases:**
- Gym owner views applications for their job → 200
- Non-owner tries to view → 403
- Job not found → 404

---

### 23. Review Application (Accept/Reject)
```
PATCH | /api/applications/:applicationId/review | Gym owner reviews application
```

**Request Body:**
```json
{
  "status": "accepted",
  "reviewerNotes": "Great qualifications, let's proceed with interview",
  "offerDetails": {
    "salary": 55,
    "startDate": "2026-02-15",
    "workSchedule": "Mon-Fri, 6AM-2PM"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application accepted successfully",
  "data": {
    "applicationId": "507f1f77bcf86cd799439015",
    "status": "accepted",
    "reviewedAt": "2026-01-28T14:20:00Z"
  }
}
```

**For Rejection:**
```json
{
  "status": "rejected",
  "rejectionReason": "Looking for more experience"
}
```

**Test Cases:**
- Gym owner accepts application → 200 + trainer added to gym
- Gym owner rejects application → 200 + notification sent
- Non-owner tries to review → 403
- Invalid status transition → 400

---

### 24. Withdraw Application
```
PATCH | /api/applications/:applicationId/withdraw | Trainer withdraws application
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application withdrawn successfully",
  "data": {
    "applicationId": "507f1f77bcf86cd799439015",
    "status": "withdrawn"
  }
}
```

---

## 📅 BOOKING ENDPOINTS

### 25. Create Booking
```
POST | /api/bookings | User books trainer session
```

**Request Body:**
```json
{
  "trainerId": "507f1f77bcf86cd799439012",
  "gymId": "507f1f77bcf86cd799439013",
  "sessionDate": "2026-02-10",
  "timeSlot": {
    "startTime": "09:00",
    "endTime": "10:00"
  },
  "sessionType": "one_on_one",
  "userNotes": "Focus on weight loss"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "bookingId": "507f1f77bcf86cd799439016",
    "trainerId": "507f1f77bcf86cd799439012",
    "sessionDate": "2026-02-10",
    "timeSlot": { "startTime": "09:00", "endTime": "10:00" },
    "price": 50,
    "status": "pending"
  }
}
```

**Test Cases:**
- Valid booking → 201
- Trainer not available at that time → 409
- Trainer not working at that gym → 400
- Invalid date (past date) → 400

---

### 26. Get User's Bookings
```
GET | /api/bookings/my-bookings | Get logged-in user's bookings
```

**Query Parameters:**
```
?status=pending
&sortBy=sessionDate
&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "bookingId": "...",
        "trainer": {
          "name": "John Doe",
          "specializations": ["weight_training"]
        },
        "gym": {
          "name": "FitZone Gym"
        },
        "sessionDate": "2026-02-10",
        "timeSlot": { "startTime": "09:00", "endTime": "10:00" },
        "status": "pending"
      }
    ]
  }
}
```

---

### 27. Get Trainer's Bookings
```
GET | /api/bookings/trainer-bookings | Get trainer's bookings
```

**Response:** (Similar to user bookings)

---

### 28. Update Booking Status
```
PATCH | /api/bookings/:bookingId/status | Confirm/Cancel booking
```

**Request Body:**
```json
{
  "status": "confirmed",
  "trainerNotes": "Looking forward to the session"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking confirmed",
  "data": {
    "bookingId": "507f1f77bcf86cd799439016",
    "status": "confirmed"
  }
}
```

**Test Cases:**
- Trainer confirms booking → 200
- User cancels booking → 200
- Invalid status transition → 400
- Booking already completed → 400

---

## ⭐ REVIEW ENDPOINTS

### 29. Submit Review
```
POST | /api/reviews | User reviews trainer after session
```

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439016",
  "trainerId": "507f1f77bcf86cd799439012",
  "rating": 5,
  "comment": "Excellent trainer! Very knowledgeable.",
  "categoryRatings": {
    "professionalism": 5,
    "knowledge": 5,
    "communication": 5,
    "punctuality": 4
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "reviewId": "507f1f77bcf86cd799439017",
    "rating": 5,
    "trainerId": "507f1f77bcf86cd799439012"
  }
}
```

**Test Cases:**
- Valid review after completed session → 201
- Review before session completed → 400
- Duplicate review for same booking → 409
- Rating out of range → 400

---

### 30. Get Trainer Reviews
```
GET | /api/trainers/:trainerId/reviews | Get all reviews for trainer
```

**Query Parameters:**
```
?minRating=4
&sortBy=createdAt
&order=desc
&page=1
&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "reviewId": "...",
        "user": {
          "name": "Jane Smith"
        },
        "rating": 5,
        "comment": "Excellent trainer!",
        "createdAt": "2026-01-20"
      }
    ],
    "averageRating": 4.8,
    "totalReviews": 25,
    "pagination": { ... }
  }
}
```

---

## 👨‍💼 ADMIN ENDPOINTS

### 31. Verify Gym
```
PATCH | /api/admin/gyms/:gymId/verify | Admin verifies gym
```

**Request Body:**
```json
{
  "isVerified": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Gym verified successfully",
  "data": {
    "gymId": "507f1f77bcf86cd799439013",
    "isVerified": true,
    "verifiedAt": "2026-01-28T15:00:00Z"
  }
}
```

**Test Cases:**
- Admin verifies gym → 200
- Non-admin tries to verify → 403

---

### 32. Get Platform Statistics
```
GET | /api/admin/statistics | Get platform analytics
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalTrainers": 340,
    "totalGyms": 85,
    "totalBookings": 4520,
    "activeJobs": 67,
    "pendingApplications": 142,
    "recentSignups": [
      { "date": "2026-01-27", "count": 23 }
    ]
  }
}
```

---

### 33. Suspend User
```
PATCH | /api/admin/users/:userId/suspend | Suspend user account
```

**Request Body:**
```json
{
  "reason": "Violated terms of service",
  "duration": 30
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User suspended successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "isActive": false,
    "suspendedUntil": "2026-02-27"
  }
}
```

---

## 🧪 TESTING CHECKLIST

### Authentication Testing
- [ ] Register with valid data → 201
- [ ] Register with duplicate email → 409
- [ ] Login with valid credentials → 200
- [ ] Login with invalid credentials → 401
- [ ] Access protected route without token → 401
- [ ] Access protected route with invalid token → 401

### Authorization Testing
- [ ] Trainer creates trainer profile → 201
- [ ] User tries to create trainer profile → 403
- [ ] Gym owner creates gym → 201
- [ ] User tries to create gym → 403
- [ ] Admin verifies gym → 200
- [ ] Non-admin tries to verify gym → 403

### Search & Filter Testing
- [ ] Search gyms without filters → 200 with all gyms
- [ ] Search gyms with city filter → 200 with filtered results
- [ ] Search with invalid filter → 400
- [ ] Search with no results → 200 with empty array
- [ ] Pagination works correctly → correct page numbers

### Application Workflow Testing
- [ ] Trainer applies to job → 201
- [ ] Duplicate application → 409
- [ ] Gym owner views applications → 200
- [ ] Gym owner accepts application → 200 + trainer added to gym
- [ ] Gym owner rejects application → 200 + notification sent
- [ ] Trainer withdraws application → 200

### Booking Workflow Testing
- [ ] User books available trainer → 201
- [ ] User books unavailable time → 409
- [ ] Trainer confirms booking → 200
- [ ] User cancels booking → 200
- [ ] User reviews after completed session → 201
- [ ] User tries to review before completion → 400

### Data Validation Testing
- [ ] Create with missing required fields → 400
- [ ] Create with invalid enum value → 400
- [ ] Create with invalid data type → 400
- [ ] Update with valid data → 200
- [ ] Update non-existent resource → 404

### Edge Cases Testing
- [ ] Extremely long strings → 400 (validation error)
- [ ] SQL injection attempts → 400/500 (safely handled)
- [ ] XSS attempts → safely escaped
- [ ] Concurrent bookings for same slot → 409
- [ ] Expired JWT token → 401

---

## 📊 Response Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors, invalid data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, constraint violation |
| 500 | Server Error | Unexpected server error |

---

## 🔒 Middleware Stack

```javascript
// Example route with middleware
router.post('/api/jobs',
  authenticate,           // Verify JWT token
  authorize('gymOwner'),  // Check role
  validateJobInput,       // Validate request body
  createJob              // Controller function
);
```

**Middleware Functions:**
1. `authenticate` - Verify JWT token, attach user to request
2. `authorize(roles)` - Check if user has required role
3. `validate*` - Validate request body using Joi/express-validator
4. `errorHandler` - Global error handling middleware

---

## 🚀 Sample Automation Test (Cypress)

```javascript
describe('Trainer Application Workflow', () => {
  let authToken, gymId, jobId;
  
  it('Should complete full application workflow', () => {
    // 1. Login as Gym Owner
    cy.request('POST', '/api/auth/login', {
      email: 'owner@gym.com',
      password: 'password123'
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.data.token;
    });
    
    // 2. Create Job Posting
    cy.request({
      method: 'POST',
      url: '/api/jobs',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        gymId: 'xxx',
        title: 'Personal Trainer Needed',
        salaryType: 'hourly',
        salaryRange: { min: 40, max: 60 }
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      jobId = response.body.data.jobId;
    });
    
    // 3. Trainer Applies
    cy.request({
      method: 'POST',
      url: '/api/applications',
      headers: { Authorization: `Bearer ${trainerToken}` },
      body: {
        jobId: jobId,
        coverLetter: 'I am interested...'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
    
    // 4. Gym Owner Reviews
    cy.request({
      method: 'GET',
      url: `/api/jobs/${jobId}/applications`,
      headers: { Authorization: `Bearer ${authToken}` }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.applications).to.have.length(1);
    });
  });
});
```

---

## 💡 Best Practices for Testability

1. **Consistent Response Format**: Always use standard format
2. **Predictable Status Codes**: Use correct HTTP codes
3. **Detailed Error Messages**: Help identify issues quickly
4. **Data Test IDs**: Include identifiable fields in responses
5. **Idempotent Operations**: PUT/DELETE should be idempotent
6. **Clear Validation Messages**: Specify which field failed
7. **Rate Limiting**: Implement for load testing
8. **Test Data Endpoints**: Seed/reset data for testing

---

## 🎯 Next Steps

1. Implement these endpoints in Express
2. Add input validation middleware
3. Write unit tests for controllers
4. Create Postman collection
5. Set up Swagger documentation
6. Build Selenium/Cypress test suites
7. Integrate with CI/CD pipeline

---

**Total Endpoints:** 33  
**Public Endpoints:** 10 (search, view details)  
**Protected Endpoints:** 23 (require authentication)  
**Admin-Only Endpoints:** 3
