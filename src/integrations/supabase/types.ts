export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          after_photos: string[] | null
          before_photos: string[] | null
          cleaner_id: string
          created_at: string | null
          customer_id: string
          id: string
          provider_id: string | null
          service_category_id: string | null
          service_date: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          after_photos?: string[] | null
          before_photos?: string[] | null
          cleaner_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          provider_id?: string | null
          service_category_id?: string | null
          service_date: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          after_photos?: string[] | null
          before_photos?: string[] | null
          cleaner_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          provider_id?: string | null
          service_category_id?: string | null
          service_date?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          image_url: string | null
          is_read: boolean | null
          message_content: string | null
          message_type: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          message_content?: string | null
          message_type?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          message_content?: string | null
          message_type?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          cleaner_id: string
          created_at: string
          customer_id: string
          id: string
          last_message_at: string | null
          updated_at: string
        }
        Insert: {
          cleaner_id: string
          created_at?: string
          customer_id: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Update: {
          cleaner_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          average_rating: number | null
          created_at: string | null
          id: string
          latitude: number | null
          location_permission_granted: boolean | null
          longitude: number | null
          looking_for_cleaning: boolean | null
          postal_code_fallback: string | null
          preferred_contact_method:
            | Database["public"]["Enums"]["contact_method"]
            | null
          service_location_address: string | null
          service_location_postal_code: string | null
          service_needs_description: string | null
          total_reviews: number | null
          updated_at: string | null
          urgency_level: string | null
        }
        Insert: {
          average_rating?: number | null
          created_at?: string | null
          id: string
          latitude?: number | null
          location_permission_granted?: boolean | null
          longitude?: number | null
          looking_for_cleaning?: boolean | null
          postal_code_fallback?: string | null
          preferred_contact_method?:
            | Database["public"]["Enums"]["contact_method"]
            | null
          service_location_address?: string | null
          service_location_postal_code?: string | null
          service_needs_description?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          urgency_level?: string | null
        }
        Update: {
          average_rating?: number | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_permission_granted?: boolean | null
          longitude?: number | null
          looking_for_cleaning?: boolean | null
          postal_code_fallback?: string | null
          preferred_contact_method?:
            | Database["public"]["Enums"]["contact_method"]
            | null
          service_location_address?: string | null
          service_location_postal_code?: string | null
          service_needs_description?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_demand_stats: {
        Row: {
          booking_count: number | null
          city: string
          created_at: string | null
          date: string
          id: string
          total_bookings_value: number | null
          weather_correlation_score: number | null
        }
        Insert: {
          booking_count?: number | null
          city?: string
          created_at?: string | null
          date: string
          id?: string
          total_bookings_value?: number | null
          weather_correlation_score?: number | null
        }
        Update: {
          booking_count?: number | null
          city?: string
          created_at?: string | null
          date?: string
          id?: string
          total_bookings_value?: number | null
          weather_correlation_score?: number | null
        }
        Relationships: []
      }
      masked_communications: {
        Row: {
          cleaner_id: string
          created_at: string | null
          customer_id: string
          expires_at: string
          id: string
          is_active: boolean | null
          proxy_phone_number: string
          updated_at: string | null
        }
        Insert: {
          cleaner_id: string
          created_at?: string | null
          customer_id: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          proxy_phone_number: string
          updated_at?: string | null
        }
        Update: {
          cleaner_id?: string
          created_at?: string | null
          customer_id?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          proxy_phone_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "masked_communications_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "masked_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          masked_communication_id: string | null
          message_content: string | null
          proxy_number: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          masked_communication_id?: string | null
          message_content?: string | null
          proxy_number?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          masked_communication_id?: string | null
          message_content?: string | null
          proxy_number?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_masked_communication_id_fkey"
            columns: ["masked_communication_id"]
            isOneToOne: false
            referencedRelation: "masked_communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          brief_description: string | null
          business_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_email_verified: boolean | null
          latitude: number | null
          longitude: number | null
          phone_number: string | null
          profile_photo_url: string | null
          service_area_city: string | null
          service_radius_km: number | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["user_role"]
          years_experience: number | null
        }
        Insert: {
          brief_description?: string | null
          business_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_email_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          profile_photo_url?: string | null
          service_area_city?: string | null
          service_radius_km?: number | null
          updated_at?: string | null
          user_role: Database["public"]["Enums"]["user_role"]
          years_experience?: number | null
        }
        Update: {
          brief_description?: string | null
          business_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_email_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          profile_photo_url?: string | null
          service_area_city?: string | null
          service_radius_km?: number | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["user_role"]
          years_experience?: number | null
        }
        Relationships: []
      }
      provider_services: {
        Row: {
          base_price: number | null
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          price_unit: string | null
          provider_id: string
          service_category_id: string
        }
        Insert: {
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          price_unit?: string | null
          provider_id: string
          service_category_id: string
        }
        Update: {
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          price_unit?: string | null
          provider_id?: string
          service_category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_services_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_tax_information: {
        Row: {
          business_address: string | null
          business_name: string | null
          business_phone: string | null
          created_at: string | null
          estimated_tax: number | null
          id: string
          provider_id: string
          tax_id_number: string | null
          tax_year: number
          taxable_income: number | null
          total_earnings: number | null
          total_transactions: number | null
          updated_at: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string | null
          estimated_tax?: number | null
          id?: string
          provider_id: string
          tax_id_number?: string | null
          tax_year: number
          taxable_income?: number | null
          total_earnings?: number | null
          total_transactions?: number | null
          updated_at?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string | null
          estimated_tax?: number | null
          id?: string
          provider_id?: string
          tax_id_number?: string | null
          tax_year?: number
          taxable_income?: number | null
          total_earnings?: number | null
          total_transactions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          address: string | null
          average_rating: number | null
          banner_image_url: string | null
          bio: string | null
          business_name: string | null
          created_at: string | null
          hourly_rate: number | null
          id: string
          is_featured: boolean | null
          is_profile_complete: boolean | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          profile_photo_url: string | null
          service_radius_km: number | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          banner_image_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_featured?: boolean | null
          is_profile_complete?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          profile_photo_url?: string | null
          service_radius_km?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          banner_image_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_featured?: boolean | null
          is_profile_complete?: boolean | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          profile_photo_url?: string | null
          service_radius_km?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_providers_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quarterly_summaries: {
        Row: {
          created_at: string | null
          id: string
          provider_id: string
          quarter: number
          total_earnings: number | null
          total_transactions: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_id: string
          quarter: number
          total_earnings?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_id?: string
          quarter?: number
          total_earnings?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      review_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          photo_type: string | null
          photo_url: string
          review_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          photo_type?: string | null
          photo_url: string
          review_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          photo_type?: string | null
          photo_url?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          cleaner_response: string | null
          cleaner_response_date: string | null
          comment: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          photos: string[] | null
          provider_id: string | null
          rating: number
          reviewee_id: string
          reviewer_id: string
          reviewer_type: string
          service_category_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          cleaner_response?: string | null
          cleaner_response_date?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          photos?: string[] | null
          provider_id?: string | null
          rating: number
          reviewee_id: string
          reviewer_id: string
          reviewer_type: string
          service_category_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          cleaner_response?: string | null
          cleaner_response_date?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          photos?: string[] | null
          provider_id?: string | null
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          reviewer_type?: string
          service_category_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_badges: {
        Row: {
          color_class: string | null
          created_at: string | null
          display_name: string
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          display_name: string
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          display_name?: string
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          color_class: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          customer_name: string | null
          description: string | null
          id: string
          payment_method: string | null
          provider_id: string
          receipt_number: string | null
          service_type: string | null
          status: string | null
          transaction_date: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          provider_id: string
          receipt_number?: string | null
          service_type?: string | null
          status?: string | null
          transaction_date: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          provider_id?: string
          receipt_number?: string | null
          service_type?: string | null
          status?: string | null
          transaction_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          is_online: boolean | null
          last_seen: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          city: string
          created_at: string | null
          date: string
          humidity: number | null
          id: string
          precipitation: number | null
          temperature: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          city?: string
          created_at?: string | null
          date: string
          humidity?: number | null
          id?: string
          precipitation?: number | null
          temperature?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          city?: string
          created_at?: string | null
          date?: string
          humidity?: number | null
          id?: string
          precipitation?: number | null
          temperature?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      calculate_weather_demand_correlation: {
        Args: Record<PropertyKey, never>
        Returns: {
          date: string
          precipitation: number
          booking_count: number
          correlation_score: number
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      contact_method: "email" | "phone" | "app_messaging"
      service_type:
        | "regular_cleaning"
        | "deep_cleaning"
        | "move_in_out"
        | "post_construction"
        | "commercial"
      service_type_new:
        | "residential_cleaning"
        | "end_of_lease_cleaning"
        | "commercial_cleaning"
        | "chalet_airbnb_cleaning"
        | "window_washing"
        | "ironing"
        | "light_housekeeping"
        | "deep_cleaning"
      subscription_plan: "starter" | "professional" | "premium" | "client_plus"
      user_role: "customer" | "cleaner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_method: ["email", "phone", "app_messaging"],
      service_type: [
        "regular_cleaning",
        "deep_cleaning",
        "move_in_out",
        "post_construction",
        "commercial",
      ],
      service_type_new: [
        "residential_cleaning",
        "end_of_lease_cleaning",
        "commercial_cleaning",
        "chalet_airbnb_cleaning",
        "window_washing",
        "ironing",
        "light_housekeeping",
        "deep_cleaning",
      ],
      subscription_plan: ["starter", "professional", "premium", "client_plus"],
      user_role: ["customer", "cleaner"],
    },
  },
} as const
