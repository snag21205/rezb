import { Router } from 'express'
import { aiLimiter } from '../middleware/rateLimiter'
// import { cvUpload } from '../middleware/fileValidation'
// import * as cvController from '../controllers/cv.controller'

const router = Router()

// POST /api/cv/upload — Upload CV file
router.post('/upload', async (_req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'CV upload — coming in Phase 2' })
})

// POST /api/cv/analyze/:resumeId — Analyze CV with AI (SSE stream)
router.post('/analyze/:resumeId', aiLimiter, async (_req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'CV analysis — coming in Phase 2' })
})

// GET /api/cv/analyses/:resumeId — Get analysis history
router.get('/analyses/:resumeId', async (_req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Analysis history — coming in Phase 2' })
})

export default router
