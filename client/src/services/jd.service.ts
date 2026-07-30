import { api } from './api'

export const jdService = {
  /**
   * Save a new job description
   */
  create: async (data: { title: string; company?: string; rawText: string }) => {
    const response = await api.post('/jd', data)
    return response.data
  },

  /**
   * Get all saved job descriptions
   */
  getAll: async () => {
    const { data } = await api.get('/jd')
    return data
  },

  /**
   * Match a resume against a job description
   */
  match: async (resumeId: string, jdId: string) => {
    const { data } = await api.post('/jd/match', { resumeId, jdId })
    return data
  },
}
