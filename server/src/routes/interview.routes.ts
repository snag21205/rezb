import { Router } from 'express'
import { aiLimiter } from '../middleware/rateLimiter'
// import * as interviewController from '../controllers/interview.controller'

const router = Router()

// POST /api/interview/start — Start new interview session
router.post('/start', aiLimiter, async (_req, res) => {
  // TODO: Implement in Phase 4
  res.status(501).json({ message: 'Start interview — coming in Phase 4' })
})

// POST /api/interview/:sessionId/answer — Submit answer
router.post('/:sessionId/answer', aiLimiter, async (_req, res) => {
  // TODO: Implement in Phase 4
  res.status(501).json({ message: 'Submit answer — coming in Phase 4' })
})

// POST /api/interview/:sessionId/complete — Complete session
router.post('/:sessionId/complete', async (_req, res) => {
  // TODO: Implement in Phase 4
  res.status(501).json({ message: 'Complete interview — coming in Phase 4' })
})

// GET /api/interview/history — Get interview history
router.get('/history', async (_req, res) => {
  // TODO: Implement in Phase 4
  res.status(501).json({ message: 'Interview history — coming in Phase 4' })
})

export default router
