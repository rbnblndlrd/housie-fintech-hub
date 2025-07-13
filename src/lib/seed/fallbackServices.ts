import { supabase } from '@/integrations/supabase/client';
import { SERVICE_CATEGORIES } from '@/utils/serviceCategories';

/**
 * HOUSIE Fallback Service Seeding Script
 * 
 * Creates placeholder services for every category/subcategory combination 
 * that doesn't already exist in the services table. This ensures that
 * users can always create tickets, even for new or uncommon service types.
 */

interface FallbackService {
  provider_id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  active: boolean;
  base_price?: number;
  background_check_required?: boolean;
}

// Map frontend category values to database category names
const CATEGORY_VALUE_MAP: Record<string, string> = {
  'wellness': 'personal_wellness',
  'cleaning': 'cleaning',
  'exterior': 'exterior_grounds',
  'petcare': 'pet_care',
  'repairs': 'appliance_tech',
  'events': 'event_services',
  'moving': 'moving_services'
};

/**
 * Generate fallback service data for a given category/subcategory
 */
const generateFallbackService = (
  category: string, 
  subcategory: string, 
  subcategoryLabel: string,
  requiresCertification = false
): FallbackService => {
  return {
    provider_id: '00000000-0000-4000-8000-000000000001', // HOUSIE System Services
    title: `Generic ${subcategoryLabel}`,
    category: CATEGORY_VALUE_MAP[category] || category,
    subcategory: subcategory,
    description: `Placeholder fallback service for ${subcategoryLabel.toLowerCase()} requests. This service will be matched when users create tickets for this category but no specific service template exists.`,
    active: true,
    base_price: 25.00, // Default rate for fallback services
    background_check_required: requiresCertification
  };
};

/**
 * Check which category/subcategory combinations are missing from services table
 */
export const findMissingServices = async (): Promise<FallbackService[]> => {
  console.log('🔍 Checking for missing service templates...');
  
  const missingServices: FallbackService[] = [];
  
  // Get all existing services to check against
  const { data: existingServices, error } = await supabase
    .from('services')
    .select('category, subcategory')
    .eq('active', true);
    
  if (error) {
    console.error('Error fetching existing services:', error);
    throw error;
  }
  
  const existingCombinations = new Set(
    existingServices?.map(s => `${s.category}:${s.subcategory}`) || []
  );
  
  // Check each category/subcategory combination
  SERVICE_CATEGORIES.forEach(category => {
    const dbCategoryName = CATEGORY_VALUE_MAP[category.value] || category.value;
    
    category.subcategories.forEach(subcategory => {
      const combination = `${dbCategoryName}:${subcategory.value}`;
      
      if (!existingCombinations.has(combination)) {
        console.log(`📝 Missing service: ${dbCategoryName}/${subcategory.value}`);
        missingServices.push(
          generateFallbackService(
            category.value,
            subcategory.value, 
            subcategory.label,
            subcategory.requiresCertification
          )
        );
      }
    });
  });
  
  return missingServices;
};

/**
 * Create fallback services for missing category/subcategory combinations
 */
export const createFallbackServices = async (): Promise<void> => {
  console.log('🚀 Starting fallback service creation...');
  
  try {
    const missingServices = await findMissingServices();
    
    if (missingServices.length === 0) {
      console.log('✅ All service templates already exist. No fallbacks needed.');
      return;
    }
    
    console.log(`📋 Creating ${missingServices.length} fallback services...`);
    
    // Insert fallback services in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < missingServices.length; i += batchSize) {
      const batch = missingServices.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('services')
        .insert(batch)
        .select('id, title, category, subcategory');
        
      if (error) {
        console.error('Error creating fallback services batch:', error);
        throw error;
      }
      
      console.log(`✅ Created batch ${Math.ceil((i + 1) / batchSize)} of ${Math.ceil(missingServices.length / batchSize)}`);
      data?.forEach(service => {
        console.log(`   - ${service.title} (${service.category}/${service.subcategory})`);
      });
    }
    
    console.log('🎉 All fallback services created successfully!');
    
  } catch (error) {
    console.error('❌ Error in createFallbackServices:', error);
    throw error;
  }
};

/**
 * Get statistics about fallback vs real services
 */
export const getServiceStats = async () => {
  const { data: allServices } = await supabase
    .from('services')
    .select('provider_id, active')
    .eq('active', true);
    
  if (!allServices) return null;
  
  const totalServices = allServices.length;
  // Use system provider as indicator of fallback services
  const fallbackServices = allServices.filter(s => s.provider_id === '00000000-0000-4000-8000-000000000001').length;
  const realServices = totalServices - fallbackServices;
  
  return {
    total: totalServices,
    real: realServices,
    fallback: fallbackServices,
    fallbackPercentage: totalServices > 0 ? (fallbackServices / totalServices * 100).toFixed(1) : '0'
  };
};

/**
 * Main function to run the seeding process
 */
export const seedFallbackServices = async (): Promise<void> => {
  console.log('🌱 HOUSIE Fallback Service Seeding Started');
  console.log('=' .repeat(50));
  
  try {
    await createFallbackServices();
    
    const stats = await getServiceStats();
    if (stats) {
      console.log('\n📊 Service Statistics:');
      console.log(`   Total Active Services: ${stats.total}`);
      console.log(`   Real Services: ${stats.real}`);
      console.log(`   Fallback Services: ${stats.fallback} (${stats.fallbackPercentage}%)`);
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
  
  console.log('=' .repeat(50));
  console.log('🎯 Fallback service seeding completed!');
};