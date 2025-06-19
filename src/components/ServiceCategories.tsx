
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from '@/data/serviceCategories';

// Sample count data - in a real app this would come from your API
const categoryCounts = {
  'home_maintenance': 89,
  'cleaning': 234,
  'landscaping': 156,
  'electrical': 67,
  'plumbing': 123,
  'hvac': 45,
  'other': 78
};

const categoryColors = {
  'home_maintenance': "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  'cleaning': "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  'landscaping': "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  'electrical': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  'plumbing': "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  'hvac': "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  'other': "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
};

interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onCategorySelect }) => {
  // Filter out 'all' category for display
  const displayCategories = serviceCategories.filter(cat => cat.value !== 'all');

  return (
    <Card className="bg-white dark:bg-dark-secondary shadow-lg border dark:border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
          Service Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayCategories.map(category => (
          <div
            key={category.value}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            onClick={() => onCategorySelect(category.value)}
          >
            <div className="flex items-center gap-3">
              <Badge className={categoryColors[category.value as keyof typeof categoryColors] || categoryColors.other}>
                {category.label}
              </Badge>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {categoryCounts[category.value as keyof typeof categoryCounts] || 0}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ServiceCategories;
