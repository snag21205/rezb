import { generateJSON } from '../ai/client'
import { buildCVAnalysisPrompt } from '../ai/prompts/cv-analysis'
import { buildJDMatchingPrompt } from '../ai/prompts/jd-matching'
import { cvAnalysisSchema, type CVAnalysisResult } from '../ai/schemas/cv-analysis'
import { jdMatchSchema, type JDMatchResult } from '../ai/schemas/jd-match'
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

