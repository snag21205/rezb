export function buildInterviewQuestionsPrompt(
  jdText: string,
  type: 'technical' | 'behavioral' | 'mixed',
  count: number = 5
): string {
  const jdShort = jdText.slice(0, 1500)

  const typeInstruction = {
    technical: 'kỹ thuật chuyên môn (code, system design, problem solving)',
    behavioral: 'hành vi ứng xử theo STAR framework (tell me about a time...)',
    mixed: 'kết hợp kỹ thuật và hành vi ứng xử',
  }[type]

  return `Bạn là người phỏng vấn chuyên nghiệp IT.
Dựa trên JD dưới đây, sinh ${count} câu hỏi phỏng vấn loại ${typeInstruction}.
Trả về JSON hợp lệ, không thêm text bên ngoài JSON.

{
  "questions": [
    {
      "question": "Hãy mô tả kinh nghiệm của bạn với React hooks?",
      "type": "technical",
      "difficulty": "medium",
      "expected_topics": ["useState", "useEffect", "custom hooks"]
    }
  ]
}

=== JOB DESCRIPTION ===
${jdShort}
`
}

export function buildInterviewSummaryPrompt(
  qaPairs: Array<{ question: string; answer: string; score: number }>
): string {
  const qaText = qaPairs
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nScore: ${qa.score}/10`)
    .join('\n\n')

  return `Bạn là chuyên gia phỏng vấn. Tổng kết buổi phỏng vấn dựa trên các câu hỏi và câu trả lời sau.
Trả về JSON hợp lệ, không thêm text bên ngoài JSON.

{
  "overall_score": 75,
  "overall_feedback": "Ứng viên có nền tảng kỹ thuật tốt...",
  "strengths": ["Kiến thức React sâu", "Trình bày rõ ràng"],
  "areas_to_improve": ["Cần cải thiện system design", "Thiếu ví dụ cụ thể"],
  "recommended_topics": ["Docker", "Microservices", "System Design"]
}

=== BUỔI PHỎNG VẤN ===
${qaText}
`
}
