import { Router } from 'express'
import { aiLimiter } from '../middleware/rateLimiter'
import * as interviewController from '../controllers/interview.controller'

const router: Router = Router()

// GET /api/interview/history — Lịch sử các session (phải trước /:sessionId)
router.get('/history', interviewController.history)

// POST /api/interview/start — Bắt đầu phỏng vấn mới
router.post('/start', aiLimiter, interviewController.start)

// GET /api/interview/:sessionId — Chi tiết 1 session
router.get('/:sessionId', interviewController.getSession)

// POST /api/interview/:sessionId/answer — Submit câu trả lời
router.post('/:sessionId/answer', aiLimiter, interviewController.answer)

// POST /api/interview/:sessionId/complete — Kết thúc session
router.post('/:sessionId/complete', aiLimiter, interviewController.complete)

export default router
