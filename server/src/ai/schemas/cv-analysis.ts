import { z } from 'zod'

export const cvAnalysisSchema = z.object({
  overall_score: z.number().min(0).max(100),
  ats_score: z.number().min(0).max(100),
  sections: z.object({
    contact_info: z.object({
      score: z.number().min(0).max(10),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    summary: z.object({
      score: z.number().min(0).max(10),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    experience: z.object({
      score: z.number().min(0).max(30),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    education: z.object({
      score: z.number().min(0).max(10),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    skills: z.object({
      score: z.number().min(0).max(20),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    projects: z.object({
      score: z.number().min(0).max(20),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
  }),
  strengths: z.array(z.string()),
  critical_issues: z.array(z.string()),
  rewrite_suggestions: z.array(z.object({
    original: z.string(),
    improved: z.string(),
    reason: z.string(),
  })),
})

export type CVAnalysisResult = z.infer<typeof cvAnalysisSchema>
