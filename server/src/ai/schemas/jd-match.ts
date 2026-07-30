import { z } from 'zod'

export const jdMatchSchema = z.object({
  match_score: z.number().min(0).max(100),
  matched_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  rewrite_suggestions: z.array(z.object({
    section: z.string(),
    original: z.string(),
    improved: z.string(),
    reason: z.string(),
  })),
  summary: z.string(),
})

export type JDMatchResult = z.infer<typeof jdMatchSchema>
