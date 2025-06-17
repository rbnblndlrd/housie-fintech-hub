HOUSIE User Flows
Key User Journeys & Experience Design
1. New User Onboarding
Flow: Homepage → Registration → Profile Setup
1. Landing page: "Canada's Trusted Marketplace for Home Services"
2. Click "Get Started" or search for services
3. Registration form: Email, password, full name
4. Role selection: "Are you seeking or providing services?"
   - Seeker: Goes to customer profile setup
   - Provider: Goes to business profile setup
   - Both: Can switch roles later
5. Profile completion based on selected role
6. Email verification
7. Dashboard welcome tour
Decision Points:

Role Selection: Critical for personalized experience
Location: Auto-detect or manual entry (Montreal focus)
Subscription: Offer free trial of Pro features

2. Service Booking (Customer Journey)
Flow: Search → Browse → Book → Complete
1. Dashboard or Services page
2. Search by:
   - Location (postal code/city)
   - Service type (cleaning, lawn care, etc.)
   - Date/time preferences
3. Results display:
   - Map view with provider locations
   - List view with filters (price, rating, distance)
4. Provider selection:
   - View profile, reviews, services
   - Check availability
   - Get instant quote
5. Booking creation:
   - Select service details
   - Choose date/time
   - Add special instructions
   - Confirm address
6. Payment:
   - Stripe checkout
   - Save payment method
7. Confirmation:
   - Booking details
   - Provider contact info
   - Chat activation
8. Service completion:
   - Mark as complete
   - Leave review
   - Expense auto-categorization
Key Features:

Real-time availability
Instant messaging with provider
GPS tracking for service arrival
Automatic expense categorization

3. Service Provision (Provider Journey)
Flow: Setup → Listings → Bookings → Completion
1. Provider profile completion:
   - Business information
   - Service categories
   - Pricing structure
   - Availability calendar
   - Verification documents
2. Service listing creation:
   - Service descriptions
   - Pricing (hourly/flat rate)
   - Service area radius
   - Photos/portfolio
3. Booking management:
   - Receive booking requests
   - Accept/decline with reasons
   - Communicate with customers
   - Update availability
4. Service delivery:
   - Navigate to customer location
   - Update booking status
   - Handle payments through platform
5. Post-service:
   - Request customer review
   - Track earnings and expenses
   - Schedule recurring services
Provider Benefits:

Automated invoicing
Tax-ready expense tracking
Performance analytics
Recurring booking automation

4. Role Switching
Flow: Seamless Provider ↔ Customer Toggle
1. Any authenticated page
2. Click profile dropdown
3. Select "Switch to Provider" or "Switch to Customer"
4. Dashboard adapts to selected role:
   - Customer: Booking history, expense tracking
   - Provider: Earnings, service management
5. Navigation updates to role-appropriate options
6. Maintain access to both role histories
Technical Implementation:

current_role field updates in database
Dynamic navigation based on role
Shared profile data with role-specific additions

5. Fintech Features (Advanced Users)
Expense Tracking Flow:
1. Transaction occurs (booking payment)
2. Auto-categorization:
   - Business vs personal
   - Tax-deductible identification
   - Expense category assignment
3. Dashboard widgets update:
   - Monthly spending by category
   - Tax deduction tracking
   - Cash flow projections
4. Monthly reports:
   - Automated tax document generation
   - Expense summaries
   - Deduction recommendations
Group Booking Flow:
1. AI identifies opportunity:
   - Multiple users in same area need similar service
   - Creates group booking suggestion
2. Notification to potential participants:
   - "3 neighbors need lawn care - save 15%"
3. Group formation:
   - Users can join with one click
   - Minimum participants for discount
4. Automatic coordination:
   - Single provider handles multiple addresses
   - Optimized routing
   - Shared discount benefits
5. Individual billing with group savings
6. AI Assistant Interactions
Chat Assistant Flow:
1. Purple chat bubble always visible
2. Click to open chat interface
3. AI responds to queries:
   - "Find cleaners near me"
   - "When was my last booking?"
   - "How much did I spend on services this month?"
   - "Are there any group opportunities?"
4. Proactive suggestions:
   - "It's been 3 weeks since your last cleaning"
   - "Snow removal season starts soon - book early?"
   - "You could save $50/month with bi-weekly cleaning"
7. Subscription Management
Tier Progression Flow:
Free → Starter ($8) → Pro ($15) → Premium ($25)

Free Tier:
- Basic booking
- Simple expense tracking
- Up to 3 service types

Starter Tier:
- Everything in Free
- Enhanced analytics
- Email support
- Up to 8 service types

Pro Tier (Most Popular):
- Everything in Starter
- Unlimited service types
- Advanced AI features
- Group booking access
- Priority support

Premium Tier:
- Everything in Pro
- OCR invoice scanning
- Custom expense widgets
- White-glove support
- Advanced market insights
8. Error Handling & Edge Cases
Common Scenarios:

No providers available: Suggest nearby areas or waitlist
Booking cancellation: Clear refund policy and rescheduling
Payment failure: Multiple retry options and alternative methods
Provider no-show: Automatic refund and alternative provider suggestions
Service quality issues: Dispute resolution and review system

Technical Resilience:

Offline functionality: Cache critical data for mobile users
API failures: Graceful degradation with user feedback
Database issues: Backup systems and error recovery

9. Mobile App Considerations
Native App Features:

Push notifications for booking updates
GPS integration for service location
Camera integration for OCR features
Offline mode for basic functionality
Biometric authentication for security

10. Success Metrics Per Flow
Onboarding Success:

Registration completion rate > 80%
Profile completion rate > 90%
First booking within 7 days > 40%

Booking Success:

Search to booking conversion > 25%
Booking completion rate > 95%
Customer satisfaction > 4.5/5

Provider Success:

Profile setup completion > 85%
First booking within 14 days > 60%
Monthly retention rate > 80%

Fintech Adoption:

Users viewing expense analytics > 70%
Subscription upgrade rate > 15%
AI assistant engagement > 50%

"Every user interaction should feel intelligent, helpful, and financially empowering."
