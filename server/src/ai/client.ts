import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

/**
 * Gemini 2.0 Flash model instance
 * Free tier: 15 RPM, 1M tokens/min, 1500 req/day
 */
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',
})

/**
 * Sleep helper
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate content with JSON output + auto-retry on 429
 * Max 3 retries with exponential backoff
 */
export async function generateJSON<T>(prompt: string, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      })

      const text = result.response.text()
      return JSON.parse(text) as T

    } catch (err: any) {
      const is429 = err?.message?.includes('429') || err?.status === 429
      const isLastAttempt = attempt === retries

      if (is429 && !isLastAttempt) {
        // Tìm retryDelay từ message nếu có, không thì backoff mặc định
        const delayMatch = err.message?.match(/retryDelay.*?(\d+)s/)
        const waitMs = delayMatch ? parseInt(delayMatch[1]!) * 1000 : attempt * 12000

        console.warn(`[Gemini] 429 - Retry ${attempt}/${retries} sau ${waitMs / 1000}s...`)
        await sleep(waitMs)
        continue
      }

      throw err
    }
  }

  throw new Error('Gemini: Vượt quá số lần retry')
}


/**
 * Stream content generation (for SSE responses)
 */
export async function* streamContent(prompt: string) {
  const result = await geminiModel.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
    },
  })

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) yield text
  }
}
