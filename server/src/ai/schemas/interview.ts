import { z } from 'zod'

// Schema cho danh sách câu hỏi AI sinh ra
// Dùng z.string() thay vì enum để linh hoạt hơn với output của Gemini
export const interviewQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      type: z.string().transform(v => {
        const normalized = v.toLowerCase()
        if (normalized.includes('technical')) return 'technical'
        if (normalized.includes('behavioral') || normalized.includes('hybrid')) return 'behavioral'
        return 'situational'
      }),
      difficulty: z.string().optional(),
      expected_topics: z.array(z.string()).optional(),
    })
  ).min(1).max(10),
})

export type InterviewQuestionsResult = z.infer<typeof interviewQuestionsSchema>

// Schema cho đánh giá câu trả lời STAR
const starComponentSchema = z.object({
  present: z.boolean(),
  quality: z.enum(['good', 'fair', 'missing']),
  feedback: z.string(),
})

export const answerEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  star_analysis: z.object({
    situation: starComponentSchema,
    task: starComponentSchema,
    action: starComponentSchema,
    result: starComponentSchema,
  }),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  improved_answer: z.string(),
  follow_up_question: z.string().optional(),
})

export type AnswerEvaluationResult = z.infer<typeof answerEvaluationSchema>

// Schema cho AI summary khi complete session
export const interviewSummarySchema = z.object({
  overall_score: z.number().min(0).max(100),
  overall_feedback: z.string(),
  strengths: z.array(z.string()),
  areas_to_improve: z.array(z.string()),
  recommended_topics: z.array(z.string()),
})

export type InterviewSummaryResult = z.infer<typeof interviewSummarySchema>
