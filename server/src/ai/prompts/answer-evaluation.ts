// Answer evaluation prompt — will be implemented in Phase 4
export const ANSWER_EVALUATION_PROMPT = `
Bạn là chuyên gia phỏng vấn. Đánh giá câu trả lời phỏng vấn theo STAR framework.
`

export function buildAnswerEvaluationPrompt(
  question: string,
  answer: string,
  jdContext?: string
): string {
  return `${ANSWER_EVALUATION_PROMPT}

Đánh giá câu trả lời phỏng vấn theo STAR framework và trả về JSON:
{
  "score": 0-10,
  "star_analysis": {
    "situation": { "present": true/false, "quality": "good/fair/missing", "feedback": "..." },
    "task": { "present": true/false, "quality": "good/fair/missing", "feedback": "..." },
    "action": { "present": true/false, "quality": "good/fair/missing", "feedback": "..." },
    "result": { "present": true/false, "quality": "good/fair/missing", "feedback": "..." }
  },
  "strengths": ["..."],
  "improvements": ["..."],
  "improved_answer": "Câu trả lời mẫu tốt hơn...",
  "follow_up_question": "Câu hỏi follow-up nếu cần hỏi thêm"
}

=== CÂU HỎI ===
${question}

=== CÂU TRẢ LỜI ===
${answer}

${jdContext ? `=== CONTEXT (JD) ===\n${jdContext}` : ''}
`
}
