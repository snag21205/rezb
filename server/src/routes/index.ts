import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { apiLimiter } from '../middleware/rateLimiter'
import cvRoutes from './cv.routes'
import jdRoutes from './jd.routes'
import interviewRoutes from './interview.routes'

const router = Router()

// Apply rate limiting to all API routes
router.use(apiLimiter)

// All routes below require authentication
router.use(authMiddleware)

// Feature routes
router.use('/cv', cvRoutes)
router.use('/jd', jdRoutes)
router.use('/interview', interviewRoutes)

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  // TODO: Implement in Phase 5
  res.json({
    totalAnalyses: 0,
    averageScore: 0,
    interviewSessions: 0,
    userId: req.userId,
  })
})

export default router
