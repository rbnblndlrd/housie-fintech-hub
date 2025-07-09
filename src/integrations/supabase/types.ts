export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      abuse_logs: {
        Row: {
          abuse_type: string
          action_taken: string
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          severity: string | null
          user_id: string
        }
        Insert: {
          abuse_type: string
          action_taken: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          severity?: string | null
          user_id: string
        }
        Update: {
          abuse_type?: string
          action_taken?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          severity?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "abuse_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string | null
          affected_users: number | null
          created_at: string | null
          description: string | null
          details: Json | null
          id: string
          target_ip: unknown | null
        }
        Insert: {
          action_type: string
          admin_user_id?: string | null
          affected_users?: number | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          target_ip?: unknown | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string | null
          affected_users?: number | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          target_ip?: unknown | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
      ai_feature_costs: {
        Row: {
          created_at: string | null
          credit_cost: number
          daily_free_limit: number | null
          description: string | null
          estimated_api_cost: number | null
          feature_name: string
          id: string
          is_active: boolean | null
          is_free_tier: boolean | null
          min_profit_margin: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credit_cost: number
          daily_free_limit?: number | null
          description?: string | null
          estimated_api_cost?: number | null
          feature_name: string
          id?: string
          is_active?: boolean | null
          is_free_tier?: boolean | null
          min_profit_margin?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credit_cost?: number
          daily_free_limit?: number | null
          description?: string | null
          estimated_api_cost?: number | null
          feature_name?: string
          id?: string
          is_active?: boolean | null
          is_free_tier?: boolean | null
          min_profit_margin?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
          accepted_at: string | null
          after_photos: Json | null
          before_photos: Json | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          duration_hours: number | null
          id: string
          instructions: string | null
          payment_status: string | null
          photos_required: boolean | null
          priority: string | null
          provider_id: string
          response_time_minutes: number | null
          scheduled_date: string
          scheduled_time: string
          service_address: string | null
          service_id: string
          service_radius: number | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          after_photos?: Json | null
          before_photos?: Json | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          duration_hours?: number | null
          id?: string
          instructions?: string | null
          payment_status?: string | null
          photos_required?: boolean | null
          priority?: string | null
          provider_id: string
          response_time_minutes?: number | null
          scheduled_date: string
          scheduled_time: string
          service_address?: string | null
          service_id: string
          service_radius?: number | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          after_photos?: Json | null
          before_photos?: Json | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          duration_hours?: number | null
          id?: string
          instructions?: string | null
          payment_status?: string | null
          photos_required?: boolean | null
          priority?: string | null
          provider_id?: string
          response_time_minutes?: number | null
          scheduled_date?: string
          scheduled_time?: string
          service_address?: string | null
          service_id?: string
          service_radius?: number | null
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
      claude_usage_logs: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          query_type: string | null
          session_id: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          query_type?: string | null
          session_id?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          query_type?: string | null
          session_id?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      cluster_bids: {
        Row: {
          bid_amount: number
          cluster_id: string
          created_at: string
          id: string
          message: string | null
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          bid_amount: number
          cluster_id: string
          created_at?: string
          id?: string
          message?: string | null
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          bid_amount?: number
          cluster_id?: string
          created_at?: string
          id?: string
          message?: string | null
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluster_bids_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      cluster_participants: {
        Row: {
          cluster_id: string
          display_name: string
          id: string
          joined_at: string
          preferred_time_blocks: string[] | null
          special_instructions: string | null
          unit_id: string | null
          user_id: string
        }
        Insert: {
          cluster_id: string
          display_name: string
          id?: string
          joined_at?: string
          preferred_time_blocks?: string[] | null
          special_instructions?: string | null
          unit_id?: string | null
          user_id: string
        }
        Update: {
          cluster_id?: string
          display_name?: string
          id?: string
          joined_at?: string
          preferred_time_blocks?: string[] | null
          special_instructions?: string | null
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluster_participants_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      cluster_time_blocks: {
        Row: {
          block_name: string
          cluster_id: string
          created_at: string
          end_time: string
          id: string
          preference_count: number
          start_time: string
        }
        Insert: {
          block_name: string
          cluster_id: string
          created_at?: string
          end_time: string
          id?: string
          preference_count?: number
          start_time: string
        }
        Update: {
          block_name?: string
          cluster_id?: string
          created_at?: string
          end_time?: string
          id?: string
          preference_count?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluster_time_blocks_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      clusters: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string
          max_participants: number
          min_participants: number
          neighborhood: string | null
          organizer_id: string
          participant_count: number
          requires_verification: boolean
          service_type: string
          share_code: string
          status: string
          target_participants: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location: string
          max_participants?: number
          min_participants?: number
          neighborhood?: string | null
          organizer_id: string
          participant_count?: number
          requires_verification?: boolean
          service_type: string
          share_code?: string
          status?: string
          target_participants?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          max_participants?: number
          min_participants?: number
          neighborhood?: string | null
          organizer_id?: string
          participant_count?: number
          requires_verification?: boolean
          service_type?: string
          share_code?: string
          status?: string
          target_participants?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      credit_packages: {
        Row: {
          base_credits: number
          bonus_credits: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price_cad: number
          total_credits: number | null
        }
        Insert: {
          base_credits: number
          bonus_credits?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price_cad: number
          total_credits?: number | null
        }
        Update: {
          base_credits?: number
          bonus_credits?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price_cad?: number
          total_credits?: number | null
        }
        Relationships: []
      }
      credit_usage_logs: {
        Row: {
          api_cost_estimate: number | null
          created_at: string | null
          credits_spent: number
          feature_used: string
          id: string
          profit_margin: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          api_cost_estimate?: number | null
          created_at?: string | null
          credits_spent: number
          feature_used: string
          id?: string
          profit_margin?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          api_cost_estimate?: number | null
          created_at?: string | null
          credits_spent?: number
          feature_used?: string
          id?: string
          profit_margin?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_actions_log: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_id: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_state: Json | null
          previous_state: Json | null
          user_agent: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_state?: Json | null
          previous_state?: Json | null
          user_agent?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_state?: Json | null
          previous_state?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_actions_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_controls: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          allowed_payment_methods: string[] | null
          blocked_countries: string[] | null
          bookings_paused: boolean | null
          claude_access_enabled: boolean | null
          claude_api_enabled: boolean | null
          created_at: string | null
          current_daily_spend: number | null
          daily_spend_limit: number | null
          deactivated_at: string | null
          deactivated_by: string | null
          disabled_at: string | null
          disabled_by_user_id: string | null
          disabled_reason: string | null
          emergency_notification_active: boolean | null
          force_logout_users: boolean | null
          fraud_lockdown_active: boolean | null
          geographic_blocking_enabled: boolean | null
          id: string
          last_backup_triggered: string | null
          last_updated_at: string | null
          maintenance_mode: boolean | null
          manual_review_all_bookings: boolean | null
          messaging_disabled: boolean | null
          new_registrations_disabled: boolean | null
          normal_operations: boolean | null
          payment_restrictions_active: boolean | null
          provider_broadcast_active: boolean | null
          reason: string | null
          spend_reset_date: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          allowed_payment_methods?: string[] | null
          blocked_countries?: string[] | null
          bookings_paused?: boolean | null
          claude_access_enabled?: boolean | null
          claude_api_enabled?: boolean | null
          created_at?: string | null
          current_daily_spend?: number | null
          daily_spend_limit?: number | null
          deactivated_at?: string | null
          deactivated_by?: string | null
          disabled_at?: string | null
          disabled_by_user_id?: string | null
          disabled_reason?: string | null
          emergency_notification_active?: boolean | null
          force_logout_users?: boolean | null
          fraud_lockdown_active?: boolean | null
          geographic_blocking_enabled?: boolean | null
          id?: string
          last_backup_triggered?: string | null
          last_updated_at?: string | null
          maintenance_mode?: boolean | null
          manual_review_all_bookings?: boolean | null
          messaging_disabled?: boolean | null
          new_registrations_disabled?: boolean | null
          normal_operations?: boolean | null
          payment_restrictions_active?: boolean | null
          provider_broadcast_active?: boolean | null
          reason?: string | null
          spend_reset_date?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          allowed_payment_methods?: string[] | null
          blocked_countries?: string[] | null
          bookings_paused?: boolean | null
          claude_access_enabled?: boolean | null
          claude_api_enabled?: boolean | null
          created_at?: string | null
          current_daily_spend?: number | null
          daily_spend_limit?: number | null
          deactivated_at?: string | null
          deactivated_by?: string | null
          disabled_at?: string | null
          disabled_by_user_id?: string | null
          disabled_reason?: string | null
          emergency_notification_active?: boolean | null
          force_logout_users?: boolean | null
          fraud_lockdown_active?: boolean | null
          geographic_blocking_enabled?: boolean | null
          id?: string
          last_backup_triggered?: string | null
          last_updated_at?: string | null
          maintenance_mode?: boolean | null
          manual_review_all_bookings?: boolean | null
          messaging_disabled?: boolean | null
          new_registrations_disabled?: boolean | null
          normal_operations?: boolean | null
          payment_restrictions_active?: boolean | null
          provider_broadcast_active?: boolean | null
          reason?: string | null
          spend_reset_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_controls_activated_by_fkey"
            columns: ["activated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_controls_deactivated_by_fkey"
            columns: ["deactivated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_notifications: {
        Row: {
          admin_id: string
          created_at: string | null
          id: string
          message: string
          notification_type: string
          priority: string | null
          recipients_count: number | null
          sent_at: string | null
          status: string | null
          target_audience: string
          title: string
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          id?: string
          message: string
          notification_type: string
          priority?: string | null
          recipients_count?: number | null
          sent_at?: string | null
          status?: string | null
          target_audience: string
          title: string
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string
          priority?: string | null
          recipients_count?: number | null
          sent_at?: string | null
          status?: string | null
          target_audience?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_notifications_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_device_tracking: {
        Row: {
          device_fingerprint: string
          first_seen: string
          id: string
          last_seen: string
          risk_level: string | null
          total_sessions: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_fingerprint: string
          first_seen?: string
          id?: string
          last_seen?: string
          risk_level?: string | null
          total_sessions?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_fingerprint?: string
          first_seen?: string
          id?: string
          last_seen?: string
          risk_level?: string | null
          total_sessions?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_device_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_ip_tracking: {
        Row: {
          first_seen: string
          id: string
          ip_address: unknown
          last_seen: string
          risk_level: string | null
          total_sessions: number | null
          user_id: string
        }
        Insert: {
          first_seen?: string
          id?: string
          ip_address: unknown
          last_seen?: string
          risk_level?: string | null
          total_sessions?: number | null
          user_id: string
        }
        Update: {
          first_seen?: string
          id?: string
          ip_address?: unknown
          last_seen?: string
          risk_level?: string | null
          total_sessions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_ip_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_logs: {
        Row: {
          action_taken: string
          action_type: string
          created_at: string
          device_fingerprint: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          reasons: string[]
          risk_factors: Json
          risk_score: number
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_taken: string
          action_type: string
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          reasons?: string[]
          risk_factors?: Json
          risk_score: number
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_taken?: string
          action_type?: string
          created_at?: string
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          reasons?: string[]
          risk_factors?: Json
          risk_score?: number
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_session_logs: {
        Row: {
          action_type: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_session_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      google_calendar_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string | null
          scope: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token?: string | null
          scope?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string | null
          scope?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ip_rate_limits: {
        Row: {
          accounts_created_today: number | null
          blocked_until: string | null
          claude_requests_today: number | null
          ip_address: unknown
          last_request: string | null
          last_reset: string | null
          violation_count: number | null
        }
        Insert: {
          accounts_created_today?: number | null
          blocked_until?: string | null
          claude_requests_today?: number | null
          ip_address: unknown
          last_request?: string | null
          last_reset?: string | null
          violation_count?: number | null
        }
        Update: {
          accounts_created_today?: number | null
          blocked_until?: string | null
          claude_requests_today?: number | null
          ip_address?: unknown
          last_request?: string | null
          last_reset?: string | null
          violation_count?: number | null
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
      messaging_permissions: {
        Row: {
          created_at: string | null
          granted_by_booking_id: string | null
          id: string
          permission_type: string | null
          user_one_id: string
          user_two_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by_booking_id?: string | null
          id?: string
          permission_type?: string | null
          user_one_id: string
          user_two_id: string
        }
        Update: {
          created_at?: string | null
          granted_by_booking_id?: string | null
          id?: string
          permission_type?: string | null
          user_one_id?: string
          user_two_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messaging_permissions_granted_by_booking_id_fkey"
            columns: ["granted_by_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messaging_permissions_user_one_id_fkey"
            columns: ["user_one_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messaging_permissions_user_two_id_fkey"
            columns: ["user_two_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      network_connections: {
        Row: {
          connection_type: string | null
          created_at: string | null
          created_from_booking_id: string | null
          customer_id: string
          id: string
          provider_id: string
        }
        Insert: {
          connection_type?: string | null
          created_at?: string | null
          created_from_booking_id?: string | null
          customer_id: string
          id?: string
          provider_id: string
        }
        Update: {
          connection_type?: string | null
          created_at?: string | null
          created_from_booking_id?: string | null
          customer_id?: string
          id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_connections_created_from_booking_id_fkey"
            columns: ["created_from_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_provider_id_fkey"
            columns: ["provider_id"]
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
      payment_attempts: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          device_fingerprint: string | null
          failure_reason: string | null
          fraud_score: number | null
          id: string
          ip_address: unknown | null
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          device_fingerprint?: string | null
          failure_reason?: string | null
          fraud_score?: number | null
          id?: string
          ip_address?: unknown | null
          payment_method?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          device_fingerprint?: string | null
          failure_reason?: string | null
          fraud_score?: number | null
          id?: string
          ip_address?: unknown | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      persistent_notifications: {
        Row: {
          booking_id: string | null
          created_at: string | null
          dismissed_at: string | null
          id: string
          is_persistent: boolean | null
          message: string
          type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          id?: string
          is_persistent?: boolean | null
          message: string
          type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          id?: string
          is_persistent?: boolean | null
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "persistent_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          attempts: number | null
          country_code: string
          created_at: string | null
          expires_at: string
          id: string
          phone_number: string
          user_id: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          country_code?: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone_number: string
          user_id: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          country_code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone_number?: string
          user_id?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          created_at: string | null
          id: string
          points_amount: number
          reason: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points_amount: number
          reason: string
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points_amount?: number
          reason?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          achievement_badges: Json | null
          average_rating: number | null
          background_check_verified: boolean | null
          business_name: string | null
          ccq_license_number: string | null
          ccq_verified: boolean | null
          community_rating_points: number | null
          courtesy_commendations: number | null
          cra_compliant: boolean | null
          created_at: string | null
          description: string | null
          hourly_rate: number | null
          id: string
          insurance_verified: boolean | null
          network_connections: number | null
          professional_license_type:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          professional_license_verified: boolean | null
          quality_commendations: number | null
          rbq_license_number: string | null
          rbq_verified: boolean | null
          reliability_commendations: number | null
          response_time_hours: number | null
          service_radius_km: number | null
          shop_points: number | null
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
          verification_level:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          achievement_badges?: Json | null
          average_rating?: number | null
          background_check_verified?: boolean | null
          business_name?: string | null
          ccq_license_number?: string | null
          ccq_verified?: boolean | null
          community_rating_points?: number | null
          courtesy_commendations?: number | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          network_connections?: number | null
          professional_license_type?:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          professional_license_verified?: boolean | null
          quality_commendations?: number | null
          rbq_license_number?: string | null
          rbq_verified?: boolean | null
          reliability_commendations?: number | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          shop_points?: number | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          achievement_badges?: Json | null
          average_rating?: number | null
          background_check_verified?: boolean | null
          business_name?: string | null
          ccq_license_number?: string | null
          ccq_verified?: boolean | null
          community_rating_points?: number | null
          courtesy_commendations?: number | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          network_connections?: number | null
          professional_license_type?:
            | Database["public"]["Enums"]["professional_license_type"]
            | null
          professional_license_verified?: boolean | null
          quality_commendations?: number | null
          rbq_license_number?: string | null
          rbq_verified?: boolean | null
          reliability_commendations?: number | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          shop_points?: number | null
          total_bookings?: number | null
          total_reviews?: number | null
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
      provider_settings: {
        Row: {
          advance_booking_days: number
          auto_accept_bookings: boolean
          break_duration: number
          buffer_time: number
          created_at: string
          id: string
          min_booking_notice: number
          navigation_preference: string
          service_duration: number
          time_zone: string
          updated_at: string
          user_id: string
          working_hours: Json
        }
        Insert: {
          advance_booking_days?: number
          auto_accept_bookings?: boolean
          break_duration?: number
          buffer_time?: number
          created_at?: string
          id?: string
          min_booking_notice?: number
          navigation_preference?: string
          service_duration?: number
          time_zone?: string
          updated_at?: string
          user_id: string
          working_hours?: Json
        }
        Update: {
          advance_booking_days?: number
          auto_accept_bookings?: boolean
          break_duration?: number
          buffer_time?: number
          created_at?: string
          id?: string
          min_booking_notice?: number
          navigation_preference?: string
          service_duration?: number
          time_zone?: string
          updated_at?: string
          user_id?: string
          working_hours?: Json
        }
        Relationships: []
      }
      review_commendations: {
        Row: {
          commendation_type: string
          created_at: string | null
          id: string
          review_id: string | null
        }
        Insert: {
          commendation_type: string
          created_at?: string | null
          id?: string
          review_id?: string | null
        }
        Update: {
          commendation_type?: string
          created_at?: string | null
          id?: string
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_commendations_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_photos: {
        Row: {
          allow_portfolio_use: boolean | null
          created_at: string | null
          id: string
          photo_url: string
          review_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          allow_portfolio_use?: boolean | null
          created_at?: string | null
          id?: string
          photo_url: string
          review_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          allow_portfolio_use?: boolean | null
          created_at?: string | null
          id?: string
          photo_url?: string
          review_id?: string | null
          uploaded_at?: string | null
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
      review_quality_scores: {
        Row: {
          created_at: string | null
          detail_score: number | null
          helpfulness_rating: number | null
          id: string
          photo_bonus: number | null
          points_awarded: number | null
          quality_score: number
          review_id: string
          reviewer_id: string
          verified_booking: boolean | null
        }
        Insert: {
          created_at?: string | null
          detail_score?: number | null
          helpfulness_rating?: number | null
          id?: string
          photo_bonus?: number | null
          points_awarded?: number | null
          quality_score: number
          review_id: string
          reviewer_id: string
          verified_booking?: boolean | null
        }
        Update: {
          created_at?: string | null
          detail_score?: number | null
          helpfulness_rating?: number | null
          id?: string
          photo_bonus?: number | null
          points_awarded?: number | null
          quality_score?: number
          review_id?: string
          reviewer_id?: string
          verified_booking?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "review_quality_scores_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_quality_scores_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      review_queue: {
        Row: {
          action_type: string
          assigned_at: string | null
          assigned_to: string | null
          created_at: string
          evidence: Json | null
          fraud_session_id: string
          id: string
          priority: string
          resolved_at: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_score: number
          status: string
          user_id: string
        }
        Insert: {
          action_type: string
          assigned_at?: string | null
          assigned_to?: string | null
          created_at?: string
          evidence?: Json | null
          fraud_session_id: string
          id?: string
          priority?: string
          resolved_at?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score: number
          status?: string
          user_id: string
        }
        Update: {
          action_type?: string
          assigned_at?: string | null
          assigned_to?: string | null
          created_at?: string
          evidence?: Json | null
          fraud_session_id?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_score?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_queue_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_user_id_fkey"
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
          network_connection: boolean | null
          provider_id: string
          rating: number
          reviewer_id: string
          verified_transaction: boolean | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          network_connection?: boolean | null
          provider_id: string
          rating: number
          reviewer_id: string
          verified_transaction?: boolean | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          network_connection?: boolean | null
          provider_id?: string
          rating?: number
          reviewer_id?: string
          verified_transaction?: boolean | null
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
      user_blocks: {
        Row: {
          block_type: string
          blocked_at: string
          blocked_by: string | null
          expires_at: string | null
          fraud_session_id: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          reason: string
          unblocked_at: string | null
          unblocked_by: string | null
          user_id: string
        }
        Insert: {
          block_type: string
          blocked_at?: string
          blocked_by?: string | null
          expires_at?: string | null
          fraud_session_id?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          reason: string
          unblocked_at?: string | null
          unblocked_by?: string | null
          user_id: string
        }
        Update: {
          block_type?: string
          blocked_at?: string
          blocked_by?: string | null
          expires_at?: string | null
          fraud_session_id?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          reason?: string
          unblocked_at?: string | null
          unblocked_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_unblocked_by_fkey"
            columns: ["unblocked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          id: string
          last_purchase_at: string | null
          remaining_credits: number | null
          shop_points: number | null
          total_credits: number | null
          updated_at: string | null
          used_credits: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_purchase_at?: string | null
          remaining_credits?: number | null
          shop_points?: number | null
          total_credits?: number | null
          updated_at?: string | null
          used_credits?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_purchase_at?: string | null
          remaining_credits?: number | null
          shop_points?: number | null
          total_credits?: number | null
          updated_at?: string | null
          used_credits?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          achievement_badges: Json | null
          active_role: string | null
          average_rating: number | null
          background_check_verified: boolean | null
          bio: string | null
          business_name: string | null
          can_book_services: boolean | null
          can_provide_services: boolean | null
          ccq_license_number: string | null
          ccq_verified: boolean | null
          community_rating_points: number | null
          company: string | null
          courtesy_commendations: number | null
          cra_compliant: boolean | null
          created_at: string | null
          description: string | null
          full_name: string
          hourly_rate: number | null
          id: string
          insurance_verified: boolean | null
          is_verified: boolean | null
          location: string | null
          network_connections_count: number | null
          network_points: number | null
          phone: string | null
          privacy_level: string | null
          profession: string | null
          professional_license_type: string | null
          professional_license_verified: boolean | null
          profile_image_url: string | null
          profile_type: string | null
          quality_commendations: number | null
          rbq_license_number: string | null
          rbq_verified: boolean | null
          reliability_commendations: number | null
          response_time_hours: number | null
          service_radius_km: number | null
          shop_points: number | null
          show_contact_info: boolean | null
          show_location: boolean | null
          social_facebook: string | null
          social_linkedin: string | null
          total_bookings: number | null
          total_reviews_received: number | null
          updated_at: string | null
          user_id: string
          username: string
          verification_level: string | null
          verified: boolean | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          achievement_badges?: Json | null
          active_role?: string | null
          average_rating?: number | null
          background_check_verified?: boolean | null
          bio?: string | null
          business_name?: string | null
          can_book_services?: boolean | null
          can_provide_services?: boolean | null
          ccq_license_number?: string | null
          ccq_verified?: boolean | null
          community_rating_points?: number | null
          company?: string | null
          courtesy_commendations?: number | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          network_connections_count?: number | null
          network_points?: number | null
          phone?: string | null
          privacy_level?: string | null
          profession?: string | null
          professional_license_type?: string | null
          professional_license_verified?: boolean | null
          profile_image_url?: string | null
          profile_type?: string | null
          quality_commendations?: number | null
          rbq_license_number?: string | null
          rbq_verified?: boolean | null
          reliability_commendations?: number | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          shop_points?: number | null
          show_contact_info?: boolean | null
          show_location?: boolean | null
          social_facebook?: string | null
          social_linkedin?: string | null
          total_bookings?: number | null
          total_reviews_received?: number | null
          updated_at?: string | null
          user_id: string
          username: string
          verification_level?: string | null
          verified?: boolean | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          achievement_badges?: Json | null
          active_role?: string | null
          average_rating?: number | null
          background_check_verified?: boolean | null
          bio?: string | null
          business_name?: string | null
          can_book_services?: boolean | null
          can_provide_services?: boolean | null
          ccq_license_number?: string | null
          ccq_verified?: boolean | null
          community_rating_points?: number | null
          company?: string | null
          courtesy_commendations?: number | null
          cra_compliant?: boolean | null
          created_at?: string | null
          description?: string | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          network_connections_count?: number | null
          network_points?: number | null
          phone?: string | null
          privacy_level?: string | null
          profession?: string | null
          professional_license_type?: string | null
          professional_license_verified?: boolean | null
          profile_image_url?: string | null
          profile_type?: string | null
          quality_commendations?: number | null
          rbq_license_number?: string | null
          rbq_verified?: boolean | null
          reliability_commendations?: number | null
          response_time_hours?: number | null
          service_radius_km?: number | null
          shop_points?: number | null
          show_contact_info?: boolean | null
          show_location?: boolean | null
          social_facebook?: string | null
          social_linkedin?: string | null
          total_bookings?: number | null
          total_reviews_received?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string
          verification_level?: string | null
          verified?: boolean | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      user_rate_limits: {
        Row: {
          abuse_flags: number | null
          basic_messages_used: number | null
          cooldown_until: string | null
          created_at: string | null
          date: string
          last_message_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          abuse_flags?: number | null
          basic_messages_used?: number | null
          cooldown_until?: string | null
          created_at?: string | null
          date?: string
          last_message_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          abuse_flags?: number | null
          basic_messages_used?: number | null
          cooldown_until?: string | null
          created_at?: string | null
          date?: string
          last_message_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rate_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_preferences: {
        Row: {
          auto_switch_based_on_context: boolean | null
          created_at: string | null
          id: string
          primary_role: string
          secondary_roles: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_switch_based_on_context?: boolean | null
          created_at?: string | null
          id?: string
          primary_role?: string
          secondary_roles?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_switch_based_on_context?: boolean | null
          created_at?: string | null
          id?: string
          primary_role?: string
          secondary_roles?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_security_status: {
        Row: {
          claude_access_level: string | null
          created_at: string | null
          daily_claude_count: number | null
          email_verified: boolean | null
          last_claude_reset: string | null
          phone_verified: boolean | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          claude_access_level?: string | null
          created_at?: string | null
          daily_claude_count?: number | null
          email_verified?: boolean | null
          last_claude_reset?: string | null
          phone_verified?: boolean | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          claude_access_level?: string | null
          created_at?: string | null
          daily_claude_count?: number | null
          email_verified?: boolean | null
          last_claude_reset?: string | null
          phone_verified?: boolean | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          accessibility_needs: string | null
          address: string | null
          booking_streak: number | null
          budget_range_max: number | null
          budget_range_min: number | null
          can_provide: boolean | null
          can_seek: boolean | null
          city: string | null
          confidentiality_radius: number | null
          coordinates: unknown | null
          created_at: string | null
          current_location: unknown | null
          email: string
          full_name: string
          fuzzy_location: unknown | null
          gamification_level: number | null
          id: string
          last_booking_date: string | null
          last_fuzzy_update: string | null
          network_count: number | null
          notification_preferences: boolean | null
          password_hash: string | null
          phone: string | null
          postal_code: string | null
          preferred_contact_method: string | null
          preferred_customer_status: boolean | null
          preferred_timing: string | null
          profile_image: string | null
          province: string | null
          service_categories: string[] | null
          service_radius: number | null
          service_type: string | null
          show_on_map: boolean | null
          special_instructions: string | null
          status: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          total_gamification_points: number | null
          updated_at: string | null
          user_role: string | null
        }
        Insert: {
          accessibility_needs?: string | null
          address?: string | null
          booking_streak?: number | null
          budget_range_max?: number | null
          budget_range_min?: number | null
          can_provide?: boolean | null
          can_seek?: boolean | null
          city?: string | null
          confidentiality_radius?: number | null
          coordinates?: unknown | null
          created_at?: string | null
          current_location?: unknown | null
          email: string
          full_name: string
          fuzzy_location?: unknown | null
          gamification_level?: number | null
          id?: string
          last_booking_date?: string | null
          last_fuzzy_update?: string | null
          network_count?: number | null
          notification_preferences?: boolean | null
          password_hash?: string | null
          phone?: string | null
          postal_code?: string | null
          preferred_contact_method?: string | null
          preferred_customer_status?: boolean | null
          preferred_timing?: string | null
          profile_image?: string | null
          province?: string | null
          service_categories?: string[] | null
          service_radius?: number | null
          service_type?: string | null
          show_on_map?: boolean | null
          special_instructions?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          total_gamification_points?: number | null
          updated_at?: string | null
          user_role?: string | null
        }
        Update: {
          accessibility_needs?: string | null
          address?: string | null
          booking_streak?: number | null
          budget_range_max?: number | null
          budget_range_min?: number | null
          can_provide?: boolean | null
          can_seek?: boolean | null
          city?: string | null
          confidentiality_radius?: number | null
          coordinates?: unknown | null
          created_at?: string | null
          current_location?: unknown | null
          email?: string
          full_name?: string
          fuzzy_location?: unknown | null
          gamification_level?: number | null
          id?: string
          last_booking_date?: string | null
          last_fuzzy_update?: string | null
          network_count?: number | null
          notification_preferences?: boolean | null
          password_hash?: string | null
          phone?: string | null
          postal_code?: string | null
          preferred_contact_method?: string | null
          preferred_customer_status?: boolean | null
          preferred_timing?: string | null
          profile_image?: string | null
          province?: string | null
          service_categories?: string[] | null
          service_radius?: number | null
          service_type?: string | null
          show_on_map?: boolean | null
          special_instructions?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          total_gamification_points?: number | null
          updated_at?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      verification_required: {
        Row: {
          completed_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          required_documents: string[] | null
          status: string
          submitted_documents: Json | null
          triggered_by_session: string | null
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          required_documents?: string[] | null
          status?: string
          submitted_documents?: Json | null
          triggered_by_session?: string | null
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          required_documents?: string[] | null
          status?: string
          submitted_documents?: Json | null
          triggered_by_session?: string | null
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_required_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_commendation: {
        Args: { p_provider_user_id: string; p_commendation_type: string }
        Returns: Json
      }
      admin_create_test_review: {
        Args: {
          p_provider_user_id: string
          p_rating: number
          p_comment?: string
          p_add_commendations?: boolean
        }
        Returns: Json
      }
      award_community_rating_points: {
        Args: { p_user_id: string; p_points: number; p_reason: string }
        Returns: undefined
      }
      calculate_shop_points: {
        Args: { community_points: number }
        Returns: number
      }
      check_rate_limit: {
        Args: {
          user_uuid: string
          feature_name: string
          message_length?: number
        }
        Returns: Json
      }
      cleanup_inactive_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      consume_credits: {
        Args: {
          user_uuid: string
          feature_name: string
          api_cost_estimate?: number
          session_uuid?: string
        }
        Returns: Json
      }
      create_review_notification: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_fuzzy_location: {
        Args: { original_point: unknown; radius_meters?: number }
        Returns: unknown
      }
      get_current_daily_spend: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_emergency_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_latest_emergency_controls: {
        Args: Record<PropertyKey, never>
        Returns: {
          activated_at: string | null
          activated_by: string | null
          allowed_payment_methods: string[] | null
          blocked_countries: string[] | null
          bookings_paused: boolean | null
          claude_access_enabled: boolean | null
          claude_api_enabled: boolean | null
          created_at: string | null
          current_daily_spend: number | null
          daily_spend_limit: number | null
          deactivated_at: string | null
          deactivated_by: string | null
          disabled_at: string | null
          disabled_by_user_id: string | null
          disabled_reason: string | null
          emergency_notification_active: boolean | null
          force_logout_users: boolean | null
          fraud_lockdown_active: boolean | null
          geographic_blocking_enabled: boolean | null
          id: string
          last_backup_triggered: string | null
          last_updated_at: string | null
          maintenance_mode: boolean | null
          manual_review_all_bookings: boolean | null
          messaging_disabled: boolean | null
          new_registrations_disabled: boolean | null
          normal_operations: boolean | null
          payment_restrictions_active: boolean | null
          provider_broadcast_active: boolean | null
          reason: string | null
          spend_reset_date: string | null
          updated_at: string
        }
      }
      get_or_create_conversation: {
        Args: {
          p_participant_one_id: string
          p_participant_two_id: string
          p_booking_id?: string
        }
        Returns: string
      }
      get_user_credits: {
        Args: { user_uuid: string }
        Returns: {
          total_credits: number
          used_credits: number
          remaining_credits: number
        }[]
      }
      get_user_current_role: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_user_risk_level: {
        Args: { user_uuid: string }
        Returns: string
      }
      increment_network_connections: {
        Args: { p_provider_user_id: string; p_customer_user_id: string }
        Returns: undefined
      }
      is_claude_api_enabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_blocked: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      log_emergency_action: {
        Args: {
          p_admin_id: string
          p_action_type: string
          p_action_details?: Json
          p_previous_state?: Json
          p_new_state?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: string
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: number
      }
      refresh_fuzzy_locations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      update_daily_spend: {
        Args: { spend_amount: number }
        Returns: boolean
      }
      update_shop_points: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      achievement_category:
        | "speed"
        | "quality"
        | "consistency"
        | "volume"
        | "customer_service"
        | "loyalty"
      achievement_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
      leaderboard_type:
        | "weekly_earnings"
        | "monthly_bookings"
        | "customer_rating"
        | "response_time"
        | "territory_control"
      professional_license_type:
        | "rmt"
        | "physio"
        | "osteo"
        | "chiro"
        | "veterinary"
        | "ccq"
        | "rbq"
        | "pest_control"
      territory_status: "claimed" | "contested" | "abandoned"
      verification_level: "basic" | "background_check" | "professional_license"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "speed",
        "quality",
        "consistency",
        "volume",
        "customer_service",
        "loyalty",
      ],
      achievement_tier: ["bronze", "silver", "gold", "platinum", "diamond"],
      leaderboard_type: [
        "weekly_earnings",
        "monthly_bookings",
        "customer_rating",
        "response_time",
        "territory_control",
      ],
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
      territory_status: ["claimed", "contested", "abandoned"],
      verification_level: ["basic", "background_check", "professional_license"],
    },
  },
} as const
