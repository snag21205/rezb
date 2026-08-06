import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

/**
 * Gemini 3.5 Flash model instance
 * Free tier: 15 RPM, 1M tokens/min, 1500 req/day
 */
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
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
          temperature: 0.4, // Lower temperature = more deterministic JSON
          maxOutputTokens: 2048,
        },
      })

      let text = result.response.text().trim()

      // Strip markdown code blocks nếu có (```json ... ```)
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch?.[1]) {
        text = codeBlockMatch[1].trim()
      }

      return JSON.parse(text) as T

    } catch (err: any) {
      const is429 = err?.message?.includes('429') || err?.status === 429
      const is503 = err?.message?.includes('503') || err?.status === 503
      const isParseError = err instanceof SyntaxError
      const isLastAttempt = attempt === retries

      if ((is429 || is503) && !isLastAttempt) {
        const delayMatch = err.message?.match(/retryDelay.*?(\d+)s/)
        const waitMs = delayMatch ? parseInt(delayMatch[1]!) * 1000 : attempt * 8000
        console.warn(`[Gemini] ${is429 ? '429' : '503'} - Retry ${attempt}/${retries} sau ${waitMs / 1000}s...`)
        await sleep(waitMs)
        continue
      }

      if (isParseError && !isLastAttempt) {
        console.warn(`[Gemini] JSON parse error - Retry ${attempt}/${retries}...`)
        await sleep(2000)
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
