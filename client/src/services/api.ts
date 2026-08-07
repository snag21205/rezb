import { supabase } from '../lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeader()

  // Nếu body là FormData thì không set Content-Type
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
      ...(options.headers || {}),
    },
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Yêu cầu thất bại')
  }

  return json.data as T
}

// ===== API Services =====

// Dashboard
export async function getDashboardStats() {
  return apiFetch<{
    totalAnalyses: number
    averageInterviewScore: number
    interviewSessions: number
    latestATSScore: number | null
    latestOverallScore: number | null
  }>('/dashboard/stats')
}

// CV
export async function uploadCV(file: File) {
  const formData = new FormData()
  formData.append('cv', file)
  return apiFetch<{ id: string; fileName: string; textLength: number }>('/cv/upload', {
    method: 'POST',
    body: formData,
  })
}

export async function getUserResumes() {
  return apiFetch<Array<{ id: string; file_name: string; file_path: string; created_at: string }>>('/cv')
}

export async function analyzeCV(resumeId: string) {
  return apiFetch<any>(`/cv/analyze/${resumeId}`, { method: 'POST' })
}

// JD
export async function createJD(data: { title: string; company?: string; rawText: string }) {
  return apiFetch<{ id: string; title: string; company?: string }>('/jd', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getUserJDs() {
  return apiFetch<Array<{ id: string; title: string; company?: string; created_at: string }>>('/jd')
}

export async function matchCVWithJD(resumeId: string, jdId: string) {
  return apiFetch<any>('/jd/match', {
    method: 'POST',
    body: JSON.stringify({ resumeId, jdId }),
  })
}

// Interview
export async function startInterview(jdId: string, type: 'technical' | 'behavioral' | 'mixed') {
  return apiFetch<{
    sessionId: string
    jdTitle: string
    type: string
    questions: Array<{ id: string; question_order: number; question: string; question_type: string }>
  }>('/interview/start', {
    method: 'POST',
    body: JSON.stringify({ jdId, type }),
  })
}

export async function submitAnswer(sessionId: string, questionId: string, answer: string) {
  return apiFetch<any>(`/interview/${sessionId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ questionId, answer }),
  })
}

export async function completeInterview(sessionId: string) {
  return apiFetch<any>(`/interview/${sessionId}/complete`, { method: 'POST' })
}

export async function getInterviewHistory() {
  return apiFetch<Array<any>>('/interview/history')
}

export async function getInterviewSession(sessionId: string) {
  return apiFetch<any>(`/interview/${sessionId}`)
}
