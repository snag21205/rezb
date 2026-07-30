// ===== Job Description =====
export interface JobDescription {
  id: string
  user_id: string
  title: string
  company: string | null
  raw_text: string
  extracted_requirements: ExtractedRequirements | null
  created_at: string
}

export interface ExtractedRequirements {
  required_skills: string[]
  preferred_skills: string[]
  experience_years: number | null
  education: string | null
  responsibilities: string[]
}

// ===== JD Match =====
export interface JDMatch {
  id: string
  resume_id: string
  jd_id: string
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  rewrite_suggestions: RewriteSuggestion[]
  created_at: string
}

export interface RewriteSuggestion {
  section: string
  original: string
  improved: string
  reason: string
}
