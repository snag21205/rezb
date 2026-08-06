import { generateJSON } from '../ai/client'
import { buildCVAnalysisPrompt } from '../ai/prompts/cv-analysis'
import { buildJDMatchingPrompt } from '../ai/prompts/jd-matching'
import { buildInterviewQuestionsPrompt, buildInterviewSummaryPrompt } from '../ai/prompts/interview-questions'
import { buildAnswerEvaluationPrompt } from '../ai/prompts/answer-evaluation'
import { cvAnalysisSchema, type CVAnalysisResult } from '../ai/schemas/cv-analysis'
import { jdMatchSchema, type JDMatchResult } from '../ai/schemas/jd-match'
import {
  interviewQuestionsSchema, type InterviewQuestionsResult,
  answerEvaluationSchema, type AnswerEvaluationResult,
  interviewSummarySchema, type InterviewSummaryResult,
} from '../ai/schemas/interview'
import { AppError } from '../utils/helpers'

/**
 * Phân tích CV bằng Gemini AI, trả về structured JSON
 */
export async function analyzeCVWithAI(cvText: string): Promise<CVAnalysisResult> {
  const prompt = buildCVAnalysisPrompt(cvText)
  let raw: unknown
  try {
    raw = await generateJSON(prompt)
  } catch (err) {
    throw new AppError(`Gemini AI lỗi: ${(err as Error).message}`, 502)
  }
  const parsed = cvAnalysisSchema.safeParse(raw)
  if (!parsed.success) {
    console.error('[AI] Invalid response structure:', parsed.error.flatten())
    throw new AppError('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.', 502)
  }
  return parsed.data
}

/**
 * So khớp CV với JD bằng Gemini AI
 */
export async function matchJDWithAI(cvText: string, jdText: string): Promise<JDMatchResult> {
  const prompt = buildJDMatchingPrompt(cvText, jdText)
  let raw: unknown
  try {
    raw = await generateJSON(prompt)
  } catch (err) {
    throw new AppError(`Gemini AI lỗi: ${(err as Error).message}`, 502)
  }
  const parsed = jdMatchSchema.safeParse(raw)
  if (!parsed.success) {
    console.error('[AI] JD Match invalid response:', parsed.error.flatten())
    throw new AppError('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.', 502)
  }
  return parsed.data
}

/**
 * Sinh câu hỏi phỏng vấn từ JD
 */
export async function generateInterviewQuestionsWithAI(
  jdText: string,
  type: 'technical' | 'behavioral' | 'mixed'
): Promise<InterviewQuestionsResult> {
  const prompt = buildInterviewQuestionsPrompt(jdText, type, 5)
  let raw: unknown
  try {
    raw = await generateJSON(prompt)
  } catch (err) {
    throw new AppError(`Gemini AI lỗi: ${(err as Error).message}`, 502)
  }

  const parsed = interviewQuestionsSchema.safeParse(raw)
  if (!parsed.success) {
    console.error('[AI] Interview questions validation errors:', JSON.stringify(parsed.error.flatten(), null, 2))
    throw new AppError('AI trả về câu hỏi không hợp lệ. Vui lòng thử lại.', 502)
  }
  return parsed.data
}

/**
 * Đánh giá câu trả lời theo STAR framework
 */
export async function evaluateAnswerWithAI(
  question: string,
  answer: string,
  jdContext?: string
): Promise<AnswerEvaluationResult> {
  const prompt = buildAnswerEvaluationPrompt(question, answer, jdContext)
  let raw: unknown
  try {
    raw = await generateJSON(prompt)
  } catch (err) {
    throw new AppError(`Gemini AI lỗi: ${(err as Error).message}`, 502)
  }
  const parsed = answerEvaluationSchema.safeParse(raw)
  if (!parsed.success) {
    console.error('[AI] Answer evaluation invalid:', parsed.error.flatten())
    throw new AppError('AI trả về đánh giá không hợp lệ. Vui lòng thử lại.', 502)
  }
  return parsed.data
}

/**
 * Tổng kết toàn bộ buổi phỏng vấn
 */
export async function summarizeInterviewWithAI(
  qaPairs: Array<{ question: string; answer: string; score: number }>
): Promise<InterviewSummaryResult> {
  const prompt = buildInterviewSummaryPrompt(qaPairs)
  let raw: unknown
  try {
    raw = await generateJSON(prompt)
  } catch (err) {
    throw new AppError(`Gemini AI lỗi: ${(err as Error).message}`, 502)
  }
  const parsed = interviewSummarySchema.safeParse(raw)
  if (!parsed.success) {
    console.error('[AI] Interview summary invalid:', parsed.error.flatten())
    throw new AppError('AI trả về tổng kết không hợp lệ. Vui lòng thử lại.', 502)
  }
  return parsed.data
}
