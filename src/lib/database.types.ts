export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          created_at?: string;
        };
      };
      appraisals: {
        Row: {
          id: string;
          user_id: string;
          client_name: string | null;
          property_address: string | null;
          property_city: string | null;
          property_state: string | null;
          property_zip: string | null;
          property_type: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          gla: number | null;
          lot_size: number | null;
          year_built: number | null;
          condition: string | null;
          status: string;
          document_content: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          client_name?: string | null;
          property_address?: string | null;
          property_city?: string | null;
          property_state?: string | null;
          property_zip?: string | null;
          property_type?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          gla?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          condition?: string | null;
          status?: string;
          document_content?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          client_name?: string | null;
          property_address?: string | null;
          property_city?: string | null;
          property_state?: string | null;
          property_zip?: string | null;
          property_type?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          gla?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          condition?: string | null;
          status?: string;
          document_content?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      document_versions: {
        Row: {
          id: string;
          appraisal_id: string;
          content: Record<string, unknown>;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appraisal_id: string;
          content: Record<string, unknown>;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          appraisal_id?: string;
          content?: Record<string, unknown>;
          created_by?: string | null;
          created_at?: string;
        };
      };
      comparables: {
        Row: {
          id: string;
          appraisal_id: string;
          attom_id: string | null;
          address: string;
          city: string | null;
          state: string | null;
          zip: string | null;
          sale_price: number | null;
          sale_date: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          gla: number | null;
          lot_size: number | null;
          year_built: number | null;
          distance_miles: number | null;
          similarity_score: number | null;
          adjustments: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appraisal_id: string;
          attom_id?: string | null;
          address: string;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          sale_price?: number | null;
          sale_date?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          gla?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          distance_miles?: number | null;
          similarity_score?: number | null;
          adjustments?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          appraisal_id?: string;
          attom_id?: string | null;
          address?: string;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          sale_price?: number | null;
          sale_date?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          gla?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          distance_miles?: number | null;
          similarity_score?: number | null;
          adjustments?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          appraisal_id: string;
          feature: string;
          prompt: string;
          output: string;
          user_action: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appraisal_id: string;
          feature: string;
          prompt: string;
          output: string;
          user_action?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          appraisal_id?: string;
          feature?: string;
          prompt?: string;
          output?: string;
          user_action?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
