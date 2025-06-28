
import { supabase } from '@/integrations/supabase/client';

export const createReviewPhotoBucket = async () => {
  try {
    const { data, error } = await supabase.storage.createBucket('review-photos', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (error && !error.message.includes('already exists')) {
      throw error;
    }

    console.log('Review photos bucket ready');
    return true;
  } catch (error) {
    console.error('Error creating review photos bucket:', error);
    return false;
  }
};

export const uploadReviewPhoto = async (file: File, reviewId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${reviewId}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('review-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('review-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading review photo:', error);
    throw error;
  }
};
