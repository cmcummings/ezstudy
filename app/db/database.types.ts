export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
      }
      sets: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: number
          name: string
          public: boolean
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: number
          name: string
          public?: boolean
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: number
          name?: string
          public?: boolean
        }
      }
      terms: {
        Row: {
          definition: string
          id: number
          set_id: number
          term: string
        }
        Insert: {
          definition: string
          id?: number
          set_id: number
          term: string
        }
        Update: {
          definition?: string
          id?: number
          set_id?: number
          term?: string
        }
      }
    }
    Views: {
      sets_with_profiles: {
        Row: {
          created_at: string | null
          creator_avatar_url: string | null
          creator_id: string | null
          creator_username: string | null
          description: string | null
          id: number | null
          name: string | null
        }
      }
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
