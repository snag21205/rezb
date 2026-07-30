import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

/**
 * Gemini 2.0 Flash model instance
 * Free tier: 15 RPM, 1M tokens/min, 1500 req/day
 */
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
})

/**
 * Generate content with JSON output
 */
export async function generateJSON<T>(prompt: string): Promise<T> {
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  })

  const text = result.response.text()
  return JSON.parse(text) as T
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
