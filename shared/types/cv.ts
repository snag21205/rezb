// ===== User / Profile =====
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  daily_ai_usage: number
  last_usage_date: string | null
  created_at: string
  updated_at: string
}

// ===== Resume =====
export interface Resume {
  id: string
  user_id: string
  file_name: string
  file_path: string
  raw_text: string
  parsed_sections: Record<string, string> | null
  is_active: boolean
  created_at: string
}
