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
          created_at: string | null
          customer_id: string
          duration_hours: number | null
          id: string
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
      provider_profiles: {
        Row: {
          average_rating: number | null
          business_name: string | null
          cra_compliant: boolean | null
          created_at: string | null
          description: string | null
          hourly_rate: number | null
          id: string
          insurance_verified: boolean | null
          response_time_hours: number | null
          service_radius_km: number | null
          total_bookings: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          business_name?: string | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          total_bookings?: number | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          business_name?: string | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          total_bookings?: number | null
          updated_at?: string | null
          user_id?: string
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
      services: {
        Row: {
          active: boolean | null
          base_price: number | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          pricing_type: string | null
          provider_id: string
          subcategory: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          base_price?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          pricing_type?: string | null
          provider_id: string
          subcategory?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          base_price?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          pricing_type?: string | null
          provider_id?: string
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
