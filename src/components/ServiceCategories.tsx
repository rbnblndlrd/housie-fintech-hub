
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const serviceCategories = [
  { id: "cleaning", name: "Cleaning", count: 234, color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  { id: "lawn_care", name: "Lawn/Snow", count: 156, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { id: "construction", name: "Construction", count: 89, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { id: "wellness", name: "Wellness", count: 67, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { id: "care_pets", name: "Care/Pets", count: 123, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }
];

interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onCategorySelect }) => {
  return (
    <Card className="fintech-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black dark:text-white text-lg">
          Service Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {serviceCategories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="flex items-center gap-3">
              <Badge className={category.color}>
                {category.name}
              </Badge>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ServiceCategories;
