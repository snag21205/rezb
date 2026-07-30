import { Router } from 'express'
import { aiLimiter } from '../middleware/rateLimiter'
// import * as jdController from '../controllers/jd.controller'

const router = Router()

// POST /api/jd — Save a new job description
router.post('/', async (_req, res) => {
  // TODO: Implement in Phase 3
  res.status(501).json({ message: 'Save JD — coming in Phase 3' })
})

// GET /api/jd — Get all saved JDs
router.get('/', async (_req, res) => {
  // TODO: Implement in Phase 3
  res.status(501).json({ message: 'List JDs — coming in Phase 3' })
})

// POST /api/jd/match — Match CV vs JD (SSE stream)
router.post('/match', aiLimiter, async (_req, res) => {
  // TODO: Implement in Phase 3
  res.status(501).json({ message: 'JD matching — coming in Phase 3' })
})

export default router
