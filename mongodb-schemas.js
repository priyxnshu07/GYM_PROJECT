// ============================================
// MongoDB Database Schemas
// Gym Trainer & Discovery Platform
// ============================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ============================================
// 1. USER SCHEMA (Gym Members)
// ============================================

const userSchema = new Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  
  // Role & Status
  role: {
    type: String,
    enum: ['user', 'trainer', 'gymOwner', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Location
  location: {
    city: String,
    state: String,
    zipCode: String
  },
  
  // User-Specific Fields
  fitnessGoals: [String], // e.g., ['weight_loss', 'muscle_gain', 'endurance']
  preferredWorkoutTime: String, // e.g., 'morning', 'evening'
  
  // Profile Picture
  profilePicture: {
    type: String,
    default: 'default-avatar.png'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.city': 1 });

const User = mongoose.model('User', userSchema);

// ============================================
// 2. TRAINER SCHEMA
// ============================================

const trainerSchema = new Schema({
  // Link to User
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Professional Info
  bio: {
    type: String,
    maxlength: 500
  },
  specializations: [{
    type: String,
    enum: [
      'weight_training',
      'cardio',
      'yoga',
      'pilates',
      'crossfit',
      'bodybuilding',
      'powerlifting',
      'zumba',
      'aerobics',
      'martial_arts',
      'boxing',
      'kickboxing',
      'mma',
      'sports_specific',
      'rehabilitation',
      'senior_fitness',
      'nutrition',
      'other'
    ]
  }],
  certifications: [Schema.Types.Mixed],
  
  // Experience & Rates
  experienceYears: {
    type: Number,
    min: 0,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Availability Schedule
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    timeSlots: [{
      startTime: String, // e.g., "09:00"
      endTime: String    // e.g., "10:00"
    }]
  }],
  
  // Associated Gyms (where trainer works)
  gyms: [{
    type: Schema.Types.ObjectId,
    ref: 'Gym'
  }],
  
  // Profile Status
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  
  // Stats
  totalSessions: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
trainerSchema.index({ userId: 1 });
trainerSchema.index({ specializations: 1 });
trainerSchema.index({ rating: -1 });
trainerSchema.index({ hourlyRate: 1 });

const Trainer = mongoose.model('Trainer', trainerSchema);

// ============================================
// 3. GYM SCHEMA
// ============================================

const gymSchema = new Schema({
  // Owner Info
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Location
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Contact
  phone: {
    type: String,
    required: true
  },
  email: String,
  website: {
    type: String,
    trim: true,
    default: ""
  },
  
  // Facilities
  facilities: [{
    type: String,
    enum: [
      'cardio_machines',
      'weight_machines',
      'free_weights',
      'swimming_pool',
      'sauna',
      'steam_room',
      'yoga_studio',
      'group_classes',
      'personal_training',
      'locker_rooms',
      'parking',
      'cafe',
      'pro_shop',
      'basketball_court',
      'indoor_track'
    ]
  }],
  
  // Pricing
  pricing: {
    dayPass: Number,
    monthlyMembership: Number,
    annualMembership: Number,
    personalTrainingSession: Number
  },
  
  // Operating Hours
  operatingHours: [{
    day: String,
    openTime: String,  // e.g., "06:00"
    closeTime: String  // e.g., "22:00"
  }],
  
  // Images
  photos: [String], // Array of image URLs
  coverPhoto: String,
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Trainers at this gym
  trainers: [{
    type: Schema.Types.ObjectId,
    ref: 'Trainer'
  }],
  
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User' // Admin who verified
  },
  verifiedAt: Date,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Stats
  totalMembers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
gymSchema.index({ 'address.city': 1, 'address.state': 1 });
gymSchema.index({ name: 'text', description: 'text' });
gymSchema.index({ facilities: 1 });
gymSchema.index({ rating: -1 });
gymSchema.index({ 'pricing.monthlyMembership': 1 });
gymSchema.index({ isActive: 1, isVerified: 1 });

const Gym = mongoose.model('Gym', gymSchema);

// ============================================
// 4. JOB/REQUIREMENT SCHEMA
// ============================================

const jobSchema = new Schema({
  // Gym Info
  gymId: {
    type: Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  
  // Job Details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Requirements
  requiredSpecializations: [{
    type: String
  }],
  requiredCertifications: [String],
  minimumExperience: {
    type: Number,
    default: 0
  },
  
  // Compensation
  salaryType: {
    type: String,
    enum: ['hourly', 'monthly', 'per_session', 'commission'],
    required: true
  },
  salaryRange: {
    min: Number,
    max: Number
  },
  
  // Work Details
  workType: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'freelance'],
    default: 'part_time'
  },
  schedule: {
    type: String, // e.g., "Weekdays 6AM-2PM"
  },
  
  // Benefits
  benefits: [String], // e.g., ['health_insurance', 'paid_leave', 'gym_membership']
  
  // Status
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  
  // Application Stats
  totalApplications: {
    type: Number,
    default: 0
  },
  
  // Deadline
  applicationDeadline: Date,
  
  // Posted By
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  
  // Closing Info
  closedAt: Date,
  closedReason: String
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ gymId: 1, status: 1 });
jobSchema.index({ requiredSpecializations: 1 });
jobSchema.index({ postedAt: -1 });
jobSchema.index({ status: 1, applicationDeadline: 1 });

const Job = mongoose.model('Job', jobSchema);

// ============================================
// 5. TRAINER APPLICATION SCHEMA
// ============================================

const applicationSchema = new Schema({
  // Applicant Info
  trainerId: {
    type: Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  
  // Job Info
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  gymId: {
    type: Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  
  // Application Content
  coverLetter: {
    type: String,
    maxlength: 1500
  },
  resume: String, // URL to uploaded resume
  
  // Additional Info
  expectedSalary: Number,
  availableStartDate: Date,
  
  // Status Tracking
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn'],
    default: 'submitted'
  },
  
  // Timeline
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  responseDate: Date,
  
  // Reviewer Notes
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User' // Gym owner who reviewed
  },
  reviewerNotes: String,
  rejectionReason: String,
  
  // Interview Details (if applicable)
  interviewSchedule: {
    date: Date,
    time: String,
    location: String,
    interviewType: {
      type: String,
      enum: ['in_person', 'video', 'phone']
    }
  },
  
  // Offer Details (if accepted)
  offerDetails: {
    salary: Number,
    startDate: Date,
    workSchedule: String
  }
}, {
  timestamps: true
});

// Compound Indexes
applicationSchema.index({ trainerId: 1, gymId: 1 });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ gymId: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Prevent duplicate applications
applicationSchema.index({ trainerId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

// ============================================
// BONUS SCHEMAS (For Complete Functionality)
// ============================================

// 6. BOOKING SCHEMA
const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerId: {
    type: Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  gymId: {
    type: Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  
  // Session Details
  sessionDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: String,
    endTime: String
  },
  sessionType: {
    type: String,
    enum: ['one_on_one', 'group', 'virtual'],
    default: 'one_on_one'
  },
  
  // Pricing
  price: {
    type: Number,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  
  // Notes
  userNotes: String,
  trainerNotes: String,
  
  // Cancellation
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  cancelledAt: Date,
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  
  // Timestamps
  bookedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ trainerId: 1, sessionDate: 1 });
bookingSchema.index({ gymId: 1, sessionDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

// 7. REVIEW SCHEMA
const reviewSchema = new Schema({
  // Who reviewed whom
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerId: {
    type: Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  
  // Categories Rating (optional)
  categoryRatings: {
    professionalism: Number,
    knowledge: Number,
    communication: Number,
    punctuality: Number
  },
  
  // Response from Trainer
  trainerResponse: String,
  respondedAt: Date,
  
  // Moderation
  isVerified: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

reviewSchema.index({ trainerId: 1, rating: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true }); // One review per booking

const Review = mongoose.model('Review', reviewSchema);

// ============================================
// EXPORT ALL MODELS
// ============================================

module.exports = {
  User,
  Trainer,
  Gym,
  Job,
  Application,
  Booking,
  Review
};

// ============================================
// RELATIONSHIP SUMMARY
// ============================================

/*
RELATIONSHIPS:

1. User → Trainer (One-to-One)
   - User.role = 'trainer' → has corresponding Trainer document
   - Trainer.userId references User._id

2. User → Gym (One-to-Many)
   - User.role = 'gymOwner' → can own multiple Gyms
   - Gym.ownerId references User._id

3. Trainer → Gym (Many-to-Many)
   - Trainer.gyms[] contains Gym IDs
   - Gym.trainers[] contains Trainer IDs

4. Gym → Job (One-to-Many)
   - Gym can post multiple Jobs
   - Job.gymId references Gym._id

5. Trainer → Application (One-to-Many)
   - Trainer can apply to multiple Jobs
   - Application.trainerId references Trainer._id

6. Job → Application (One-to-Many)
   - Job can receive multiple Applications
   - Application.jobId references Job._id

7. User → Booking (One-to-Many)
   - User can make multiple Bookings
   - Booking.userId references User._id

8. Trainer → Booking (One-to-Many)
   - Trainer can have multiple Bookings
   - Booking.trainerId references Trainer._id

9. Booking → Review (One-to-One)
   - Each Booking can have one Review
   - Review.bookingId references Booking._id

CASCADE BEHAVIORS:
- When User is deleted → Delete associated Trainer/Gym/Bookings
- When Gym is deleted → Delete associated Jobs/Applications
- When Job is deleted → Update Applications status
- When Trainer is deleted → Update Gym.trainers array
*/

// ============================================
// SAMPLE DATA FOR TESTING
// ============================================

/*
// Sample User (Gym Member)
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashedpassword123",
  phone: "555-1234",
  role: "user",
  location: {
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  fitnessGoals: ["weight_loss", "muscle_gain"]
}

// Sample Trainer
{
  userId: ObjectId("..."),
  bio: "Certified personal trainer with 5 years experience",
  specializations: ["weight_training", "cardio"],
  certifications: [{
    name: "NASM-CPT",
    issuedBy: "NASM",
    issuedDate: "2019-01-15",
    expiryDate: "2025-01-15"
  }],
  experienceYears: 5,
  hourlyRate: 50,
  rating: 4.8,
  availability: [{
    day: "monday",
    timeSlots: [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "10:00", endTime: "11:00" }
    ]
  }]
}

// Sample Gym
{
  ownerId: ObjectId("..."),
  name: "FitZone Gym",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  phone: "555-5678",
  facilities: ["cardio_machines", "free_weights", "swimming_pool"],
  pricing: {
    monthlyMembership: 99,
    annualMembership: 999
  },
  isVerified: true
}

// Sample Job
{
  gymId: ObjectId("..."),
  title: "Personal Trainer - Weight Training Specialist",
  description: "Looking for experienced trainer...",
  requiredSpecializations: ["weight_training"],
  requiredCertifications: ["NASM-CPT", "ACE-CPT"],
  minimumExperience: 2,
  salaryType: "hourly",
  salaryRange: { min: 40, max: 60 },
  workType: "part_time",
  status: "active"
}

// Sample Application
{
  trainerId: ObjectId("..."),
  jobId: ObjectId("..."),
  gymId: ObjectId("..."),
  coverLetter: "I am interested in this position...",
  expectedSalary: 55,
  status: "submitted",
  appliedAt: new Date()
}
*/
