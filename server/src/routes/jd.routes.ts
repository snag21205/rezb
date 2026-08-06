import { Router } from 'express'
import { aiLimiter } from '../middleware/rateLimiter'
import * as jdController from '../controllers/jd.controller'

const router = Router()

// GET /api/jd — Lấy danh sách JD đã lưu
router.get('/', jdController.getAll)

// POST /api/jd — Lưu JD mới
router.post('/', jdController.create)

// POST /api/jd/match — So khớp CV với JD (AI)
router.post('/match', aiLimiter, jdController.match)

export default router
