import { api } from './api'

export const cvService = {
  /**
   * Upload a CV file (PDF/DOCX)
   */
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('cv', file)
    const { data } = await api.post('/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /**
   * Analyze a resume with AI (returns SSE stream URL)
   */
  analyze: async (resumeId: string) => {
    const { data } = await api.post(`/cv/analyze/${resumeId}`)
    return data
  },

  /**
   * Get analysis history for a resume
   */
  getAnalyses: async (resumeId: string) => {
    const { data } = await api.get(`/cv/analyses/${resumeId}`)
    return data
  },
}
