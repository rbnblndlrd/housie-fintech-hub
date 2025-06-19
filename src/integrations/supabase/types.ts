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
      ai_chat_sessions: {
        Row: {
          context_data: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          session_title: string | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          session_title?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          session_title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_logs: {
        Row: {
          created_at: string | null
          estimated_cost: number | null
          id: string
          request_type: string | null
          session_id: string | null
          status: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          request_type?: string | null
          session_id?: string | null
          status?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          request_type?: string | null
          session_id?: string | null
          status?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          customer_id: string
          duration_hours: number | null
          id: string
          instructions: string | null
          payment_status: string | null
          provider_id: string
          scheduled_date: string
          scheduled_time: string
          service_address: string | null
          service_coordinates: unknown | null
          service_id: string
          status: string | null
          stripe_payment_intent_id: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          duration_hours?: number | null
          id?: string
          instructions?: string | null
          payment_status?: string | null
          provider_id: string
          scheduled_date: string
          scheduled_time: string
          service_address?: string | null
          service_coordinates?: unknown | null
          service_id: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          duration_hours?: number | null
          id?: string
          instructions?: string | null
          payment_status?: string | null
          provider_id?: string
          scheduled_date?: string
          scheduled_time?: string
          service_address?: string | null
          service_coordinates?: unknown | null
          service_id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_appointments: {
        Row: {
          amount: number | null
          appointment_type: string
          client_name: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          appointment_type?: string
          client_name: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          appointment_type?: string
          client_name?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          booking_id: string | null
          content: string
          conversation_id: string
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_ai_message: boolean | null
          is_read: boolean | null
          message_type: string
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          content: string
          conversation_id: string
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_ai_message?: boolean | null
          is_read?: boolean | null
          message_type?: string
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_ai_message?: boolean | null
          is_read?: boolean | null
          message_type?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          last_message_id: string | null
          participant_one_id: string
          participant_two_id: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          last_message_id?: string | null
          participant_one_id: string
          participant_two_id: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          last_message_id?: string | null
          participant_one_id?: string
          participant_two_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_one_id_fkey"
            columns: ["participant_one_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_two_id_fkey"
            columns: ["participant_two_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_controls: {
        Row: {
          claude_api_enabled: boolean | null
          created_at: string | null
          current_daily_spend: number | null
          daily_spend_limit: number | null
          disabled_at: string | null
          disabled_by_user_id: string | null
          disabled_reason: string | null
          id: string
          last_updated_at: string | null
          spend_reset_date: string | null
        }
        Insert: {
          claude_api_enabled?: boolean | null
          created_at?: string | null
          current_daily_spend?: number | null
          daily_spend_limit?: number | null
          disabled_at?: string | null
          disabled_by_user_id?: string | null
          disabled_reason?: string | null
          id?: string
          last_updated_at?: string | null
          spend_reset_date?: string | null
        }
        Update: {
          claude_api_enabled?: boolean | null
          created_at?: string | null
          current_daily_spend?: number | null
          daily_spend_limit?: number | null
          disabled_at?: string | null
          disabled_by_user_id?: string | null
          disabled_reason?: string | null
          id?: string
          last_updated_at?: string | null
          spend_reset_date?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          booking_id: string
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          booking_id?: string
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_profiles: {
        Row: {
          average_rating: number | null
          background_check_verified: boolean | null
          business_name: string | null
          ccq_license_number: string | null
          ccq_verified: boolean | null
          cra_compliant: boolean | null
          created_at: string | null
          description: string | null
          hourly_rate: number | null
          id: string
          insurance_verified: boolean | null
          professional_license_type:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          professional_license_verified: boolean | null
          rbq_license_number: string | null
          rbq_verified: boolean | null
          response_time_hours: number | null
          service_radius_km: number | null
          total_bookings: number | null
          updated_at: string | null
          user_id: string
          verification_level:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          background_check_verified?: boolean | null
          business_name?: string | null
          ccq_license_number?: string | null
          ccq_verified?: boolean | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          professional_license_type?:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          professional_license_verified?: boolean | null
          rbq_license_number?: string | null
          rbq_verified?: boolean | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          total_bookings?: number | null
          updated_at?: string | null
          user_id: string
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          background_check_verified?: boolean | null
          business_name?: string | null
          ccq_license_number?: string | null
          ccq_verified?: boolean | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          professional_license_type?:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          professional_license_verified?: boolean | null
          rbq_license_number?: string | null
          rbq_verified?: boolean | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          total_bookings?: number | null
          updated_at?: string | null
          user_id?: string
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          provider_id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          provider_id: string
          rating: number
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string
          rating?: number
          reviewer_id?: string
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
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_subcategories: {
        Row: {
          background_check_required: boolean | null
          category: string
          ccq_rbq_required: boolean | null
          created_at: string | null
          description: string | null
          icon: string
          id: string
          professional_license_required: boolean | null
          professional_license_type:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          risk_category: string | null
          subcategory: string
          subcategory_id: string
        }
        Insert: {
          background_check_required?: boolean | null
          category: string
          ccq_rbq_required?: boolean | null
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          professional_license_required?: boolean | null
          professional_license_type?:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          risk_category?: string | null
          subcategory: string
          subcategory_id: string
        }
        Update: {
          background_check_required?: boolean | null
          category?: string
          ccq_rbq_required?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          professional_license_required?: boolean | null
          professional_license_type?:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          risk_category?: string | null
          subcategory?: string
          subcategory_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          background_check_required: boolean | null
          base_price: number | null
          category: string
          ccq_rbq_required: boolean | null
          created_at: string | null
          description: string | null
          id: string
          pricing_type: string | null
          provider_id: string
          risk_category: string | null
          subcategory: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          background_check_required?: boolean | null
          base_price?: number | null
          category: string
          ccq_rbq_required?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          pricing_type?: string | null
          provider_id: string
          risk_category?: string | null
          subcategory?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          background_check_required?: boolean | null
          base_price?: number | null
          category?: string
          ccq_rbq_required?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          pricing_type?: string | null
          provider_id?: string
          risk_category?: string | null
          subcategory?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          current_page: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          latitude: number | null
          login_time: string | null
          longitude: number | null
          region: string | null
          session_token: string
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_page?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          latitude?: number | null
          login_time?: string | null
          longitude?: number | null
          region?: string | null
          session_token: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_page?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          latitude?: number | null
          login_time?: string | null
          longitude?: number | null
          region?: string | null
          session_token?: string
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          can_provide: boolean | null
          can_seek: boolean | null
          city: string | null
          coordinates: unknown | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          password_hash: string | null
          phone: string | null
          postal_code: string | null
          profile_image: string | null
          province: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_role: string | null
        }
        Insert: {
          address?: string | null
          can_provide?: boolean | null
          can_seek?: boolean | null
          city?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          password_hash?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_image?: string | null
          province?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Update: {
          address?: string | null
          can_provide?: boolean | null
          can_seek?: boolean | null
          city?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          password_hash?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_image?: string | null
          province?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_inactive_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_daily_spend: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_or_create_conversation: {
        Args: {
          p_participant_one_id: string
          p_participant_two_id: string
          p_booking_id?: string
        }
        Returns: string
      }
      is_claude_api_enabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: number
      }
      update_daily_spend: {
        Args: { spend_amount: number }
        Returns: boolean
      }
    }
    Enums: {
      professional_license_type:
        | "rmt"
        | "physio"
        | "osteo"
        | "chiro"
        | "veterinary"
        | "ccq"
        | "rbq"
        | "pest_control"
      verification_level: "basic" | "background_check" | "professional_license"
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
      professional_license_type: [
        "rmt",
        "physio",
        "osteo",
        "chiro",
        "veterinary",
        "ccq",
        "rbq",
        "pest_control",
      ],
      verification_level: ["basic", "background_check", "professional_license"],
    },
  },
} as const
