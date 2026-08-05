import { Router } from 'express'
import { aiLimiter } from '../middleware/rateLimiter'
import { cvUpload } from '../middleware/fileValidation'
import * as cvController from '../controllers/cv.controller'

const router = Router()

// GET /api/cv — Lấy danh sách CV của user
router.get('/', cvController.getAll)

// POST /api/cv/upload — Upload CV file
router.post('/upload', cvUpload, cvController.upload)

// POST /api/cv/analyze/:resumeId — Analyze CV with AI
router.post('/analyze/:resumeId', aiLimiter, cvController.analyze)

// GET /api/cv/analyses/:resumeId — Get analysis history
router.get('/analyses/:resumeId', cvController.getHistory)

export default router
