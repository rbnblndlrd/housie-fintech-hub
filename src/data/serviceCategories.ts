
export const serviceCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'home_maintenance', label: 'Home Maintenance' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'other', label: 'Other' }
];

export const getCategoryLabel = (value: string): string => {
  const category = serviceCategories.find(cat => cat.value === value);
  return category ? category.label : 'All Categories';
};

export const getCategoryValue = (label: string): string => {
  const category = serviceCategories.find(cat => cat.label === label);
  return category ? category.value : 'all';
};
