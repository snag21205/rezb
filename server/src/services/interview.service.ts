import { supabaseAdmin } from '../config/supabase'
import {
  generateInterviewQuestionsWithAI,
  evaluateAnswerWithAI,
  summarizeInterviewWithAI,
} from './ai.service'
import { AppError } from '../utils/helpers'

/**
 * Bắt đầu phiên phỏng vấn mới: sinh câu hỏi + lưu DB
 */
export async function startInterview(
  userId: string,
  jdId: string,
  type: 'technical' | 'behavioral' | 'mixed'
) {
  // 1. Lấy JD (verify ownership)
  const { data: jd, error: jdErr } = await supabaseAdmin
    .from('job_descriptions')
    .select('id, raw_text, title')
    .eq('id', jdId)
    .eq('user_id', userId)
    .single()

  if (jdErr || !jd) throw new AppError('JD không tồn tại hoặc bạn không có quyền truy cập.', 404)

  // 2. Gọi AI sinh câu hỏi
  const { questions } = await generateInterviewQuestionsWithAI(jd.raw_text, type)

  // 3. Tạo session
  const { data: session, error: sessionErr } = await supabaseAdmin
    .from('interview_sessions')
    .insert({
      user_id: userId,
      jd_id: jdId,
      type,
      status: 'in_progress',
    })
    .select()
    .single()

  if (sessionErr || !session) throw new AppError(`Lỗi tạo session: ${sessionErr?.message}`, 500)

  // 4. Lưu câu hỏi vào interview_qa
  const qaRows = questions.map((q, i) => ({
    session_id: session.id,
    question_order: i + 1,
    question: q.question,
    question_type: q.type,
  }))

  const { data: savedQA, error: qaErr } = await supabaseAdmin
    .from('interview_qa')
    .insert(qaRows)
    .select('id, question_order, question, question_type')

  if (qaErr || !savedQA) throw new AppError(`Lỗi lưu câu hỏi: ${qaErr?.message}`, 500)

  return {
    sessionId: session.id,
    jdTitle: jd.title,
    type,
    questions: savedQA,
  }
}

/**
 * Submit câu trả lời + AI chấm điểm STAR
 */
export async function submitAnswer(
  sessionId: string,
  userId: string,
  questionId: string,
  answer: string
) {
  // 1. Verify session ownership
  const { data: session, error: sessionErr } = await supabaseAdmin
    .from('interview_sessions')
    .select('id, status, jd_id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (sessionErr || !session) throw new AppError('Session không tồn tại.', 404)
  if (session.status === 'completed') throw new AppError('Buổi phỏng vấn đã kết thúc.', 400)

  // 2. Lấy câu hỏi
  const { data: qa, error: qaErr } = await supabaseAdmin
    .from('interview_qa')
    .select('question, question_type')
    .eq('id', questionId)
    .eq('session_id', sessionId)
    .single()

  if (qaErr || !qa) throw new AppError('Câu hỏi không tồn tại.', 404)

  // 3. Lấy JD context
  const { data: jd } = await supabaseAdmin
    .from('job_descriptions')
    .select('raw_text')
    .eq('id', session.jd_id)
    .single()

  // 4. Gọi AI đánh giá
  const evaluation = await evaluateAnswerWithAI(
    qa.question,
    answer,
    jd?.raw_text?.slice(0, 800) // context ngắn gọn
  )

  // 5. Lưu câu trả lời + kết quả đánh giá
  const { data: updated, error: updateErr } = await supabaseAdmin
    .from('interview_qa')
    .update({
      user_answer: answer,
      score: Math.round(evaluation.score),
      star_analysis: evaluation.star_analysis,
      ai_feedback: evaluation.improvements.join('; '),
      improved_answer: evaluation.improved_answer,
      answered_at: new Date().toISOString(),
    })
    .eq('id', questionId)
    .select()
    .single()

  if (updateErr || !updated) throw new AppError(`Lỗi lưu câu trả lời: ${updateErr?.message}`, 500)

  return {
    questionId,
    score: evaluation.score,
    starAnalysis: evaluation.star_analysis,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
    improvedAnswer: evaluation.improved_answer,
    followUpQuestion: evaluation.follow_up_question,
  }
}

/**
 * Kết thúc session: AI tổng kết + lưu overall score
 */
export async function completeInterview(sessionId: string, userId: string) {
  // 1. Verify session
  const { data: session, error: sessionErr } = await supabaseAdmin
    .from('interview_sessions')
    .select('id, status')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (sessionErr || !session) throw new AppError('Session không tồn tại.', 404)
  if (session.status === 'completed') throw new AppError('Session đã được kết thúc trước đó.', 400)

  // 2. Lấy tất cả QA đã trả lời
  const { data: qaList, error: qaErr } = await supabaseAdmin
    .from('interview_qa')
    .select('question, user_answer, score')
    .eq('session_id', sessionId)
    .not('user_answer', 'is', null)

  if (qaErr) throw new AppError(qaErr.message, 500)

  if (!qaList || qaList.length === 0) {
    throw new AppError('Chưa có câu trả lời nào để tổng kết.', 400)
  }

  // 3. Gọi AI tổng kết
  const qaPairs = qaList.map(qa => ({
    question: qa.question,
    answer: qa.user_answer ?? '',
    score: qa.score ?? 0,
  }))

  const summary = await summarizeInterviewWithAI(qaPairs)

  // 4. Cập nhật session status + summary
  const { data: updated, error: updateErr } = await supabaseAdmin
    .from('interview_sessions')
    .update({
      status: 'completed',
      total_score: summary.overall_score,
      ai_summary: summary,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (updateErr || !updated) throw new AppError(`Lỗi cập nhật session: ${updateErr?.message}`, 500)

  return {
    sessionId,
    totalScore: summary.overall_score,
    summary,
  }
}

/**
 * Lấy lịch sử các session phỏng vấn
 */
export async function getInterviewHistory(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('interview_sessions')
    .select(`
      id,
      type,
      status,
      total_score,
      created_at,
      completed_at,
      job_descriptions (title, company)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new AppError(error.message, 500)
  return data
}

/**
 * Lấy chi tiết một session (kèm Q&A)
 */
export async function getInterviewSession(sessionId: string, userId: string) {
  const { data: session, error } = await supabaseAdmin
    .from('interview_sessions')
    .select(`
      id, type, status, total_score, ai_summary, created_at, completed_at,
      job_descriptions (title, company)
    `)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (error || !session) throw new AppError('Session không tồn tại.', 404)

  const { data: qaList } = await supabaseAdmin
    .from('interview_qa')
    .select('*')
    .eq('session_id', sessionId)
    .order('question_order')

  return { ...session, qa: qaList ?? [] }
}
