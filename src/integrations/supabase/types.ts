export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          confidence: number | null
          course_id: number | null
          created_at: string
          date: string
          id: string
          lat: number | null
          lng: number | null
          method: string | null
          notes: string | null
          status: string
          time: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          confidence?: number | null
          course_id?: number | null
          created_at?: string
          date?: string
          id?: string
          lat?: number | null
          lng?: number | null
          method?: string | null
          notes?: string | null
          status?: string
          time?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          confidence?: number | null
          course_id?: number | null
          created_at?: string
          date?: string
          id?: string
          lat?: number | null
          lng?: number | null
          method?: string | null
          notes?: string | null
          status?: string
          time?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string
          credits: number | null
          description: string | null
          id: number
          lecturer: string | null
          name: string
          schedule: string | null
          students: string[] | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: number
          lecturer?: string | null
          name: string
          schedule?: string | null
          students?: string[] | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: number
          lecturer?: string | null
          name?: string
          schedule?: string | null
          students?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          member_ids: string[] | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          member_ids?: string[] | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          member_ids?: string[] | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          author: string | null
          content: string | null
          course_id: number | null
          created_at: string
          description: string | null
          downloads: number | null
          file_size: string | null
          id: number
          language: string | null
          tags: string[] | null
          title: string
          type: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          course_id?: number | null
          created_at?: string
          description?: string | null
          downloads?: number | null
          file_size?: string | null
          id?: number
          language?: string | null
          tags?: string[] | null
          title: string
          type?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          course_id?: number | null
          created_at?: string
          description?: string | null
          downloads?: number | null
          file_size?: string | null
          id?: number
          language?: string | null
          tags?: string[] | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          course_id: number | null
          created_at: string
          email: string | null
          face_descriptor: Json | null
          id: string
          last_login: string | null
          liked_projects: string[] | null
          name: string
          notes: string | null
          password_hash: string
          preferences: Json | null
          role: string
          status: string
          updated_at: string
          username: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string
          email?: string | null
          face_descriptor?: Json | null
          id?: string
          last_login?: string | null
          liked_projects?: string[] | null
          name: string
          notes?: string | null
          password_hash: string
          preferences?: Json | null
          role?: string
          status?: string
          updated_at?: string
          username: string
        }
        Update: {
          course_id?: number | null
          created_at?: string
          email?: string | null
          face_descriptor?: Json | null
          id?: string
          last_login?: string | null
          liked_projects?: string[] | null
          name?: string
          notes?: string | null
          password_hash?: string
          preferences?: Json | null
          role?: string
          status?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          code: string | null
          created_at: string
          description: string | null
          forks: number | null
          id: string
          likes: number | null
          name: string
          tags: string[] | null
          updated_at: string
          user_id: string | null
          views: number | null
          visibility: string | null
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          forks?: number | null
          id?: string
          likes?: number | null
          name: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
          views?: number | null
          visibility?: string | null
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          forks?: number | null
          id?: string
          likes?: number | null
          name?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
          views?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
