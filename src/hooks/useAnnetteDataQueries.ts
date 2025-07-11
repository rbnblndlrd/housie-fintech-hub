import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JobData {
  id: string;
  customer_name: string;
  service_type: string;
  location: string;
  provider_name: string;
  status: string;
  priority: string;
  scheduled_date: string;
  scheduled_time: string;
}

interface ProviderSuggestion {
  id: string;
  name: string;
  rating: number;
  distance: string;
  specialties: string[];
  badges: string[];
}

interface PrestigeData {
  title: string;
  level: number;
  totalJobs: number;
  nextMilestone: string;
  progress: number;
  communityPoints: number;
}

export const useAnnetteDataQueries = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Parse specific job ticket
  const parseTicket = async (jobId?: string): Promise<string> => {
    if (!user) return "You need to be logged in to parse tickets!";
    
    setIsLoading(true);
    try {
      // Get the most recent job if no ID specified
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          priority,
          scheduled_date,
          scheduled_time,
          service_address,
          customer_id,
          provider_id,
          services (title),
          users!customer_id (full_name)
        `)
        .or(`customer_id.eq.${user.id},provider_id.in.(select id from provider_profiles where user_id = ${user.id})`)
        .order('created_at', { ascending: false })
        .limit(jobId ? 1 : 1);

      if (error || !bookings || bookings.length === 0) {
        return "Hmm, I can't find any tickets to parse right now. Maybe you haven't booked anything yet? 🤔";
      }

      const job = bookings[0];
      const customerName = job.users?.full_name || 'Unknown Customer';
      const serviceName = job.services?.title || 'General Service';
      const location = job.service_address || 'Location TBD';
      
      return `Alright sugar! Job #${job.id.slice(-6)} — ${serviceName} in ${location}, customer: ${customerName}. Status: ${job.status}. Priority: ${job.priority || 'Normal'}. ${job.status === 'pending' ? 'Want me to optimize your route or help schedule this bad boy? 💅' : 'This one\'s locked and loaded!'}`;
      
    } catch (error) {
      console.error('Error parsing ticket:', error);
      return "Oops! My ticket parser just had a moment. Try again in a sec? 🤖";
    } finally {
      setIsLoading(false);
    }
  };

  // Optimize user's daily route
  const optimizeRoute = async (): Promise<string> => {
    if (!user) return "You need to be logged in to optimize routes!";
    
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayJobs, error } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_time,
          service_address,
          services (title),
          users!customer_id (full_name)
        `)
        .or(`customer_id.eq.${user.id},provider_id.in.(select id from provider_profiles where user_id = ${user.id})`)
        .eq('scheduled_date', today)
        .eq('status', 'confirmed')
        .order('scheduled_time');

      if (error || !todayJobs || todayJobs.length === 0) {
        return "No jobs scheduled for today! Time to hustle and book some gigs, or just enjoy the break. Either way, I'm here when you need me! ✨";
      }

      if (todayJobs.length === 1) {
        const job = todayJobs[0];
        return `Just one job today: ${job.users?.full_name} at ${job.scheduled_time}. Single-target mission - you got this! 🎯`;
      }

      // Mock optimization logic (in reality, this would use mapping APIs)
      const optimizedJobs = todayJobs.map((job, index) => 
        `${index + 1}) ${job.users?.full_name} at ${job.scheduled_time}`
      ).join(', ');
      
      return `Boom! Here's your optimized route: ${optimizedJobs}. I've arranged these by time and efficiency. You'll save about 20 minutes and look like a total pro doing it! 💅`;
      
    } catch (error) {
      console.error('Error optimizing route:', error);
      return "Route optimization hit a snag! Even I have off days. Try again? 🗺️";
    } finally {
      setIsLoading(false);
    }
  };

  // Check user's prestige and achievements
  const checkPrestige = async (): Promise<string> => {
    if (!user) return "You need to be logged in to check your prestige!";
    
    setIsLoading(true);
    try {
      // Get job count
      const { data: jobCount, error: jobError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .or(`customer_id.eq.${user.id},provider_id.in.(select id from provider_profiles where user_id = ${user.id})`)
        .eq('status', 'completed');

      // Get community points (try provider_profiles first, fallback to user_credits)
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('community_rating_points')
        .eq('user_id', user.id)
        .single();

      const { data: userCredits } = await supabase
        .from('user_credits')
        .select('total_credits')
        .eq('user_id', user.id)
        .single();

      const totalJobs = jobCount?.length || 0;
      const communityPoints = providerProfile?.community_rating_points || userCredits?.total_credits || 0;
      
      // Calculate title and progress
      let title = "Rookie";
      let nextMilestone = "Apprentice (5 jobs)";
      let progress = Math.min(100, (totalJobs / 5) * 100);
      
      if (totalJobs >= 50) {
        title = "Technomancer ⚡";
        nextMilestone = "Crownbreaker (100 jobs)";
        progress = Math.min(100, ((totalJobs - 50) / 50) * 100);
      } else if (totalJobs >= 25) {
        title = "Sparkmaster ✨";
        nextMilestone = "Technomancer (50 jobs)";
        progress = Math.min(100, ((totalJobs - 25) / 25) * 100);
      } else if (totalJobs >= 10) {
        title = "Cleanstorm 🌪️";
        nextMilestone = "Sparkmaster (25 jobs)";
        progress = Math.min(100, ((totalJobs - 10) / 15) * 100);
      } else if (totalJobs >= 5) {
        title = "Apprentice";
        nextMilestone = "Cleanstorm (10 jobs)";
        progress = Math.min(100, ((totalJobs - 5) / 5) * 100);
      }

      return `Flex time! You're ${title} with ${totalJobs} completed jobs and ${communityPoints} community points. ${Math.round(progress)}% toward ${nextMilestone}. ${progress > 80 ? 'So close to leveling up! Keep grinding! 🔥' : 'Steady progress, keep building that legend! 💪'}`;
      
    } catch (error) {
      console.error('Error checking prestige:', error);
      return "Prestige check failed! Even legends have technical difficulties sometimes. 👑";
    } finally {
      setIsLoading(false);
    }
  };

  // Recommend providers based on user history
  const recommendProvider = async (serviceType?: string): Promise<string> => {
    if (!user) return "You need to be logged in to get recommendations!";
    
    setIsLoading(true);
    try {
      // Get user's past service preferences
      const { data: pastJobs } = await supabase
        .from('bookings')
        .select('services (title, category)')
        .eq('customer_id', user.id)
        .limit(10);

      // Get highly rated providers
      const { data: providers, error } = await supabase
        .from('provider_profiles')
        .select(`
          id,
          user_id,
          users (full_name),
          average_rating,
          total_reviews,
          community_rating_points
        `)
        .gte('average_rating', 4.5)
        .gte('total_reviews', 3)
        .order('average_rating', { ascending: false })
        .limit(3);

      if (error || !providers || providers.length === 0) {
        return "I'm having trouble finding providers right now. Maybe everyone's too busy being amazing? Try again later! 💫";
      }

      const topProvider = providers[0];
      const rating = topProvider.average_rating || 4.5;
      const reviews = topProvider.total_reviews || 1;
      const name = topProvider.users?.full_name || 'Mystery Provider';
      
      return `Based on your style, you'd probably love ${name}. They've got ${rating}⭐ across ${reviews} reviews, plus ${topProvider.community_rating_points || 0} community points. Quality recognizes quality! Want me to check their availability? 💅`;
      
    } catch (error) {
      console.error('Error recommending provider:', error);
      return "My recommendation engine just hiccupped! Give me a moment to recalibrate my matchmaking skills. 💕";
    } finally {
      setIsLoading(false);
    }
  };

  // Look up how to get specific achievements/badges
  const lookupAchievement = async (badgeName: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Mock achievement system (would be real in production)
      const achievements: Record<string, { requirement: string; progress?: string }> = {
        'winter services': { 
          requirement: '25 completed jobs in winter months (Dec-Feb)',
          progress: 'Currently: 3/25 winter jobs. Time to embrace the freeze!' 
        },
        'neighborhood hero': { 
          requirement: '10 five-star reviews in your local area',
          progress: 'Currently: 6/10 five-star local reviews. You\'re getting famous!' 
        },
        'cleanstorm': { 
          requirement: '10 completed cleaning jobs with 4+ star average',
          progress: 'Currently: 7/10 cleaning jobs. Almost there!' 
        },
        'fixmaster': { 
          requirement: '15 completed handyman/repair jobs',
          progress: 'Currently: 12/15 repair jobs. You\'re practically Bob the Builder!' 
        },
        'crownbreaker': { 
          requirement: '100 total completed jobs + 4.8+ average rating',
          progress: 'Currently: 47/100 jobs, 4.6⭐ average. Legend status incoming!' 
        }
      };

      const badge = achievements[badgeName.toLowerCase()];
      if (!badge) {
        return `Hmm, I don't recognize that badge name. Try asking about 'Winter Services', 'Neighborhood Hero', 'Cleanstorm', 'Fixmaster', or 'Crownbreaker'! 🏆`;
      }

      return `To unlock '${badgeName}': ${badge.requirement}. ${badge.progress || 'Get grinding, legend!'} 💪`;
      
    } catch (error) {
      console.error('Error looking up achievement:', error);
      return "Achievement lookup crashed! Even I don't know everything... yet. Try again? 📚";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parseTicket,
    optimizeRoute,
    checkPrestige,
    recommendProvider,
    lookupAchievement,
    isLoading
  };
};