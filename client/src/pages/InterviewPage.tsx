import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card, Spinner } from '../components/ui/index'
import Button from '../components/ui/Button'
import { getUserJDs, startInterview } from '../services/api'

export default function InterviewPage() {
  const navigate = useNavigate()
  const [jds, setJds] = useState<any[]>([])
  const [selectedJdId, setSelectedJdId] = useState<string>('')
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'mixed'>('mixed')

  const [loadingJds, setLoadingJds] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    getUserJDs()
      .then(data => {
        setJds(data)
        if (data.length > 0 && data[0]) setSelectedJdId(data[0].id)
      })
      .catch(console.error)
      .finally(() => setLoadingJds(false))
  }, [])

  const handleStart = async () => {
    if (!selectedJdId) return toast.error('Vui lòng chọn vị trí tuyển dụng (JD) trước')

    setStarting(true)
    try {
      const session = await startInterview(selectedJdId, interviewType)
      toast.success('Đã khởi tạo phỏng vấn! Gemini AI đang soạn câu hỏi...')
      navigate(`/interview/${session.sessionId}`)
    } catch (err: any) {
      toast.error(err.message || 'Không thể tạo phiên phỏng vấn')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ fontSize: 36, marginBottom: 8 }}>
          Mock Interview
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)' }}>
          Thực hành trả lời câu hỏi phỏng vấn thực tế dựa trên vị trí công việc của bạn.
        </p>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32 }}>
        {/* Step 1: Select JD */}
        <div>
          <h2 className="text-heading-sm" style={{ fontSize: 20, marginBottom: 12 }}>
            1. Chọn vị trí tuyển dụng (JD)
          </h2>
          {loadingJds ? (
            <Spinner />
          ) : jds.length === 0 ? (
            <div className="card-linen" style={{ padding: 20, textAlign: 'center', color: 'var(--color-ash)' }}>
              Chưa có vị trí tuyển dụng nào. Hãy sang trang <strong>So khớp JD</strong> để thêm JD mới!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {jds.map(j => (
                <div
                  key={j.id}
                  onClick={() => setSelectedJdId(j.id)}
                  style={{
                    padding: 12, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    border: `1px solid ${selectedJdId === j.id ? 'var(--color-twilight)' : 'var(--color-mist)'}`,
                    background: selectedJdId === j.id ? 'var(--color-linen)' : 'var(--color-paper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p className="text-body" style={{ fontWeight: 500, fontSize: 14 }}>{j.title}</p>
                    {j.company && <p className="text-caption" style={{ color: 'var(--color-ash)' }}>{j.company}</p>}
                  </div>
                  {selectedJdId === j.id && <span style={{ color: 'var(--color-signal-blue)', fontWeight: 600 }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Choose Type */}
        <div>
          <h2 className="text-heading-sm" style={{ fontSize: 20, marginBottom: 12 }}>
            2. Định dạng câu hỏi
          </h2>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { id: 'mixed', label: 'Hỗn hợp (Mixed)', desc: 'Chuyên môn & Hành vi' },
              { id: 'technical', label: 'Chuyên môn', desc: 'Code, Kiến trúc & Kỹ thuật' },
              { id: 'behavioral', label: 'Hành vi (STAR)', desc: 'Xử lý tình huống & Kinh nghiệm' },
            ].map(t => (
              <div
                key={t.id}
                onClick={() => setInterviewType(t.id as any)}
                style={{
                  padding: 14, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  border: `1px solid ${interviewType === t.id ? 'var(--color-signal-blue)' : 'var(--color-mist)'}`,
                  background: interviewType === t.id ? 'rgba(65, 161, 207, 0.05)' : 'var(--color-paper)',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}
              >
                <p className="text-body" style={{ fontWeight: 500, fontSize: 14, color: interviewType === t.id ? 'var(--color-signal-blue)' : 'var(--color-graphite)' }}>
                  {t.label}
                </p>
                <p className="text-caption" style={{ color: 'var(--color-ash)', fontSize: 12 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          size="lg"
          loading={starting}
          disabled={jds.length === 0}
          onClick={handleStart}
          style={{ marginTop: 8 }}
        >
          {starting ? 'Đang khởi tạo...' : 'Bắt đầu phiên phỏng vấn'}
        </Button>
      </Card>
    </div>
  )
}
