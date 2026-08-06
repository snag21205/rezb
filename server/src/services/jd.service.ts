import { supabaseAdmin } from '../config/supabase'
import { matchJDWithAI } from './ai.service'
import { AppError } from '../utils/helpers'

/**
 * Lưu JD mới vào DB
 */
export async function createJD(
  userId: string,
  data: { title: string; company?: string; rawText: string }
) {
  const { data: jd, error } = await supabaseAdmin
    .from('job_descriptions')
    .insert({
      user_id: userId,
      title: data.title,
      company: data.company ?? null,
      raw_text: data.rawText,
    })
    .select()
    .single()

  if (error || !jd) throw new AppError(`Lỗi lưu JD: ${error?.message}`, 500)
  return jd
}

/**
 * Lấy danh sách JD của user
 */
export async function getUserJDs(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('job_descriptions')
    .select('id, title, company, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new AppError(error.message, 500)
  return data
}

/**
 * Lấy 1 JD (kiểm tra ownership)
 */
export async function getJD(jdId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('job_descriptions')
    .select('*')
    .eq('id', jdId)
    .eq('user_id', userId)
    .single()

  if (error || !data) throw new AppError('JD không tồn tại hoặc bạn không có quyền truy cập.', 404)
  return data
}

/**
 * So khớp CV với JD bằng AI + lưu kết quả vào DB
 */
export async function matchCVWithJD(
  userId: string,
  resumeId: string,
  jdId: string
) {
  // 1. Lấy CV text
  const { data: resume, error: resumeErr } = await supabaseAdmin
    .from('resumes')
    .select('raw_text')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .single()

  if (resumeErr || !resume) throw new AppError('CV không tồn tại.', 404)

  // 2. Lấy JD text
  const jd = await getJD(jdId, userId)

  // 3. Gọi AI so khớp
  const matchResult = await matchJDWithAI(resume.raw_text, jd.raw_text)

  // 4. Lưu kết quả vào DB
  const { data, error } = await supabaseAdmin
    .from('jd_matches')
    .insert({
      resume_id: resumeId,
      jd_id: jdId,
      match_score: matchResult.match_score,
      matched_skills: matchResult.matched_skills,
      missing_skills: matchResult.missing_skills,
      rewrite_suggestions: matchResult.rewrite_suggestions,
    })
    .select()
    .single()

  if (error || !data) throw new AppError(`Lỗi lưu kết quả match: ${error?.message}`, 500)

  return {
    matchId: data.id,
    ...matchResult,
  }
}
