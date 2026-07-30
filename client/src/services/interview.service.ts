import { api } from './api'

export const interviewService = {
  /**
   * Start a new interview session
   */
  start: async (data: { jdId: string; type: 'technical' | 'behavioral' | 'mixed' }) => {
    const response = await api.post('/interview/start', data)
    return response.data
  },

  /**
   * Submit an answer for a question
   */
  submitAnswer: async (sessionId: string, data: { questionId: string; answer: string }) => {
    const response = await api.post(`/interview/${sessionId}/answer`, data)
    return response.data
  },

  /**
   * Complete an interview session
   */
  complete: async (sessionId: string) => {
    const { data } = await api.post(`/interview/${sessionId}/complete`)
    return data
  },

  /**
   * Get interview history
   */
  getHistory: async () => {
    const { data } = await api.get('/interview/history')
    return data
  },
}
