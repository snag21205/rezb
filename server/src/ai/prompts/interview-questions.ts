// Interview questions prompt — will be implemented in Phase 4
export const INTERVIEW_QUESTIONS_PROMPT = `
Bạn là người phỏng vấn chuyên nghiệp. Dựa trên JD, sinh ra bộ câu hỏi phỏng vấn phù hợp.
`

export function buildInterviewQuestionsPrompt(
  jdText: string,
  type: 'technical' | 'behavioral' | 'mixed',
  count: number = 5
): string {
  return `${INTERVIEW_QUESTIONS_PROMPT}

Sinh ${count} câu hỏi phỏng vấn loại "${type}" dựa trên JD. Trả về JSON:
{
  "questions": [
    {
      "question": "Câu hỏi",
      "type": "technical | behavioral | situational",
      "difficulty": "easy | medium | hard",
      "expected_topics": ["topic1", "topic2"]
    }
  ]
}

=== JOB DESCRIPTION ===
${jdText}
`
}
