// Shared service category definitions and utilities
// This ensures consistency between CreateTicketModal and other components

export interface ServiceSubcategory {
  label: string;
  value: string;
  requiresCertification?: boolean;
}

export interface ServiceCategory {
  emoji: string;
  label: string;
  value: string;
  subcategories: ServiceSubcategory[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    emoji: "💆",
    label: "Personal Wellness",
    value: "wellness",
    subcategories: [
      { label: "Massage Therapy", value: "massage", requiresCertification: true },
      { label: "Tattooing", value: "tattoo" },
      { label: "Haircuts / Styling", value: "haircuts" },
      { label: "Makeup Services", value: "makeup" }
    ]
  },
  {
    emoji: "🧹",
    label: "Cleaning Services",
    value: "cleaning",
    subcategories: [
      { label: "House Cleaning", value: "house_cleaning" },
      { label: "Deep Cleaning", value: "deep_cleaning" },
      { label: "Move-in / Move-out Cleaning", value: "move_cleaning" },
      { label: "Post-Renovation Cleanup", value: "post_reno_cleanup" }
    ]
  },
  {
    emoji: "🌿",
    label: "Exterior & Grounds",
    value: "exterior",
    subcategories: [
      { label: "Lawn Mowing", value: "lawn_mowing" },
      { label: "Snow Removal", value: "snow_removal" },
      { label: "Leaf Removal", value: "leaf_removal" },
      { label: "Hedge Trimming", value: "hedge_trimming" },
      { label: "Pressure Washing", value: "pressure_washing" },
      { label: "Gutter Cleaning", value: "gutter_cleaning" }
    ]
  },
  {
    emoji: "🐕",
    label: "Pet Care Services",
    value: "petcare",
    subcategories: [
      { label: "Dog Walking", value: "dog_walking" },
      { label: "Pet Sitting", value: "pet_sitting" },
      { label: "Litter Change", value: "litter_change" },
      { label: "Pet Feeding", value: "pet_feeding" }
    ]
  },
  {
    emoji: "🔧",
    label: "Appliance & Tech Repair",
    value: "repairs",
    subcategories: [
      { label: "Washer / Dryer Repair", value: "washer_dryer_repair" },
      { label: "Fridge / Freezer Repair", value: "fridge_repair" },
      { label: "Dishwasher Repair", value: "dishwasher_repair" },
      { label: "Smart TV / Device Setup", value: "tv_setup" },
      { label: "Computer / Tech Support", value: "computer_support" }
    ]
  },
  {
    emoji: "🎪",
    label: "Event Services",
    value: "events",
    subcategories: [
      { label: "Event Setup / Teardown", value: "event_setup" },
      { label: "Furniture Moving", value: "furniture_moving" },
      { label: "Balloon / Decor", value: "decor" },
      { label: "On-site Cleaning", value: "event_cleaning" },
      { label: "Bartending", value: "bartending" }
    ]
  },
  {
    emoji: "🚚",
    label: "Moving & Delivery",
    value: "moving",
    subcategories: [
      { label: "Furniture Moving", value: "furniture_moving" },
      { label: "Small Truck Delivery", value: "truck_delivery" },
      { label: "Packing Help", value: "packing_help" },
      { label: "Box Drop-off / Return", value: "box_service" }
    ]
  }
];

// Map frontend category values to database category names
export const CATEGORY_VALUE_MAP: Record<string, string> = {
  'wellness': 'personal_wellness',
  'cleaning': 'cleaning',
  'exterior': 'exterior_grounds',
  'petcare': 'pet_care',
  'repairs': 'appliance_tech',
  'events': 'event_services',
  'moving': 'moving_services'
};

// Reverse mapping for display purposes
export const DB_CATEGORY_DISPLAY_MAP: Record<string, string> = {
  'personal_wellness': 'wellness',
  'cleaning': 'cleaning',
  'exterior_grounds': 'exterior',
  'pet_care': 'petcare',
  'appliance_tech': 'repairs',
  'event_services': 'events',
  'moving_services': 'moving'
};

// Utility functions
export const getCategoryByValue = (value: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find(cat => cat.value === value);
};

export const getSubcategoryByValue = (categoryValue: string, subcategoryValue: string): ServiceSubcategory | undefined => {
  const category = getCategoryByValue(categoryValue);
  return category?.subcategories.find(sub => sub.value === subcategoryValue);
};

export const getDisplayNameForBooking = (booking: any): string => {
  // Prioritize user's custom title first
  if (booking.custom_title && booking.custom_title.trim()) {
    return booking.custom_title.trim();
  }
  
  // If serviceName is available, use it
  if (booking.serviceName) {
    return booking.serviceName;
  }
  
  // If service_title is available, use it
  if (booking.service_title) {
    return booking.service_title;
  }
  
  // Try to build a name from category/subcategory metadata
  const category = booking.category;
  const subcategory = booking.subcategory;
  
  if (category && subcategory) {
    const displayCategory = DB_CATEGORY_DISPLAY_MAP[category] || category;
    const categoryObj = getCategoryByValue(displayCategory);
    const subcategoryObj = getSubcategoryByValue(displayCategory, subcategory);
    
    if (subcategoryObj) {
      return subcategoryObj.label;
    }
    
    if (categoryObj) {
      return `${categoryObj.label} Request`;
    }
    
    // Handle unknown subcategories gracefully
    return `${subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Service`;
  }
  
  // If we only have category
  if (category) {
    const displayCategory = DB_CATEGORY_DISPLAY_MAP[category] || category;
    const categoryObj = getCategoryByValue(displayCategory);
    
    if (categoryObj) {
      return `${categoryObj.label} Request`;
    }
    
    return `${category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Service`;
  }
  
  // Ultimate fallback for completely uncategorized requests
  return 'Custom Service Request';
};