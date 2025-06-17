# HOUSIE Database Schema v2.0
*Clean, Simple, Scalable Fintech Architecture*

## Overview
This schema eliminates the cleaner_id confusion and supports role switching, fintech features, and all planned AI capabilities.

## Core Tables

### 1. users (Main table - no separate cleaner_id!)
```sql
users {
  id: uuid (primary key)
  email: text (unique)
  password_hash: text
  full_name: text
  phone: text
  created_at: timestamp
  updated_at: timestamp
  
  -- Profile switching
  current_role: enum ('seeker', 'provider')
  can_provide: boolean (default false)
  can_seek: boolean (default true)
  
  -- Basic info
  profile_image: text (url)
  address: text
  city: text
  province: text
  postal_code: text
  coordinates: point (lat, lng)
  
  -- Subscription
  subscription_tier: enum ('free', 'starter', 'pro', 'premium')
  subscription_status: enum ('active', 'cancelled', 'trial')
  stripe_customer_id: text
}
```

### 2. provider_profiles (Only when user becomes provider)
```sql
provider_profiles {
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  
  -- Business info
  business_name: text
  description: text
  years_experience: integer
  hourly_rate: decimal
  service_radius_km: integer
  
  -- Verification
  cra_compliant: boolean (default false)
  verified: boolean (default false)
  insurance_verified: boolean (default false)
  
  -- Performance
  total_bookings: integer (default 0)
  average_rating: decimal (default 0)
  response_time_hours: decimal
  
  created_at: timestamp
  updated_at: timestamp
}
```

### 3. services (What providers offer)
```sql
services {
  id: uuid (primary key)
  provider_id: uuid (foreign key -> provider_profiles.id)
  
  category: enum ('cleaning', 'lawn_care', 'construction', 'wellness', 'care_pets')
  subcategory: text
  title: text
  description: text
  
  pricing_type: enum ('hourly', 'flat', 'custom')
  base_price: decimal
  
  active: boolean (default true)
  created_at: timestamp
}
```

### 4. bookings (Core transactions)
```sql
bookings {
  id: uuid (primary key)
  customer_id: uuid (foreign key -> users.id)
  provider_id: uuid (foreign key -> provider_profiles.id)
  service_id: uuid (foreign key -> services.id)
  
  -- Booking details
  scheduled_date: date
  scheduled_time: time
  duration_hours: decimal
  total_amount: decimal
  
  -- Address
  service_address: text
  service_coordinates: point
  
  -- Status
  status: enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
  payment_status: enum ('pending', 'paid', 'refunded')
  
  -- Stripe
  stripe_payment_intent_id: text
  
  created_at: timestamp
  updated_at: timestamp
}
```

### 5. messages (Built-in chat)
```sql
messages {
  id: uuid (primary key)
  booking_id: uuid (foreign key -> bookings.id)
  sender_id: uuid (foreign key -> users.id)
  
  content: text
  message_type: enum ('text', 'image', 'system')
  
  created_at: timestamp
  read_at: timestamp
}
```

### 6. reviews (Rating system)
```sql
reviews {
  id: uuid (primary key)
  booking_id: uuid (foreign key -> bookings.id)
  reviewer_id: uuid (foreign key -> users.id)
  provider_id: uuid (foreign key -> provider_profiles.id)
  
  rating: integer (1-5)
  comment: text
  
  created_at: timestamp
}
```

## Fintech Features

### 7. recurring_services (Smart Subscription Manager)
```sql
recurring_services {
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  service_id: uuid (foreign key -> services.id)
  provider_id: uuid (foreign key -> provider_profiles.id)
  
  frequency: enum ('weekly', 'bi_weekly', 'monthly', 'quarterly', 'seasonal')
  next_booking_date: date
  auto_book: boolean (default false)
  
  -- AI optimization
  optimal_schedule: jsonb
  cost_optimization_suggestions: jsonb
  last_optimization_check: timestamp
  
  active: boolean (default true)
  created_at: timestamp
}
```

### 8. group_bookings (Group Buying Power)
```sql
group_bookings {
  id: uuid (primary key)
  organizer_id: uuid (foreign key -> users.id)
  service_id: uuid (foreign key -> services.id)
  provider_id: uuid (foreign key -> provider_profiles.id)
  
  max_participants: integer
  current_participants: integer (default 1)
  center_coordinates: point
  max_radius_km: decimal
  
  individual_price: decimal
  group_discount_percentage: decimal
  final_price_per_person: decimal
  housie_revenue_share: decimal
  
  status: enum ('forming', 'confirmed', 'completed', 'cancelled')
  created_at: timestamp
}
```

### 9. expense_categories (Smart Auto-Categorization)
```sql
expense_categories {
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  
  name: text
  tax_deductible: boolean (default false)
  business_related: boolean (default false)
  deduction_percentage: decimal
  
  auto_categorization_rules: jsonb
  confidence_threshold: decimal
  
  active: boolean (default true)
  created_at: timestamp
}
```

## Future AI Features

### 10. ocr_documents (Invoice Scanner)
```sql
ocr_documents {
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  
  original_image_url: text
  document_type: enum ('receipt', 'invoice', 'tax_document')
  
  ocr_text: text
  parsed_data: jsonb
  total_amount: decimal
  vendor_name: text
  transaction_date: date
  
  expense_category: text
  business_deductible: boolean
  user_verified: boolean (default false)
  
  created_at: timestamp
}
```

### 11. parking_sessions (Parky AI)
```sql
parking_sessions {
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  booking_id: uuid (foreign key -> bookings.id)
  
  location_coordinates: point
  start_time: timestamp
  end_time: timestamp
  
  sign_image_url: text
  ai_analysis: jsonb
  compliance_status: enum ('compliant', 'violation_risk', 'violation')
  parking_cost: decimal
  
  business_related: boolean
  created_at: timestamp
}
```

## Key Benefits
- ✅ Single user table with role switching
- ✅ Clean relationships, easy to query
- ✅ Fintech-ready with expense tracking
- ✅ Scalable for all service categories
- ✅ AI features built into schema
- ✅ Stripe payment integration ready
