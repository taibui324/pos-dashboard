export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string;
          name: string;
          status: "active" | "inactive";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: "active" | "inactive";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      account_profiles: {
        Row: {
          user_id: string;
          email: string;
          display_name: string;
          role: "daspace_admin" | "brand_user";
          status: "active" | "disabled" | "invited";
          brand_id: string | null;
          created_by_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          display_name: string;
          role: "daspace_admin" | "brand_user";
          status?: "active" | "disabled" | "invited";
          brand_id?: string | null;
          created_by_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["account_profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "account_profiles_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
