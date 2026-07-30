// JD Matching prompt — will be implemented in Phase 3
export const JD_MATCHING_SYSTEM_PROMPT = `
Bạn là chuyên gia tuyển dụng. So khớp CV với mô tả công việc (JD) và đánh giá mức độ phù hợp.
`

export function buildJDMatchingPrompt(cvText: string, jdText: string): string {
  return `${JD_MATCHING_SYSTEM_PROMPT}

So khớp CV với JD và trả về JSON:
{
  "match_score": 0-100,
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill3", "skill4"],
  "rewrite_suggestions": [
    { "section": "experience", "original": "...", "improved": "...", "reason": "..." }
  ],
  "summary": "Tổng kết ngắn gọn mức độ phù hợp"
}

=== CV ===
${cvText}

=== JOB DESCRIPTION ===
${jdText}
`
}
