import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Plus, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  requiresBefore: boolean;
  requiresAfter: boolean;
  referencePhoto?: File | null;
}

interface SmartPhotoVerificationChecklistProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
  className?: string;
}

export const SmartPhotoVerificationChecklist: React.FC<SmartPhotoVerificationChecklistProps> = ({
  enabled,
  onToggle,
  items,
  onItemsChange,
  className
}) => {
  const [newItemTitle, setNewItemTitle] = useState('');

  const addItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `item_${Date.now()}`,
      title: newItemTitle.trim(),
      requiresBefore: true,
      requiresAfter: true,
      referencePhoto: null
    };

    onItemsChange([...items, newItem]);
    setNewItemTitle('');
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    onItemsChange(updatedItems);
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const handleFileUpload = (id: string, file: File) => {
    updateItem(id, { referencePhoto: file });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Smart Photo Verification
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              id="photo-verification"
            />
            <Label htmlFor="photo-verification" className="text-sm">
              Require verification
            </Label>
          </div>
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Create a checklist of steps that require photo verification. Providers will need to upload before/after photos for each step.
          </div>

          {/* Existing Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      placeholder="Step title (e.g., 'Clean back patio')"
                      className="font-medium"
                    />
                    <Input
                      value={item.description || ''}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Additional instructions (optional)"
                      className="mt-2 text-sm"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Photo Requirements */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.requiresBefore}
                      onCheckedChange={(checked) => updateItem(item.id, { requiresBefore: checked })}
                      id={`before-${item.id}`}
                    />
                    <Label htmlFor={`before-${item.id}`} className="text-sm">Before photo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.requiresAfter}
                      onCheckedChange={(checked) => updateItem(item.id, { requiresAfter: checked })}
                      id={`after-${item.id}`}
                    />
                    <Label htmlFor={`after-${item.id}`} className="text-sm">After photo</Label>
                  </div>
                </div>

                {/* Reference Photo Upload */}
                <div className="border-2 border-dashed border-muted rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Reference photo (optional guidance for provider)
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(item.id, file);
                      }}
                      className="hidden"
                      id={`upload-${item.id}`}
                    />
                    <Label htmlFor={`upload-${item.id}`} asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </Label>
                  </div>
                  {item.referencePhoto && (
                    <div className="mt-2 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        {item.referencePhoto.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Item */}
          <div className="border-2 border-dashed border-muted rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Input
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Add verification step (e.g., 'Clean kitchen surfaces')"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="flex-1"
              />
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-blue-700">
                {items.length} verification step{items.length !== 1 ? 's' : ''} configured. 
                Providers will need to complete photo verification for each step.
              </span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
