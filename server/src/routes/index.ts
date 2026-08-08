import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { apiLimiter } from '../middleware/rateLimiter'
import { asyncHandler } from '../utils/helpers'
import { supabaseAdmin } from '../config/supabase'
import cvRoutes from './cv.routes'
import jdRoutes from './jd.routes'
import interviewRoutes from './interview.routes'

const router: Router = Router()

router.use(apiLimiter)
router.use(authMiddleware)

router.use('/cv', cvRoutes)
router.use('/jd', jdRoutes)
router.use('/interview', interviewRoutes)

// GET /api/dashboard/stats
router.get('/dashboard/stats', asyncHandler(async (req, res) => {
  const userId = req.userId!

  const [analysesRes, sessionsRes, latestAnalysisRes] = await Promise.all([
    // Tổng số lần phân tích CV
    supabaseAdmin
      .from('resume_analyses')
      .select('id', { count: 'exact', head: true })
      .in('resume_id',
        supabaseAdmin.from('resumes').select('id').eq('user_id', userId) as any
      ),

    // Tổng số phiên phỏng vấn
    supabaseAdmin
      .from('interview_sessions')
      .select('id, total_score', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'completed'),

    // ATS score gần nhất
    supabaseAdmin
      .from('resume_analyses')
      .select('ats_score, overall_score')
      .in('resume_id',
        supabaseAdmin.from('resumes').select('id').eq('user_id', userId) as any
      )
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const sessions = sessionsRes.data ?? []
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.total_score ?? 0), 0) / sessions.length)
    : 0

  res.json({
    success: true,
    data: {
      totalAnalyses: analysesRes.count ?? 0,
      averageInterviewScore: avgScore,
      interviewSessions: sessionsRes.count ?? 0,
      latestATSScore: latestAnalysisRes.data?.ats_score ?? null,
      latestOverallScore: latestAnalysisRes.data?.overall_score ?? null,
    },
  })
}))

export default router

