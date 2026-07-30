// CV Analysis prompt — will be implemented in Phase 2
export const CV_ANALYSIS_SYSTEM_PROMPT = `
Bạn là chuyên gia tuyển dụng IT với 10+ năm kinh nghiệm tại thị trường Việt Nam và quốc tế.
Phân tích CV được cung cấp và trả về JSON với cấu trúc được chỉ định.
`

export function buildCVAnalysisPrompt(cvText: string): string {
  return `${CV_ANALYSIS_SYSTEM_PROMPT}

Phân tích CV sau đây và trả về JSON theo format:
{
  "overall_score": 0-100,
  "ats_score": 0-100,
  "sections": {
    "contact_info": { "score": 0-10, "feedback": "...", "suggestions": ["..."] },
    "summary": { "score": 0-10, "feedback": "...", "suggestions": ["..."] },
    "experience": { "score": 0-30, "feedback": "...", "suggestions": ["..."] },
    "education": { "score": 0-10, "feedback": "...", "suggestions": ["..."] },
    "skills": { "score": 0-20, "feedback": "...", "suggestions": ["..."] },
    "projects": { "score": 0-20, "feedback": "...", "suggestions": ["..."] }
  },
  "strengths": ["..."],
  "critical_issues": ["..."],
  "rewrite_suggestions": [
    { "original": "câu gốc trong CV", "improved": "câu được viết lại tốt hơn", "reason": "lý do" }
  ]
}

=== CV TEXT ===
${cvText}
`
}
