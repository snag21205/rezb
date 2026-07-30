import { useState, useCallback } from 'react'

interface UseAIStreamOptions {
  url: string
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}

/**
 * Hook for consuming Server-Sent Events (SSE) from the AI backend
 */
export function useAIStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const startStream = useCallback(async (options: UseAIStreamOptions) => {
    const { url, onChunk, onComplete, onError } = options

    setIsStreaming(true)
    setStreamedText('')
    setError(null)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Stream failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (!reader) throw new Error('No response body')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamedText(fullText)
        onChunk?.(chunk)
      }

      onComplete?.(fullText)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Stream error')
      setError(error)
      onError?.(error)
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return { isStreaming, streamedText, error, startStream }
}
