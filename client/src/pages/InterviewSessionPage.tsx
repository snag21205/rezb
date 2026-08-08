import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Card, Badge, ProgressBar, ScoreCircle, Spinner } from '../components/ui/index'
import Button from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { getInterviewSession, submitAnswer, completeInterview } from '../services/api'

export default function InterviewSessionPage() {
  const { id: sessionId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<any>(null)
  const [completing, setCompleting] = useState(false)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    if (!sessionId) return
    getInterviewSession(sessionId)
      .then(data => {
        setSession(data)
        const unansweredIdx = data.qa?.findIndex((q: any) => !q.user_answer)
        if (unansweredIdx !== -1 && unansweredIdx !== undefined) {
          setCurrentIdx(unansweredIdx)
        }
        if (data.status === 'completed') {
          setSummary(data.ai_summary)
        }
      })
      .catch(err => toast.error(err.message || 'Không thể tải phiên phỏng vấn'))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Spinner size={32} color="var(--color-twilight)" />
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p className="text-body">Không tìm thấy thông tin phiên phỏng vấn này.</p>
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/interview')}>Quay lại</Button>
      </div>
    )
  }

  const questions = session.qa || []
  const currentQ = questions[currentIdx]
  const isCompleted = session.status === 'completed' || !!summary

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return toast.error('Vui lòng nhập câu trả lời của bạn')

    setSubmitting(true)
    try {
      const res = await submitAnswer(sessionId!, currentQ.id, userAnswer)
      setCurrentFeedback(res)

      const updatedQA = [...questions]
      updatedQA[currentIdx] = {
        ...currentQ,
        user_answer: userAnswer,
        score: res.score,
        star_analysis: res.starAnalysis,
        improved_answer: res.improvedAnswer,
      }
      setSession({ ...session, qa: updatedQA })
      toast.success('AI đã chấm điểm câu trả lời!')
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi chấm điểm')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    setCurrentFeedback(null)
    setUserAnswer('')
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
    }
  }

  const handleCompleteSession = async () => {
    setCompleting(true)
    try {
      const res = await completeInterview(sessionId!)
      setSummary(res.summary)
      setSession({ ...session, status: 'completed' })
      toast.success('Đã hoàn thành buổi phỏng vấn!')
    } catch (err: any) {
      toast.error(err.message || 'Không thể tổng kết buổi phỏng vấn')
    } finally {
      setCompleting(false)
    }
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span className="badge badge-blue" style={{ marginBottom: 6 }}>
            {session.job_descriptions?.title || 'Phỏng vấn thử'}
          </span>
          <h1 className="text-heading" style={{ fontSize: 24 }}>
            {isCompleted ? 'Tổng kết phỏng vấn' : `Câu hỏi ${currentIdx + 1} / ${questions.length}`}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
          Xem lịch sử
        </Button>
      </div>

      {!isCompleted && (
        <ProgressBar value={((currentIdx + 1) / questions.length) * 100} height={6} />
      )}

      <AnimatePresence mode="wait">
        {isCompleted ? (
          /* Summary View */
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 }}
          >
            <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: 32 }}>
              <ScoreCircle score={summary?.overall_score ?? session.total_score ?? 0} size={110} label="Điểm tổng thể" />
              <div style={{ maxWidth: 440 }}>
                <h3 className="text-heading-sm" style={{ fontSize: 20, marginBottom: 8 }}>
                  Nhận xét tổng quan từ AI Interviewer
                </h3>
                <p className="text-body" style={{ color: 'var(--color-charcoal)', fontSize: 14 }}>
                  {summary?.overall_feedback || 'Bạn đã hoàn thành bài phỏng vấn với kết quả đánh giá chi tiết.'}
                </p>
              </div>
            </Card>

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 18, color: 'var(--color-success)', marginBottom: 12 }}>
                  Điểm mạnh ấn tượng
                </h3>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(summary?.strengths || []).map((s: string, i: number) => (
                    <li key={i} className="text-body" style={{ fontSize: 14 }}>{s}</li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 18, color: 'var(--color-warning)', marginBottom: 12 }}>
                  Điểm cần phát triển thêm
                </h3>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(summary?.areas_to_improve || []).map((s: string, i: number) => (
                    <li key={i} className="text-body" style={{ fontSize: 14 }}>{s}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </motion.div>
        ) : (
          /* Active Question View */
          <motion.div
            key={`q-${currentIdx}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}
          >
            {/* Question Card */}
            <Card style={{ borderLeft: '3px solid var(--color-twilight)', padding: 24 }}>
              <div style={{ marginBottom: 8 }}>
                <Badge variant="blue">{currentQ?.question_type}</Badge>
              </div>
              <h2 className="font-serif" style={{ fontSize: 22, color: 'var(--color-graphite)', lineHeight: 1.35 }}>
                {currentQ?.question}
              </h2>
            </Card>

            {/* Answer Box */}
            <Card>
              <h3 className="text-heading-sm" style={{ fontSize: 18, marginBottom: 12 }}>
                Câu trả lời của bạn
              </h3>

              {currentQ?.user_answer ? (
                <div className="card-linen" style={{ padding: 16, whiteSpace: 'pre-wrap', fontSize: 14 }}>
                  {currentQ.user_answer}
                </div>
              ) : (
                <Textarea
                  placeholder="Nhập câu trả lời chi tiết của bạn (khuyên dùng mô hình STAR: Situation -> Task -> Action -> Result)..."
                  rows={6}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                />
              )}

              {!currentQ?.user_answer && (
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="primary"
                    loading={submitting}
                    onClick={handleSubmitAnswer}
                  >
                    Gửi câu trả lời & AI Chấm Điểm
                  </Button>
                </div>
              )}
            </Card>

            {/* Feedback Box */}
            {(currentFeedback || currentQ?.score !== undefined) && (
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 className="text-heading-sm" style={{ fontSize: 18 }}>Chấm điểm từ Gemini AI</h3>
                  <Badge variant="success">Điểm: {currentFeedback?.score ?? currentQ?.score}/10</Badge>
                </div>

                {/* STAR Analysis */}
                {(currentFeedback?.starAnalysis || currentQ?.star_analysis) && (
                  <div style={{ marginBottom: 20 }}>
                    <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 8, fontWeight: 500 }}>
                      MÔ HÌNH STAR:
                    </p>
                    <div className="grid-star" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {Object.entries(currentFeedback?.starAnalysis || currentQ?.star_analysis || {}).map(([k, val]: [string, any]) => (
                        <div key={k} className="card-linen" style={{ padding: 10, textAlign: 'center' }}>
                          <p className="text-caption" style={{ textTransform: 'uppercase', color: 'var(--color-ash)', fontSize: 11 }}>{k}</p>
                          <p style={{ marginTop: 2, fontWeight: 600, fontSize: 13, color: val?.present ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {val?.present ? '✓ Đạt' : '✗ Thiếu'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improved Answer */}
                {(currentFeedback?.improvedAnswer || currentQ?.improved_answer) && (
                  <div className="card-linen" style={{ padding: 16 }}>
                    <p className="text-caption" style={{ color: 'var(--color-twilight)', fontWeight: 600, marginBottom: 4 }}>
                      GỢI Ý CÂU TRẢ LỜI MẪU TỪ AI:
                    </p>
                    <p className="text-body" style={{ fontSize: 14, color: 'var(--color-charcoal)' }}>
                      {currentFeedback?.improvedAnswer || currentQ?.improved_answer}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  {currentIdx < questions.length - 1 ? (
                    <Button variant="primary" onClick={handleNextQuestion}>
                      Câu tiếp theo
                    </Button>
                  ) : (
                    <Button variant="dark" loading={completing} onClick={handleCompleteSession}>
                      Hoàn thành phỏng vấn
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
