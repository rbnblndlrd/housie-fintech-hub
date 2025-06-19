
export interface ServiceCategory {
  id: string;
  name: string;
  count: number;
  color: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  backgroundCheckRequired: boolean;
  ccqRbqRequired: boolean;
  riskCategory: 'low' | 'medium' | 'high';
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cleaning",
    name: "Cleaning",
    count: 234,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    subcategories: [
      { id: "residential_interior", name: "Residential Interior", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "commercial_cleaning", name: "Commercial Cleaning", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "post_construction", name: "Post Construction", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "exterior_washing", name: "Exterior Washing", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "extermination_pest_control", name: "Extermination & Pest Control", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" }
    ]
  },
  {
    id: "lawn_care",
    name: "Lawn/Snow",
    count: 156,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    subcategories: [
      { id: "lawn_mowing", name: "Lawn Mowing", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "landscaping_design", name: "Landscaping Design", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "snow_removal", name: "Snow Removal", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "garden_maintenance", name: "Garden Maintenance", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "low" },
      { id: "tree_services", name: "Tree Services", backgroundCheckRequired: false, ccqRbqRequired: false, riskCategory: "medium" }
    ]
  },
  {
    id: "construction",
    name: "Construction",
    count: 89,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    subcategories: [
      { id: "handyman_repairs", name: "Handyman Repairs", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "exterior_renovation", name: "Exterior Renovation", backgroundCheckRequired: false, ccqRbqRequired: true, riskCategory: "medium" },
      { id: "painting_services", name: "Painting Services", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "flooring_installation", name: "Flooring Installation", backgroundCheckRequired: true, ccqRbqRequired: true, riskCategory: "high" },
      { id: "roofing_siding", name: "Roofing & Siding", backgroundCheckRequired: false, ccqRbqRequired: true, riskCategory: "medium" }
    ]
  },
  {
    id: "wellness",
    name: "Wellness",
    count: 67,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    subcategories: [
      { id: "massage_therapy", name: "Massage Therapy", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "personal_training", name: "Personal Training", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "nutrition_consulting", name: "Nutrition Consulting", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "mental_health_coaching", name: "Mental Health Coaching", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "elder_care_assistance", name: "Elder Care Assistance", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" }
    ]
  },
  {
    id: "care_pets",
    name: "Care/Pets",
    count: 123,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    subcategories: [
      { id: "dog_walking", name: "Dog Walking", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "pet_sitting_home", name: "Pet Sitting (Home)", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "grooming_mobile", name: "Mobile Grooming", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "veterinary_home_visits", name: "Veterinary Home Visits", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" },
      { id: "pet_training", name: "Pet Training", backgroundCheckRequired: true, ccqRbqRequired: false, riskCategory: "high" }
    ]
  }
];

export const getCategoryById = (id: string) => serviceCategories.find(cat => cat.id === id);
export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};
