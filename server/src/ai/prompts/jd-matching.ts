export const JD_MATCHING_SYSTEM_PROMPT = `
Bạn là chuyên gia tuyển dụng IT. So khớp CV với JD và đánh giá mức độ phù hợp.
Trả về JSON HỢP LỆ, ngắn gọn, không thêm text bên ngoài JSON.
`

export function buildJDMatchingPrompt(cvText: string, jdText: string): string {
  // Giới hạn độ dài để tránh response bị truncate
  const cvShort = cvText.slice(0, 2000)
  const jdShort = jdText.slice(0, 1500)

  return `${JD_MATCHING_SYSTEM_PROMPT}

Trả về JSON theo format sau (không thêm bất kỳ text nào ngoài JSON):
{
  "match_score": 75,
  "matched_skills": ["React", "TypeScript"],
  "missing_skills": ["Docker", "AWS"],
  "rewrite_suggestions": [
    { "section": "experience", "original": "Làm việc với web", "improved": "Phát triển 3 web apps với React + TypeScript, tăng hiệu suất 40%", "reason": "Cần số liệu cụ thể" }
  ],
  "summary": "CV phù hợp 75% với vị trí này. Thiếu kinh nghiệm cloud."
}

=== CV (tóm tắt) ===
${cvShort}

=== JOB DESCRIPTION ===
${jdShort}
`
}
