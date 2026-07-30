# CV & Interview Coach

Trợ lý AI giúp người tìm việc cải thiện CV và luyện tập phỏng vấn dựa trên mô tả công việc (JD) cụ thể.

## Vấn đề giải quyết

Người tìm việc, đặc biệt là sinh viên mới ra trường, thường:
- Không biết CV của mình còn thiếu/yếu ở điểm nào
- Không biết cách viết CV "khớp" với từng JD cụ thể
- Thiếu cơ hội luyện tập phỏng vấn thực tế trước khi phỏng vấn thật

## Tính năng chính

### 1. Phân tích CV
- Người dùng upload CV (PDF)
- AI đọc và phân tích: cấu trúc, cách diễn đạt, từ khóa còn thiếu
- Trả về nhận xét theo từng mục (kinh nghiệm, học vấn, kỹ năng...) kèm gợi ý cải thiện cụ thể

### 2. So khớp CV với JD (JD Matching)
- Người dùng dán mô tả công việc (JD) muốn ứng tuyển
- AI so sánh CV với JD, chỉ ra:
  - Điểm phù hợp
  - Kỹ năng/từ khóa còn thiếu
  - Gợi ý chỉnh sửa để tăng tỷ lệ match

### 3. Luyện tập phỏng vấn giả lập
- Dựa trên JD, AI sinh ra bộ câu hỏi phỏng vấn phù hợp (kỹ thuật, hành vi...)
- Người dùng trả lời (dạng text hoặc voice-to-text)
- AI chấm điểm câu trả lời theo tiêu chí (rõ ràng, cụ thể, có số liệu...) và đưa phản hồi cải thiện

### 4. Lưu lịch sử
- Lưu các lần phân tích CV, các JD đã match, lịch sử luyện phỏng vấn
- Theo dõi tiến bộ qua thời gian

## Đề xuất kỹ thuật (tham khảo)

**Frontend:** Next.js (App Router), TailwindCSS

**Backend:** Next.js API routes hoặc route handlers

**AI:** Anthropic API (Claude) — dùng cho:
- Phân tích văn bản CV
- So khớp JD (có thể dùng structured output/JSON để trả về điểm số + danh sách gợi ý)
- Sinh câu hỏi phỏng vấn và chấm điểm câu trả lời

**Xử lý file:** Parse PDF (ví dụ `pdf-parse` hoặc tương đương) để trích xuất text từ CV

**Database:** PostgreSQL + Prisma
- Bảng gợi ý: `users`, `resumes`, `resume_analyses`, `job_descriptions`, `interview_sessions`, `interview_answers`

**Auth:** NextAuth (đăng nhập bằng email hoặc Google)

## Roadmap gợi ý

1. **Tuần 1:** Setup dự án, auth, upload & parse CV
2. **Tuần 2:** Tích hợp AI phân tích CV, hiển thị kết quả
3. **Tuần 3:** Tính năng JD matching
4. **Tuần 4:** Luyện tập phỏng vấn giả lập (sinh câu hỏi + chấm điểm)
5. **Tuần 5:** Lưu lịch sử, dashboard theo dõi tiến bộ, polish UI

## Điểm nhấn khi trình bày trong CV/phỏng vấn

- Kinh nghiệm xử lý file (parse PDF) và trích xuất dữ liệu không có cấu trúc
- Prompt engineering có cấu trúc (yêu cầu AI trả về JSON để hiển thị UI động)
- Thiết kế UX cho một use-case thực tế, có giá trị rõ ràng với người dùng
- Quản lý dữ liệu người dùng (lịch sử, tiến độ) đúng cách

## Lưu ý bảo mật

- CV chứa thông tin cá nhân (tên, email, SĐT...) — cần cân nhắc mã hóa dữ liệu lưu trữ hoặc giới hạn thời gian lưu file
- Không nên log nội dung CV ra console/log hệ thống khi triển khai thực tế
