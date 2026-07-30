// ===== Interview Session =====
export interface InterviewSession {
  id: string
  user_id: string
  jd_id: string
  type: 'technical' | 'behavioral' | 'mixed'
  status: 'in_progress' | 'completed'
  total_score: number | null
  ai_summary: InterviewSummary | null
  created_at: string
  completed_at: string | null
}

export interface InterviewSummary {
  overall_feedback: string
  strengths: string[]
  areas_to_improve: string[]
  recommended_topics: string[]
}

// ===== Interview Q&A =====
export interface InterviewQA {
  id: string
  session_id: string
  question_order: number
  question: string
  question_type: 'technical' | 'behavioral' | 'situational'
  user_answer: string | null
  score: number | null
  star_analysis: STARAnalysis | null
  ai_feedback: string | null
  improved_answer: string | null
  answered_at: string | null
}

export interface STARAnalysis {
  situation: STARComponent
  task: STARComponent
  action: STARComponent
  result: STARComponent
}

export interface STARComponent {
  present: boolean
  quality: 'good' | 'fair' | 'missing'
  feedback: string
}
