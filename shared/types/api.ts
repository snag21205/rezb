// ===== API Response Types =====

export interface APISuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface APIErrorResponse {
  success: false
  error: string
  details?: unknown
}

export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ===== API Request Types =====

export interface CreateJDRequest {
  title: string
  company?: string
  rawText: string
}

export interface MatchRequest {
  resumeId: string
  jdId: string
}

export interface StartInterviewRequest {
  jdId: string
  type: 'technical' | 'behavioral' | 'mixed'
}

export interface SubmitAnswerRequest {
  questionId: string
  answer: string
}

// ===== Dashboard =====

export interface DashboardStats {
  totalAnalyses: number
  averageScore: number
  interviewSessions: number
  latestATSScore: number | null
}
