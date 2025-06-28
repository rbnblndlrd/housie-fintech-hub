
-- Add new fields to provider_profiles table for tracking stats
ALTER TABLE provider_profiles 
ADD COLUMN network_connections integer DEFAULT 0,
ADD COLUMN community_rating_points integer DEFAULT 0,
ADD COLUMN total_reviews integer DEFAULT 0,
ADD COLUMN quality_commendations integer DEFAULT 0,
ADD COLUMN reliability_commendations integer DEFAULT 0,
ADD COLUMN courtesy_commendations integer DEFAULT 0;

-- Create review_photos table for storing customer photos
CREATE TABLE review_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  allow_portfolio_use boolean DEFAULT false,
  uploaded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create review_commendations table for storing commendation data
CREATE TABLE review_commendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  commendation_type text NOT NULL CHECK (commendation_type IN ('quality', 'reliability', 'courtesy')),
  created_at timestamp with time zone DEFAULT now()
);

-- Create persistent_notifications table for managing ongoing notifications
CREATE TABLE persistent_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_persistent boolean DEFAULT true,
  dismissed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_commendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE persistent_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for review_photos
CREATE POLICY "Users can view review photos" 
  ON review_photos FOR SELECT 
  USING (true); -- Photos are public once uploaded

CREATE POLICY "Review authors can insert photos" 
  ON review_photos FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_photos.review_id 
      AND reviews.reviewer_id = auth.uid()
    )
  );

-- RLS policies for review_commendations
CREATE POLICY "Users can view commendations" 
  ON review_commendations FOR SELECT 
  USING (true); -- Commendations are public

CREATE POLICY "Review authors can insert commendations" 
  ON review_commendations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_commendations.review_id 
      AND reviews.reviewer_id = auth.uid()
    )
  );

-- RLS policies for persistent_notifications
CREATE POLICY "Users can view their own notifications" 
  ON persistent_notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON persistent_notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to update provider stats when reviews are added
CREATE OR REPLACE FUNCTION update_provider_stats_on_review()
RETURNS trigger AS $$
BEGIN
  -- Update total_reviews count
  UPDATE provider_profiles 
  SET total_reviews = (
    SELECT COUNT(*) FROM reviews 
    WHERE provider_id = NEW.provider_id
  )
  WHERE id = NEW.provider_id;
  
  -- Update average_rating
  UPDATE provider_profiles 
  SET average_rating = (
    SELECT AVG(rating) FROM reviews 
    WHERE provider_id = NEW.provider_id
  )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update provider stats on new reviews
CREATE TRIGGER update_provider_stats_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_stats_on_review();

-- Function to update commendation counts
CREATE OR REPLACE FUNCTION update_commendation_counts()
RETURNS trigger AS $$
BEGIN
  -- Update commendation counts for the provider
  UPDATE provider_profiles 
  SET 
    quality_commendations = (
      SELECT COUNT(*) FROM review_commendations rc
      JOIN reviews r ON rc.review_id = r.id
      WHERE r.provider_id = (
        SELECT provider_id FROM reviews WHERE id = NEW.review_id
      ) AND rc.commendation_type = 'quality'
    ),
    reliability_commendations = (
      SELECT COUNT(*) FROM review_commendations rc
      JOIN reviews r ON rc.review_id = r.id
      WHERE r.provider_id = (
        SELECT provider_id FROM reviews WHERE id = NEW.review_id
      ) AND rc.commendation_type = 'reliability'
    ),
    courtesy_commendations = (
      SELECT COUNT(*) FROM review_commendations rc
      JOIN reviews r ON rc.review_id = r.id
      WHERE r.provider_id = (
        SELECT provider_id FROM reviews WHERE id = NEW.review_id
      ) AND rc.commendation_type = 'courtesy'
    )
  WHERE id = (
    SELECT provider_id FROM reviews WHERE id = NEW.review_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update commendation counts
CREATE TRIGGER update_commendation_counts_trigger
  AFTER INSERT ON review_commendations
  FOR EACH ROW
  EXECUTE FUNCTION update_commendation_counts();

-- Function to award community rating points
CREATE OR REPLACE FUNCTION award_community_points(
  p_provider_id uuid,
  p_points integer,
  p_reason text
) RETURNS void AS $$
BEGIN
  UPDATE provider_profiles 
  SET community_rating_points = community_rating_points + p_points
  WHERE id = p_provider_id;
  
  -- Log the point transaction
  INSERT INTO point_transactions (user_id, points_amount, reason, transaction_type)
  SELECT user_id, p_points, p_reason, 'earned'
  FROM provider_profiles 
  WHERE id = p_provider_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create persistent notification for pending reviews
CREATE OR REPLACE FUNCTION create_review_notification()
RETURNS void AS $$
BEGIN
  -- Create notifications for bookings completed 24+ hours ago without reviews
  INSERT INTO persistent_notifications (user_id, type, booking_id, message)
  SELECT 
    b.customer_id,
    'pending_review',
    b.id,
    'Awaiting Review (1)'
  FROM bookings b
  WHERE b.status = 'completed'
    AND b.completed_at < now() - INTERVAL '24 hours'
    AND NOT EXISTS (
      SELECT 1 FROM reviews r WHERE r.booking_id = b.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM persistent_notifications pn 
      WHERE pn.booking_id = b.id AND pn.type = 'pending_review' AND pn.dismissed_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;
