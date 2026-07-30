# Smart Expense Tracker (Trợ lý quản lý chi tiêu thông minh)

Ứng dụng ghi chép và phân tích chi tiêu cá nhân bằng ngôn ngữ tự nhiên, có AI hỗ trợ phân loại và đưa lời khuyên tài chính.

## Vấn đề giải quyết

Hầu hết người dùng:
- Ghi chép chi tiêu nhưng lười phân loại danh mục thủ công
- Không biết mình đang tiêu quá nhiều vào đâu
- Không có ai/công cụ nào phân tích xu hướng chi tiêu và đưa lời khuyên cụ thể

## Tính năng chính

### 1. Nhập chi tiêu bằng ngôn ngữ tự nhiên
- Người dùng gõ (hoặc nói): *"hôm nay ăn phở 40k, đổ xăng 100k, mua sách 150k"*
- AI trích xuất thành dữ liệu có cấu trúc: từng khoản chi + số tiền + danh mục (ăn uống, di chuyển, giáo dục...)
- Người dùng xác nhận/chỉnh sửa trước khi lưu

### 2. Dashboard trực quan
- Biểu đồ chi tiêu theo danh mục (pie chart), theo thời gian (line/bar chart)
- Lọc theo tuần/tháng/khoảng thời gian tùy chọn
- So sánh chi tiêu tháng này với tháng trước

### 3. Phân tích & lời khuyên từ AI
- Hàng tuần/tháng, AI tổng hợp xu hướng chi tiêu và đưa nhận xét: 
  - "Bạn chi cho ăn uống ngoài tăng 30% so với tháng trước"
  - Gợi ý cụ thể để tối ưu (ví dụ: đặt hạn mức cho từng danh mục)

### 4. Đặt ngân sách & cảnh báo
- Người dùng đặt hạn mức chi tiêu theo danh mục
- Cảnh báo khi gần/vượt hạn mức

## Đề xuất kỹ thuật (tham khảo)

**Frontend:** Next.js (App Router), TailwindCSS, Recharts (biểu đồ)

**Backend:** Next.js API routes hoặc route handlers

**AI:** Anthropic API (Claude) — dùng **function calling / structured output (JSON)** để:
- Trích xuất danh sách khoản chi + số tiền + danh mục từ câu tự nhiên
- Sinh nhận xét/lời khuyên định kỳ dựa trên dữ liệu chi tiêu tổng hợp

**Database:** PostgreSQL + Prisma
- Bảng gợi ý: `users`, `transactions` (mô tả gốc, số tiền, danh mục, ngày), `categories`, `budgets`, `ai_insights`

**Auth:** NextAuth hoặc Supabase Auth

## Roadmap gợi ý

1. **Tuần 1:** Setup dự án, auth, form nhập chi tiêu cơ bản (chưa có AI)
2. **Tuần 2:** Tích hợp AI để trích xuất dữ liệu có cấu trúc từ câu nhập tự nhiên
3. **Tuần 3:** Dashboard biểu đồ (theo danh mục, theo thời gian)
4. **Tuần 4:** Tính năng ngân sách + cảnh báo hạn mức
5. **Tuần 5:** AI phân tích xu hướng & đưa lời khuyên định kỳ, polish UI

## Điểm nhấn khi trình bày trong CV/phỏng vấn

- Ứng dụng AI cho **structured data extraction** từ ngôn ngữ tự nhiên (kỹ năng hay được hỏi trong phỏng vấn về AI integration)
- Thiết kế schema database cho dữ liệu tài chính cá nhân
- Data visualization (biểu đồ) có ý nghĩa thực tế, không chỉ là demo
- Có thể mở rộng thêm: xuất báo cáo PDF, đồng bộ nhiều thiết bị, dự đoán chi tiêu tháng tới

## Lưu ý bảo mật

- Dữ liệu tài chính cá nhân là nhạy cảm — cần đảm bảo mỗi user chỉ truy cập được dữ liệu của chính mình (kiểm tra kỹ authorization ở API)
- Không nên gửi toàn bộ lịch sử giao dịch ra ngoài AI API nếu không cần thiết — chỉ gửi phần cần phân tích, tổng hợp trước nếu có thể
