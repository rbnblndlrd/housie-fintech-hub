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
      admin_fallback_settings: {
        Row: {
          allow_retroactive_photo_unlocks: boolean | null
          auto_remind_client_before_service: boolean | null
          created_at: string | null
          enable_checklist_fallback_flow: boolean | null
          fallback_approval_timeout_hours: number | null
          id: string
          updated_at: string | null
        }
        Insert: {
          allow_retroactive_photo_unlocks?: boolean | null
          auto_remind_client_before_service?: boolean | null
          created_at?: string | null
          enable_checklist_fallback_flow?: boolean | null
          fallback_approval_timeout_hours?: number | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          allow_retroactive_photo_unlocks?: boolean | null
          auto_remind_client_before_service?: boolean | null
          created_at?: string | null
          enable_checklist_fallback_flow?: boolean | null
          fallback_approval_timeout_hours?: number | null
          id?: string
          updated_at?: string | null
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
      ai_credit_logs: {
        Row: {
          action: string
          created_at: string | null
          credits_used: number
          id: string
          metadata: Json | null
          result: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          credits_used?: number
          id?: string
          metadata?: Json | null
          result?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          credits_used?: number
          id?: string
          metadata?: Json | null
          result?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_credits: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          last_granted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          last_granted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          last_granted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      annette_quotes: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          locked: boolean | null
          page: string
          source: string | null
          text: string
          tier: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          locked?: boolean | null
          page?: string
          source?: string | null
          text: string
          tier?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          locked?: boolean | null
          page?: string
          source?: string | null
          text?: string
          tier?: string | null
          updated_at?: string
        }
        Relationships: []
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
          ai_analysis: Json | null
          before_photos: Json | null
          category: string | null
          completed_at: string | null
          created_at: string | null
          creates_service_connection: boolean | null
          custom_title: string | null
          customer_id: string
          duration_hours: number | null
          id: string
          instructions: string | null
          messaging_tier_unlocked: string | null
          parsed: boolean | null
          parsed_at: string | null
          payment_status: string | null
          photos_required: boolean | null
          priority: string | null
          provider_id: string | null
          response_time_minutes: number | null
          scheduled_date: string
          scheduled_time: string
          service_address: string | null
          service_id: string | null
          service_radius: number | null
          service_title: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          subcategory: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          after_photos?: Json | null
          ai_analysis?: Json | null
          before_photos?: Json | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          creates_service_connection?: boolean | null
          custom_title?: string | null
          customer_id: string
          duration_hours?: number | null
          id?: string
          instructions?: string | null
          messaging_tier_unlocked?: string | null
          parsed?: boolean | null
          parsed_at?: string | null
          payment_status?: string | null
          photos_required?: boolean | null
          priority?: string | null
          provider_id?: string | null
          response_time_minutes?: number | null
          scheduled_date: string
          scheduled_time: string
          service_address?: string | null
          service_id?: string | null
          service_radius?: number | null
          service_title?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          subcategory?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          after_photos?: Json | null
          ai_analysis?: Json | null
          before_photos?: Json | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          creates_service_connection?: boolean | null
          custom_title?: string | null
          customer_id?: string
          duration_hours?: number | null
          id?: string
          instructions?: string | null
          messaging_tier_unlocked?: string | null
          parsed?: boolean | null
          parsed_at?: string | null
          payment_status?: string | null
          photos_required?: boolean | null
          priority?: string | null
          provider_id?: string | null
          response_time_minutes?: number | null
          scheduled_date?: string
          scheduled_time?: string
          service_address?: string | null
          service_id?: string | null
          service_radius?: number | null
          service_title?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          subcategory?: string | null
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
      broadcast_reactions: {
        Row: {
          broadcast_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          broadcast_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_reactions_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "canonical_broadcast_events"
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
      canon_echo_reactions: {
        Row: {
          created_at: string
          echo_id: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          echo_id: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          echo_id?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "canon_echo_reactions_echo_id_fkey"
            columns: ["echo_id"]
            isOneToOne: false
            referencedRelation: "canon_echoes"
            referencedColumns: ["id"]
          },
        ]
      }
      canon_echoes: {
        Row: {
          broadcast_range: string | null
          canon_confidence: number | null
          canonical: boolean
          city: string | null
          command: string | null
          created_at: string
          engagement_count: number | null
          expires_at: string | null
          generated_by: string | null
          geographic_location: unknown | null
          id: string
          is_active: boolean | null
          job_id: string | null
          location: string
          message: string
          prestige_title_id: string | null
          reactions_count: number | null
          season_id: string | null
          source: string
          stamp_id: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
          verified_data: boolean | null
          visibility: string
        }
        Insert: {
          broadcast_range?: string | null
          canon_confidence?: number | null
          canonical?: boolean
          city?: string | null
          command?: string | null
          created_at?: string
          engagement_count?: number | null
          expires_at?: string | null
          generated_by?: string | null
          geographic_location?: unknown | null
          id?: string
          is_active?: boolean | null
          job_id?: string | null
          location?: string
          message: string
          prestige_title_id?: string | null
          reactions_count?: number | null
          season_id?: string | null
          source?: string
          stamp_id?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          verified_data?: boolean | null
          visibility?: string
        }
        Update: {
          broadcast_range?: string | null
          canon_confidence?: number | null
          canonical?: boolean
          city?: string | null
          command?: string | null
          created_at?: string
          engagement_count?: number | null
          expires_at?: string | null
          generated_by?: string | null
          geographic_location?: unknown | null
          id?: string
          is_active?: boolean | null
          job_id?: string | null
          location?: string
          message?: string
          prestige_title_id?: string | null
          reactions_count?: number | null
          season_id?: string | null
          source?: string
          stamp_id?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          verified_data?: boolean | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "canon_echoes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      canon_events: {
        Row: {
          annette_commentary: string | null
          canon_rank: string
          created_at: string
          description: string | null
          echo_scope: string
          echo_score: number
          event_source_type: string | null
          event_type: string
          id: string
          origin_dashboard: string | null
          related_user_ids: string[] | null
          stamp_id: string | null
          timestamp: string
          title: string
          updated_at: string
          user_id: string
          vote_count: number | null
          vote_score: number | null
        }
        Insert: {
          annette_commentary?: string | null
          canon_rank?: string
          created_at?: string
          description?: string | null
          echo_scope?: string
          echo_score?: number
          event_source_type?: string | null
          event_type: string
          id?: string
          origin_dashboard?: string | null
          related_user_ids?: string[] | null
          stamp_id?: string | null
          timestamp?: string
          title: string
          updated_at?: string
          user_id: string
          vote_count?: number | null
          vote_score?: number | null
        }
        Update: {
          annette_commentary?: string | null
          canon_rank?: string
          created_at?: string
          description?: string | null
          echo_scope?: string
          echo_score?: number
          event_source_type?: string | null
          event_type?: string
          id?: string
          origin_dashboard?: string | null
          related_user_ids?: string[] | null
          stamp_id?: string | null
          timestamp?: string
          title?: string
          updated_at?: string
          user_id?: string
          vote_count?: number | null
          vote_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "canon_events_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamp_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      canon_rank_snapshots: {
        Row: {
          canon_ratio: number
          city: string
          created_at: string
          date: string
          id: string
          prestige_tier: number
          rank_change: number | null
          rank_position: number | null
          score: number
          streak_days: number
          user_id: string
        }
        Insert: {
          canon_ratio?: number
          city?: string
          created_at?: string
          date?: string
          id?: string
          prestige_tier?: number
          rank_change?: number | null
          rank_position?: number | null
          score?: number
          streak_days?: number
          user_id: string
        }
        Update: {
          canon_ratio?: number
          city?: string
          created_at?: string
          date?: string
          id?: string
          prestige_tier?: number
          rank_change?: number | null
          rank_position?: number | null
          score?: number
          streak_days?: number
          user_id?: string
        }
        Relationships: []
      }
      canon_reactions: {
        Row: {
          event_id: string
          id: string
          reaction_type: string
          timestamp: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          reaction_type: string
          timestamp?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          reaction_type?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "canon_reactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "canon_events"
            referencedColumns: ["id"]
          },
        ]
      }
      canon_seasons: {
        Row: {
          active: boolean
          created_at: string
          end_date: string
          id: string
          name: string
          seasonal_stamp_variants: string[] | null
          seasonal_title_rewards: string[] | null
          start_date: string
          theme: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_date: string
          id?: string
          name: string
          seasonal_stamp_variants?: string[] | null
          seasonal_title_rewards?: string[] | null
          start_date: string
          theme: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          seasonal_stamp_variants?: string[] | null
          seasonal_title_rewards?: string[] | null
          start_date?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      canon_subscriptions: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
          id: string
          minimum_rank: string
          subscribed_event_types: string[] | null
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
          id?: string
          minimum_rank?: string
          subscribed_event_types?: string[] | null
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
          id?: string
          minimum_rank?: string
          subscribed_event_types?: string[] | null
        }
        Relationships: []
      }
      canon_thread_entries: {
        Row: {
          canon_level: string
          entry_id: string
          id: string
          linked_event_id: string | null
          message: string
          metadata: Json | null
          source_type: string
          thread_id: string
          timestamp: string
        }
        Insert: {
          canon_level?: string
          entry_id: string
          id?: string
          linked_event_id?: string | null
          message: string
          metadata?: Json | null
          source_type?: string
          thread_id: string
          timestamp?: string
        }
        Update: {
          canon_level?: string
          entry_id?: string
          id?: string
          linked_event_id?: string | null
          message?: string
          metadata?: Json | null
          source_type?: string
          thread_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "canon_thread_entries_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "canon_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      canon_threads: {
        Row: {
          created_at: string
          emoji_tag: string | null
          id: string
          is_public: boolean | null
          is_starred: boolean | null
          root_message: string
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji_tag?: string | null
          id?: string
          is_public?: boolean | null
          is_starred?: boolean | null
          root_message: string
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji_tag?: string | null
          id?: string
          is_public?: boolean | null
          is_starred?: boolean | null
          root_message?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      canon_user_preferences: {
        Row: {
          canon_event_history_visible: boolean
          created_at: string
          echo_visibility: string
          id: string
          location_sharing_enabled: boolean
          manual_stamp_review_enabled: boolean
          sassiness_intensity: number
          show_canon_badge_on_profile: boolean
          stamp_visibility: string
          updated_at: string
          user_id: string
          voice_style: string
        }
        Insert: {
          canon_event_history_visible?: boolean
          created_at?: string
          echo_visibility?: string
          id?: string
          location_sharing_enabled?: boolean
          manual_stamp_review_enabled?: boolean
          sassiness_intensity?: number
          show_canon_badge_on_profile?: boolean
          stamp_visibility?: string
          updated_at?: string
          user_id: string
          voice_style?: string
        }
        Update: {
          canon_event_history_visible?: boolean
          created_at?: string
          echo_visibility?: string
          id?: string
          location_sharing_enabled?: boolean
          manual_stamp_review_enabled?: boolean
          sassiness_intensity?: number
          show_canon_badge_on_profile?: boolean
          stamp_visibility?: string
          updated_at?: string
          user_id?: string
          voice_style?: string
        }
        Relationships: []
      }
      canon_votes: {
        Row: {
          event_id: string
          id: string
          timestamp: string | null
          user_id: string
          vote_type: string
          weight: number | null
        }
        Insert: {
          event_id: string
          id?: string
          timestamp?: string | null
          user_id: string
          vote_type: string
          weight?: number | null
        }
        Update: {
          event_id?: string
          id?: string
          timestamp?: string | null
          user_id?: string
          vote_type?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "canon_votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "canon_events"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_broadcast_events: {
        Row: {
          broadcast_range: string | null
          broadcast_scope: string
          canon_confidence: number | null
          city: string | null
          created_at: string
          engagement_count: number | null
          event_type: string
          geographic_location: unknown | null
          id: string
          is_unread: boolean | null
          metadata: Json | null
          processed_at: string | null
          pulse_active: boolean | null
          season_id: string | null
          source_id: string
          source_table: string
          updated_at: string
          user_id: string
          verified: boolean
          visible_to_public: boolean
        }
        Insert: {
          broadcast_range?: string | null
          broadcast_scope?: string
          canon_confidence?: number | null
          city?: string | null
          created_at?: string
          engagement_count?: number | null
          event_type: string
          geographic_location?: unknown | null
          id?: string
          is_unread?: boolean | null
          metadata?: Json | null
          processed_at?: string | null
          pulse_active?: boolean | null
          season_id?: string | null
          source_id: string
          source_table: string
          updated_at?: string
          user_id: string
          verified?: boolean
          visible_to_public?: boolean
        }
        Update: {
          broadcast_range?: string | null
          broadcast_scope?: string
          canon_confidence?: number | null
          city?: string | null
          created_at?: string
          engagement_count?: number | null
          event_type?: string
          geographic_location?: unknown | null
          id?: string
          is_unread?: boolean | null
          metadata?: Json | null
          processed_at?: string | null
          pulse_active?: boolean | null
          season_id?: string | null
          source_id?: string
          source_table?: string
          updated_at?: string
          user_id?: string
          verified?: boolean
          visible_to_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "canonical_broadcast_events_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
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
          housie_optimization: Json | null
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
          housie_optimization?: Json | null
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
          housie_optimization?: Json | null
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
      crew_members: {
        Row: {
          crew_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          crew_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          crew_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
        ]
      }
      crews: {
        Row: {
          captain_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          captain_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          captain_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      drop_points: {
        Row: {
          active: boolean
          bonus_stamp_id: string | null
          coordinates: unknown
          created_at: string
          id: string
          name: string
          radius_m: number
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          bonus_stamp_id?: string | null
          coordinates: unknown
          created_at?: string
          id?: string
          name: string
          radius_m?: number
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          bonus_stamp_id?: string | null
          coordinates?: unknown
          created_at?: string
          id?: string
          name?: string
          radius_m?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
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
          annette_api_enabled: boolean | null
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
          annette_api_enabled?: boolean | null
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
          annette_api_enabled?: boolean | null
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
      fusion_stamp_definitions: {
        Row: {
          annette_voice_lines: string[] | null
          canon_multiplier: number | null
          created_at: string | null
          flavor_text: string
          icon_url: string | null
          id: string
          name: string
          required_stamp_ids: string[]
          unlockable_at_tier: number | null
          updated_at: string | null
        }
        Insert: {
          annette_voice_lines?: string[] | null
          canon_multiplier?: number | null
          created_at?: string | null
          flavor_text: string
          icon_url?: string | null
          id: string
          name: string
          required_stamp_ids: string[]
          unlockable_at_tier?: number | null
          updated_at?: string | null
        }
        Update: {
          annette_voice_lines?: string[] | null
          canon_multiplier?: number | null
          created_at?: string | null
          flavor_text?: string
          icon_url?: string | null
          id?: string
          name?: string
          required_stamp_ids?: string[]
          unlockable_at_tier?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fusion_titles: {
        Row: {
          created_at: string
          description: string | null
          flavor_lines: string[]
          icon: string
          id: string
          is_active: boolean
          name: string
          rarity: string
          required_prestige_tier: number
          required_stamps: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          flavor_lines?: string[]
          icon?: string
          id: string
          is_active?: boolean
          name: string
          rarity?: string
          required_prestige_tier?: number
          required_stamps?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          flavor_lines?: string[]
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          rarity?: string
          required_prestige_tier?: number
          required_stamps?: string[]
          updated_at?: string
        }
        Relationships: []
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
      job_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          job_id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          job_id: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          job_id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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
      network_visibility_settings: {
        Row: {
          anonymize_connections: boolean | null
          created_at: string | null
          id: string
          is_public: boolean | null
          show_partial_graph: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anonymize_connections?: boolean | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          show_partial_graph?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anonymize_connections?: boolean | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          show_partial_graph?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      opportunities: {
        Row: {
          accepted_crew_id: string | null
          achievement_requirements: Json
          created_at: string
          crew_bid_deadline: string
          customer_id: string
          description: string
          full_address: string
          id: string
          location_summary: string
          preferred_date: string
          required_services: Json
          status: Database["public"]["Enums"]["opportunity_status"]
          time_window_end: string
          time_window_start: string
          title: string
          updated_at: string
        }
        Insert: {
          accepted_crew_id?: string | null
          achievement_requirements?: Json
          created_at?: string
          crew_bid_deadline: string
          customer_id: string
          description: string
          full_address: string
          id?: string
          location_summary: string
          preferred_date: string
          required_services?: Json
          status?: Database["public"]["Enums"]["opportunity_status"]
          time_window_end: string
          time_window_start: string
          title: string
          updated_at?: string
        }
        Update: {
          accepted_crew_id?: string | null
          achievement_requirements?: Json
          created_at?: string
          crew_bid_deadline?: string
          customer_id?: string
          description?: string
          full_address?: string
          id?: string
          location_summary?: string
          preferred_date?: string
          required_services?: Json
          status?: Database["public"]["Enums"]["opportunity_status"]
          time_window_end?: string
          time_window_start?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_accepted_crew_id_fkey"
            columns: ["accepted_crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_crew_bids: {
        Row: {
          crew_id: string
          id: string
          message: string | null
          opportunity_id: string
          proposed_schedule: Json
          revenue_split: Json
          status: Database["public"]["Enums"]["bid_status"]
          submitted_at: string
          total_bid_amount: number
          updated_at: string
        }
        Insert: {
          crew_id: string
          id?: string
          message?: string | null
          opportunity_id: string
          proposed_schedule?: Json
          revenue_split?: Json
          status?: Database["public"]["Enums"]["bid_status"]
          submitted_at?: string
          total_bid_amount: number
          updated_at?: string
        }
        Update: {
          crew_id?: string
          id?: string
          message?: string | null
          opportunity_id?: string
          proposed_schedule?: Json
          revenue_split?: Json
          status?: Database["public"]["Enums"]["bid_status"]
          submitted_at?: string
          total_bid_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_crew_bids_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_crew_bids_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_service_slots: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          required_achievement: string | null
          service_type: string
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          required_achievement?: string | null
          service_type: string
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          required_achievement?: string | null
          service_type?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_service_slots_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
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
      photo_checklist_fallbacks: {
        Row: {
          admin_override: boolean | null
          approved_at: string | null
          approved_by: string | null
          booking_id: string | null
          checklist_item_id: string
          client_approved: boolean | null
          created_at: string | null
          fallback_photo_url: string
          id: string
          reason: string
          submitted_by: string | null
          updated_at: string | null
        }
        Insert: {
          admin_override?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          checklist_item_id: string
          client_approved?: boolean | null
          created_at?: string | null
          fallback_photo_url: string
          id?: string
          reason: string
          submitted_by?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_override?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          checklist_item_id?: string
          client_approved?: boolean | null
          created_at?: string | null
          fallback_photo_url?: string
          id?: string
          reason?: string
          submitted_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_checklist_fallbacks_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_checklist_fallbacks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_checklist_fallbacks_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      prestige_progress: {
        Row: {
          canon_verified: boolean
          completed_at: string | null
          created_at: string
          equipped: boolean
          id: string
          progress_data: Json
          title_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          canon_verified?: boolean
          completed_at?: string | null
          created_at?: string
          equipped?: boolean
          id?: string
          progress_data?: Json
          title_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          canon_verified?: boolean
          completed_at?: string | null
          created_at?: string
          equipped?: boolean
          id?: string
          progress_data?: Json
          title_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prestige_progress_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "prestige_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      prestige_titles: {
        Row: {
          canon_sources: string[]
          category: string
          created_at: string
          flavor_text: string
          icon: string
          id: string
          is_active: boolean
          name: string
          requirements: Json
          tier: number
          updated_at: string
        }
        Insert: {
          canon_sources?: string[]
          category: string
          created_at?: string
          flavor_text: string
          icon: string
          id: string
          is_active?: boolean
          name: string
          requirements?: Json
          tier?: number
          updated_at?: string
        }
        Update: {
          canon_sources?: string[]
          category?: string
          created_at?: string
          flavor_text?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          requirements?: Json
          tier?: number
          updated_at?: string
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
      rebooking_suggestions: {
        Row: {
          created_at: string | null
          frequency_pattern: string | null
          id: string
          last_booking_date: string | null
          provider_user_id: string
          service_type: string
          suggested_date: string | null
          suggestion_acted_on: boolean | null
          suggestion_shown: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency_pattern?: string | null
          id?: string
          last_booking_date?: string | null
          provider_user_id: string
          service_type: string
          suggested_date?: string | null
          suggestion_acted_on?: boolean | null
          suggestion_shown?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency_pattern?: string | null
          id?: string
          last_booking_date?: string | null
          provider_user_id?: string
          service_type?: string
          suggested_date?: string | null
          suggestion_acted_on?: boolean | null
          suggestion_shown?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      replay_fragments: {
        Row: {
          audio_url: string | null
          content: string | null
          created_at: string
          event_id: string
          id: string
          image_url: string | null
          step_order: number
          timestamp: string
          type: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          created_at?: string
          event_id: string
          id?: string
          image_url?: string | null
          step_order?: number
          timestamp?: string
          type: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          created_at?: string
          event_id?: string
          id?: string
          image_url?: string | null
          step_order?: number
          timestamp?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "replay_fragments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "canon_events"
            referencedColumns: ["id"]
          },
        ]
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
      seasonal_title_rewards: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_limited_time: boolean
          name: string
          rarity: string
          requirements: Json
          season_id: string
          title_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_limited_time?: boolean
          name: string
          rarity?: string
          requirements?: Json
          season_id: string
          title_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_limited_time?: boolean
          name?: string
          rarity?: string
          requirements?: Json
          season_id?: string
          title_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_title_rewards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      service_connections: {
        Row: {
          auto_rebook_suggested: boolean | null
          can_message: boolean | null
          connection_tier: string
          created_at: string | null
          cred_connection_established: boolean | null
          id: string
          last_booked_date: string | null
          service_connection_count: number | null
          updated_at: string | null
          user_one_id: string
          user_two_id: string
        }
        Insert: {
          auto_rebook_suggested?: boolean | null
          can_message?: boolean | null
          connection_tier?: string
          created_at?: string | null
          cred_connection_established?: boolean | null
          id?: string
          last_booked_date?: string | null
          service_connection_count?: number | null
          updated_at?: string | null
          user_one_id: string
          user_two_id: string
        }
        Update: {
          auto_rebook_suggested?: boolean | null
          can_message?: boolean | null
          connection_tier?: string
          created_at?: string | null
          cred_connection_established?: boolean | null
          id?: string
          last_booked_date?: string | null
          service_connection_count?: number | null
          updated_at?: string | null
          user_one_id?: string
          user_two_id?: string
        }
        Relationships: []
      }
      service_drafts: {
        Row: {
          category: string
          created_at: string
          description: string
          duration_hours: number | null
          id: string
          price_per_hour: number | null
          requirements: string | null
          service_area: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          duration_hours?: number | null
          id?: string
          price_per_hour?: number | null
          requirements?: string | null
          service_area?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration_hours?: number | null
          id?: string
          price_per_hour?: number | null
          requirements?: string | null
          service_area?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      stamp_definitions: {
        Row: {
          created_at: string
          description: string | null
          emotion_flavor: string | null
          icon_url: string | null
          id: string
          is_enabled: boolean
          name: string
          rarity: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emotion_flavor?: string | null
          icon_url?: string | null
          id?: string
          is_enabled?: boolean
          name: string
          rarity?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emotion_flavor?: string | null
          icon_url?: string | null
          id?: string
          is_enabled?: boolean
          name?: string
          rarity?: string
          updated_at?: string
        }
        Relationships: []
      }
      stamp_evolutions: {
        Row: {
          base_stamp_id: string
          created_at: string
          evolution_tier: string
          evolved_flavor_text: string | null
          evolved_icon: string
          evolved_name: string
          id: string
          required_count: number
        }
        Insert: {
          base_stamp_id: string
          created_at?: string
          evolution_tier: string
          evolved_flavor_text?: string | null
          evolved_icon: string
          evolved_name: string
          id?: string
          required_count: number
        }
        Update: {
          base_stamp_id?: string
          created_at?: string
          evolution_tier?: string
          evolved_flavor_text?: string | null
          evolved_icon?: string
          evolved_name?: string
          id?: string
          required_count?: number
        }
        Relationships: []
      }
      stamp_imprints: {
        Row: {
          context_summary: string | null
          created_at: string
          id: string
          is_pinned: boolean | null
          location: string | null
          narrative: string
          updated_at: string
          user_id: string
          user_stamp_id: string
        }
        Insert: {
          context_summary?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          location?: string | null
          narrative: string
          updated_at?: string
          user_id: string
          user_stamp_id: string
        }
        Update: {
          context_summary?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          location?: string | null
          narrative?: string
          updated_at?: string
          user_id?: string
          user_stamp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_imprints_user_stamp_id_fkey"
            columns: ["user_stamp_id"]
            isOneToOne: false
            referencedRelation: "user_stamps"
            referencedColumns: ["id"]
          },
        ]
      }
      stamp_usages: {
        Row: {
          assigned_by: string | null
          canon_event_id: string
          id: string
          metadata: Json | null
          stamp_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          canon_event_id: string
          id?: string
          metadata?: Json | null
          stamp_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          canon_event_id?: string
          id?: string
          metadata?: Json | null
          stamp_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_usages_canon_event_id_fkey"
            columns: ["canon_event_id"]
            isOneToOne: false
            referencedRelation: "canon_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_usages_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamp_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      stamps: {
        Row: {
          canon_level: string
          category: string
          created_at: string
          flavor_text: string
          icon: string
          id: string
          is_public: boolean
          name: string
          requirements: Json
          season_id: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          canon_level?: string
          category?: string
          created_at?: string
          flavor_text: string
          icon?: string
          id: string
          is_public?: boolean
          name: string
          requirements?: Json
          season_id?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          canon_level?: string
          category?: string
          created_at?: string
          flavor_text?: string
          icon?: string
          id?: string
          is_public?: boolean
          name?: string
          requirements?: Json
          season_id?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamps_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
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
      user_broadcast_preferences: {
        Row: {
          auto_broadcast_achievements: boolean
          created_at: string
          id: string
          public_echo_participation: boolean
          show_location: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_broadcast_achievements?: boolean
          created_at?: string
          id?: string
          public_echo_participation?: boolean
          show_location?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_broadcast_achievements?: boolean
          created_at?: string
          id?: string
          public_echo_participation?: boolean
          show_location?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_clip_preferences: {
        Row: {
          clip_id: string
          created_at: string
          id: string
          is_favorited: boolean
          order_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          clip_id: string
          created_at?: string
          id?: string
          is_favorited?: boolean
          order_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          clip_id?: string
          created_at?: string
          id?: string
          is_favorited?: boolean
          order_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_equipped_stamps: {
        Row: {
          created_at: string
          display_position: number
          equipped_at: string
          id: string
          stamp_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_position: number
          equipped_at?: string
          id?: string
          stamp_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_position?: number
          equipped_at?: string
          id?: string
          stamp_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_fusion_stamps: {
        Row: {
          crafted_at: string | null
          created_at: string | null
          display_position: number | null
          fusion_stamp_id: string
          id: string
          is_equipped: boolean | null
          source_stamp_ids: string[]
          user_id: string
        }
        Insert: {
          crafted_at?: string | null
          created_at?: string | null
          display_position?: number | null
          fusion_stamp_id: string
          id?: string
          is_equipped?: boolean | null
          source_stamp_ids: string[]
          user_id: string
        }
        Update: {
          crafted_at?: string | null
          created_at?: string | null
          display_position?: number | null
          fusion_stamp_id?: string
          id?: string
          is_equipped?: boolean | null
          source_stamp_ids?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_fusion_stamps_fusion_stamp_id_fkey"
            columns: ["fusion_stamp_id"]
            isOneToOne: false
            referencedRelation: "fusion_stamp_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_fusion_titles: {
        Row: {
          created_at: string
          id: string
          is_equipped: boolean
          title_id: string
          unlock_context: Json | null
          unlocked_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_equipped?: boolean
          title_id: string
          unlock_context?: Json | null
          unlocked_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_equipped?: boolean
          title_id?: string
          unlock_context?: Json | null
          unlocked_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_fusion_titles_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "fusion_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_imprints: {
        Row: {
          action_type: string
          canonical: boolean
          coordinates: unknown | null
          created_at: string
          drop_point_id: string
          id: string
          optional_note: string | null
          service_type: string | null
          stamp_triggered_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          action_type?: string
          canonical?: boolean
          coordinates?: unknown | null
          created_at?: string
          drop_point_id: string
          id?: string
          optional_note?: string | null
          service_type?: string | null
          stamp_triggered_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          action_type?: string
          canonical?: boolean
          coordinates?: unknown | null
          created_at?: string
          drop_point_id?: string
          id?: string
          optional_note?: string | null
          service_type?: string | null
          stamp_triggered_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_imprints_drop_point_id_fkey"
            columns: ["drop_point_id"]
            isOneToOne: false
            referencedRelation: "drop_points"
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
          comfort_km: number | null
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
          comfort_km?: number | null
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
          comfort_km?: number | null
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
      user_seasonal_stats: {
        Row: {
          broadcasts_triggered: number
          canon_earned: number
          created_at: string
          fusion_titles_earned: number
          id: string
          season_id: string
          stamps_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          broadcasts_triggered?: number
          canon_earned?: number
          created_at?: string
          fusion_titles_earned?: number
          id?: string
          season_id: string
          stamps_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          broadcasts_triggered?: number
          canon_earned?: number
          created_at?: string
          fusion_titles_earned?: number
          id?: string
          season_id?: string
          stamps_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_seasonal_stats_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_seasonal_title_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          equipped: boolean
          id: string
          progress_data: Json
          season_id: string
          title_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          equipped?: boolean
          id?: string
          progress_data?: Json
          season_id: string
          title_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          equipped?: boolean
          id?: string
          progress_data?: Json
          season_id?: string
          title_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_seasonal_title_progress_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
            referencedColumns: ["id"]
          },
        ]
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
      user_showcase_settings: {
        Row: {
          annette_intro_line: string | null
          created_at: string | null
          featured_stamp_ids: string[] | null
          id: string
          is_public: boolean | null
          room_theme: string | null
          room_title: string | null
          updated_at: string | null
          user_id: string
          widget_layout: Json | null
        }
        Insert: {
          annette_intro_line?: string | null
          created_at?: string | null
          featured_stamp_ids?: string[] | null
          id?: string
          is_public?: boolean | null
          room_theme?: string | null
          room_title?: string | null
          updated_at?: string | null
          user_id: string
          widget_layout?: Json | null
        }
        Update: {
          annette_intro_line?: string | null
          created_at?: string | null
          featured_stamp_ids?: string[] | null
          id?: string
          is_public?: boolean | null
          room_theme?: string | null
          room_title?: string | null
          updated_at?: string | null
          user_id?: string
          widget_layout?: Json | null
        }
        Relationships: []
      }
      user_stamps: {
        Row: {
          canon_status: string | null
          context_data: Json | null
          created_at: string
          earned_at: string
          evolution_count: number
          evolution_tier: string | null
          id: string
          is_displayed: boolean | null
          job_id: string | null
          location: unknown | null
          season_earned: string | null
          stamp_id: string
          trigger_context: Json | null
          user_id: string
        }
        Insert: {
          canon_status?: string | null
          context_data?: Json | null
          created_at?: string
          earned_at?: string
          evolution_count?: number
          evolution_tier?: string | null
          id?: string
          is_displayed?: boolean | null
          job_id?: string | null
          location?: unknown | null
          season_earned?: string | null
          stamp_id: string
          trigger_context?: Json | null
          user_id: string
        }
        Update: {
          canon_status?: string | null
          context_data?: Json | null
          created_at?: string
          earned_at?: string
          evolution_count?: number
          evolution_tier?: string | null
          id?: string
          is_displayed?: boolean | null
          job_id?: string | null
          location?: unknown | null
          season_earned?: string | null
          stamp_id?: string
          trigger_context?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stamps_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stamps_season_earned_fkey"
            columns: ["season_earned"]
            isOneToOne: false
            referencedRelation: "canon_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stamps_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trust_graph_snapshots: {
        Row: {
          connections: Json
          created_at: string | null
          graph_date: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connections?: Json
          created_at?: string | null
          graph_date?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connections?: Json
          created_at?: string | null
          graph_date?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      add_canon_thread_entry: {
        Args: {
          p_thread_id: string
          p_entry_id: string
          p_message: string
          p_source_type?: string
          p_canon_level?: string
          p_linked_event_id?: string
          p_metadata?: Json
        }
        Returns: string
      }
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
      admin_give_credits: {
        Args: { target_user_id: string; credit_amount: number }
        Returns: undefined
      }
      approve_checklist_fallback: {
        Args: { fallback_id: string; is_approved: boolean }
        Returns: boolean
      }
      award_community_rating_points: {
        Args: { p_user_id: string; p_points: number; p_reason: string }
        Returns: undefined
      }
      award_fusion_title: {
        Args: { p_user_id: string; p_title_id: string; p_context?: Json }
        Returns: string
      }
      award_stamp: {
        Args: {
          p_user_id: string
          p_stamp_id: string
          p_context_data?: Json
          p_job_id?: string
        }
        Returns: string
      }
      broadcast_canon_event: {
        Args: {
          p_event_type: string
          p_user_id: string
          p_source_table: string
          p_source_id: string
          p_verified?: boolean
          p_broadcast_scope?: string
          p_visible_to_public?: boolean
          p_canon_confidence?: number
          p_metadata?: Json
          p_city?: string
        }
        Returns: string
      }
      calculate_canon_score: {
        Args: { p_user_id: string }
        Returns: number
      }
      calculate_echo_score: {
        Args: { p_event_id: string }
        Returns: number
      }
      calculate_shop_points: {
        Args: { community_points: number }
        Returns: number
      }
      calculate_trust_score: {
        Args: { p_user_one_id: string; p_user_two_id: string }
        Returns: number
      }
      can_message_user: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      check_fusion_eligibility: {
        Args: { p_user_id: string; p_fusion_id: string }
        Returns: boolean
      }
      check_fusion_title_eligibility: {
        Args: { p_user_id: string; p_title_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          user_uuid: string
          feature_name: string
          message_length?: number
        }
        Returns: Json
      }
      check_seasonal_title_eligibility: {
        Args: { p_user_id: string; p_title_id: string }
        Returns: boolean
      }
      cleanup_expired_canon_echoes: {
        Args: Record<PropertyKey, never>
        Returns: number
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
      craft_fusion_stamp: {
        Args: { p_user_id: string; p_fusion_id: string }
        Returns: Json
      }
      create_canon_event: {
        Args: {
          p_event_type: string
          p_title: string
          p_description?: string
          p_canon_rank?: string
          p_echo_scope?: string
          p_origin_dashboard?: string
          p_event_source_type?: string
          p_stamp_id?: string
          p_related_user_ids?: string[]
        }
        Returns: string
      }
      create_canon_thread: {
        Args: {
          p_user_id: string
          p_title: string
          p_root_message: string
          p_tags?: string[]
          p_is_public?: boolean
        }
        Returns: string
      }
      create_review_notification: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      deduct_ai_credits: {
        Args: {
          user_uuid: string
          amount: number
          action_name: string
          result_text?: string
          metadata_json?: Json
        }
        Returns: Json
      }
      determine_broadcast_range: {
        Args: {
          p_event_type: string
          p_canon_confidence: number
          p_user_context?: Json
        }
        Returns: string
      }
      equip_title: {
        Args: { p_user_id: string; p_title_id: string }
        Returns: boolean
      }
      evaluate_stamp_triggers: {
        Args: { p_user_id: string; p_job_id: string }
        Returns: {
          stamp_id: string
          eligible: boolean
          context_data: Json
        }[]
      }
      evolve_stamp: {
        Args: { p_user_id: string; p_stamp_id: string }
        Returns: string
      }
      find_nearby_drop_points: {
        Args: { p_coordinates: unknown; p_max_distance_m?: number }
        Returns: {
          drop_point_id: string
          name: string
          type: string
          distance_m: number
          bonus_stamp_id: string
        }[]
      }
      generate_fuzzy_location: {
        Args: { original_point: unknown; radius_meters?: number }
        Returns: unknown
      }
      generate_user_trust_graph: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_canon_preferences: {
        Args: { p_user_id: string }
        Returns: {
          echo_visibility: string
          location_sharing_enabled: boolean
          voice_style: string
          sassiness_intensity: number
          show_canon_badge_on_profile: boolean
          stamp_visibility: string
          manual_stamp_review_enabled: boolean
          canon_event_history_visible: boolean
        }[]
      }
      get_current_daily_spend: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_season: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean
          created_at: string
          end_date: string
          id: string
          name: string
          seasonal_stamp_variants: string[] | null
          seasonal_title_rewards: string[] | null
          start_date: string
          theme: string
          updated_at: string
        }
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_emergency_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_equipped_title: {
        Args: { p_user_id: string }
        Returns: {
          title_id: string
          title_name: string
          icon: string
          flavor_text: string
        }[]
      }
      get_filtered_canon_echoes: {
        Args: {
          p_user_id: string
          p_range_filter?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          user_id: string
          message: string
          broadcast_range: string
          canon_confidence: number
          location: string
          city: string
          created_at: string
          is_unread: boolean
          pulse_active: boolean
          tags: string[]
          engagement_count: number
        }[]
      }
      get_latest_emergency_controls: {
        Args: Record<PropertyKey, never>
        Returns: {
          activated_at: string | null
          activated_by: string | null
          allowed_payment_methods: string[] | null
          annette_api_enabled: boolean | null
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
      get_rebooking_suggestions: {
        Args: { user_uuid: string }
        Returns: {
          provider_name: string
          provider_user_id: string
          service_type: string
          last_booking_date: string
          suggested_date: string
          frequency_pattern: string
          total_bookings: number
        }[]
      }
      get_subscribed_canon_events: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          event_type: string
          title: string
          description: string
          event_timestamp: string
          canon_rank: string
          echo_scope: string
          annette_commentary: string
          followed_user_name: string
        }[]
      }
      get_user_ai_credits: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_user_current_role: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_user_equipped_stamps: {
        Args: { p_user_id: string }
        Returns: {
          stamp_id: string
          display_position: number
          equipped_at: string
        }[]
      }
      get_user_risk_level: {
        Args: { user_uuid: string }
        Returns: string
      }
      grant_test_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_network_connections: {
        Args: { p_provider_user_id: string; p_customer_user_id: string }
        Returns: undefined
      }
      is_annette_api_enabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_claude_api_enabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_fallback_flow_enabled: {
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
      is_within_drop_point: {
        Args: { p_coordinates: unknown; p_drop_point_id: string }
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
      log_imprint: {
        Args: {
          p_user_id: string
          p_coordinates: unknown
          p_action_type: string
          p_service_type?: string
          p_note?: string
        }
        Returns: Json
      }
      mark_echoes_read: {
        Args: { p_user_id: string; p_echo_ids: string[] }
        Returns: boolean
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: number
      }
      recalculate_vote_weight: {
        Args: { p_event_id: string }
        Returns: undefined
      }
      refresh_fuzzy_locations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      search_canon_threads: {
        Args: { p_user_id: string; p_query: string; p_limit?: number }
        Returns: {
          thread_id: string
          title: string
          root_message: string
          created_at: string
          tags: string[]
          entry_count: number
        }[]
      }
      update_canon_rankings: {
        Args: { target_city?: string }
        Returns: number
      }
      update_daily_spend: {
        Args: { spend_amount: number }
        Returns: boolean
      }
      update_prestige_progress: {
        Args: {
          p_user_id: string
          p_title_id: string
          p_progress_data: Json
          p_canon_verified?: boolean
        }
        Returns: string
      }
      update_seasonal_stats: {
        Args: { p_user_id: string; p_stat_type: string; p_increment?: number }
        Returns: undefined
      }
      update_shop_points: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_trust_graph_snapshots: {
        Args: Record<PropertyKey, never>
        Returns: number
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
      bid_status: "pending" | "accepted" | "rejected" | "withdrawn"
      leaderboard_type:
        | "weekly_earnings"
        | "monthly_bookings"
        | "customer_rating"
        | "response_time"
        | "territory_control"
      opportunity_status:
        | "open"
        | "bidding"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      bid_status: ["pending", "accepted", "rejected", "withdrawn"],
      leaderboard_type: [
        "weekly_earnings",
        "monthly_bookings",
        "customer_rating",
        "response_time",
        "territory_control",
      ],
      opportunity_status: [
        "open",
        "bidding",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
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
