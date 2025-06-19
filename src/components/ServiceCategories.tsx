
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/serviceCategories";

interface ServiceCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onCategorySelect }) => {
  return (
    <Card className="bg-white dark:bg-dark-secondary shadow-lg border dark:border-gray-700 mb-6">
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
