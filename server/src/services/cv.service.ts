import { supabaseAdmin } from '../config/supabase'
import { parseCV } from '../utils/pdf-parser'
import { analyzeCVWithAI } from './ai.service'
import { AppError } from '../utils/helpers'

const CV_BUCKET = 'cv-uploads'

/**
 * Upload CV file: parse text + save to Supabase Storage & DB
 */
export async function uploadCV(
  userId: string,
  file: Express.Multer.File
): Promise<{ id: string; rawText: string; fileName: string }> {

  // 1. Parse text từ file
  const rawText = await parseCV(file.buffer, file.originalname)

  if (!rawText || rawText.length < 50) {
    throw new AppError('Không thể đọc nội dung CV. Vui lòng đảm bảo file không bị mã hóa.', 400)
  }

  // 2. Upload file lên Supabase Storage
  const filePath = `${userId}/${Date.now()}_${file.originalname}`

  const { error: storageError } = await supabaseAdmin.storage
    .from(CV_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (storageError) {
    throw new AppError(`Lỗi lưu file: ${storageError.message}`, 500)
  }

  // 3. Đặt các CV cũ thành không active
  await supabaseAdmin
    .from('resumes')
    .update({ is_active: false })
    .eq('user_id', userId)

  // 4. Lưu metadata vào DB
  const { data: resume, error: dbError } = await supabaseAdmin
    .from('resumes')
    .insert({
      user_id: userId,
      file_name: file.originalname,
      file_path: filePath,
      raw_text: rawText,
      is_active: true,
    })
    .select()
    .single()

  if (dbError || !resume) {
    throw new AppError(`Lỗi lưu database: ${dbError?.message}`, 500)
  }

  return {
    id: resume.id,
    rawText: resume.raw_text,
    fileName: resume.file_name,
  }
}

/**
 * Get all resumes of a user
 */
export async function getUserResumes(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('resumes')
    .select('id, file_name, is_active, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new AppError(error.message, 500)
  return data
}

/**
 * Get a single resume (verify ownership)
 */
export async function getResume(resumeId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .single()

  if (error || !data) throw new AppError('CV không tồn tại hoặc bạn không có quyền truy cập.', 404)
  return data
}

/**
 * Phân tích CV bằng Gemini AI + lưu kết quả vào DB
 */
export async function analyzeCV(resumeId: string, userId: string) {
  // 1. Lấy CV từ DB (kiểm tra ownership)
  const resume = await getResume(resumeId, userId)

  // 2. Gọi Gemini AI phân tích
  const analysis = await analyzeCVWithAI(resume.raw_text)

  // 3. Lưu kết quả vào DB
  const { data, error } = await supabaseAdmin
    .from('resume_analyses')
    .insert({
      resume_id: resumeId,
      overall_score: analysis.overall_score,
      ats_score: analysis.ats_score,
      section_scores: analysis.sections,
      strengths: analysis.strengths,
      weaknesses: analysis.critical_issues,
      suggestions: analysis.rewrite_suggestions,
      ats_details: analysis.sections,
    })
    .select()
    .single()

  if (error || !data) throw new AppError(`Lỗi lưu kết quả phân tích: ${error?.message}`, 500)

  return {
    analysisId: data.id,
    ...analysis,
  }
}

/**
 * Lấy lịch sử phân tích của một resume
 */
export async function getAnalysisHistory(resumeId: string, userId: string) {
  // Verify ownership trước
  await getResume(resumeId, userId)

  const { data, error } = await supabaseAdmin
    .from('resume_analyses')
    .select('id, overall_score, ats_score, created_at')
    .eq('resume_id', resumeId)
    .order('created_at', { ascending: false })

  if (error) throw new AppError(error.message, 500)
  return data
}
