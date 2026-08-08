import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Card, ScoreCircle, Badge, Spinner } from '../components/ui/index'
import Button from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { getUserResumes, createJD, matchCVWithJD } from '../services/api'

export default function JDMatchingPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [jdTitle, setJdTitle] = useState('')
  const [jdCompany, setJdCompany] = useState('')
  const [jdText, setJdText] = useState('')

  const [loadingResumes, setLoadingResumes] = useState(true)
  const [matching, setMatching] = useState(false)
  const [matchResult, setMatchResult] = useState<any>(null)

  useEffect(() => {
    getUserResumes()
      .then(data => {
        setResumes(data)
        if (data.length > 0 && data[0]) setSelectedResumeId(data[0].id)
      })
      .catch(console.error)
      .finally(() => setLoadingResumes(false))
  }, [])

  const handleMatch = async () => {
    if (!selectedResumeId) return toast.error('Vui lòng chọn CV trước khi so khớp')
    if (!jdTitle || !jdText) return toast.error('Vui lòng nhập Tiêu đề và Nội dung JD')

    setMatching(true)
    setMatchResult(null)

    try {
      const jd = await createJD({ title: jdTitle, company: jdCompany, rawText: jdText })
      const result = await matchCVWithJD(selectedResumeId, jd.id)
      setMatchResult(result)
      toast.success('So khớp hoàn tất!')
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi so khớp')
    } finally {
      setMatching(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ fontSize: 36, marginBottom: 8 }}>
          So khớp CV & JD
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)' }}>
          Đánh giá độ tương thích giữa kinh nghiệm trong CV với Yêu cầu tuyển dụng.
        </p>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Step 1: Select CV */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 className="text-heading-sm" style={{ fontSize: 20 }}>1. Chọn CV của bạn</h2>
          {loadingResumes ? (
            <Spinner />
          ) : resumes.length === 0 ? (
            <div className="card-linen" style={{ padding: 20, textAlign: 'center', color: 'var(--color-ash)' }}>
              Chưa có CV nào trong hệ thống. Hãy sang trang <strong>Phân tích CV</strong> để tải lên!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {resumes.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedResumeId(r.id)}
                  style={{
                    padding: 12, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    border: `1px solid ${selectedResumeId === r.id ? 'var(--color-twilight)' : 'var(--color-mist)'}`,
                    background: selectedResumeId === r.id ? 'var(--color-linen)' : 'var(--color-paper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p className="text-body" style={{ fontWeight: 500, fontSize: 14 }}>{r.file_name}</p>
                    <p className="text-caption" style={{ color: 'var(--color-ash)' }}>
                      {new Date(r.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {selectedResumeId === r.id && <span style={{ color: 'var(--color-signal-blue)', fontWeight: 600 }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Step 2: JD Details */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 className="text-heading-sm" style={{ fontSize: 20 }}>2. Thông tin JD</h2>
          <Input
            label="Chức danh tuyển dụng"
            placeholder="vd: Frontend Engineer"
            value={jdTitle}
            onChange={e => setJdTitle(e.target.value)}
          />
          <Input
            label="Tên công ty (không bắt buộc)"
            placeholder="vd: Acme Corp"
            value={jdCompany}
            onChange={e => setJdCompany(e.target.value)}
          />
          <Textarea
            label="Nội dung Job Description"
            placeholder="Dán toàn bộ yêu cầu công việc vào đây..."
            rows={5}
            value={jdText}
            onChange={e => setJdText(e.target.value)}
          />
          <Button
            variant="primary"
            size="lg"
            loading={matching}
            onClick={handleMatch}
            style={{ marginTop: 4 }}
          >
            {matching ? 'Đang so khớp...' : 'Tiến hành So Khớp'}
          </Button>
        </Card>
      </div>

      {/* Results */}
      <AnimatePresence>
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            <Card style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 28 }}>
              <ScoreCircle score={matchResult.match_score ?? 0} size={100} label="Tỉ lệ phù hợp" />
              <div>
                <h3 className="text-heading-sm" style={{ fontSize: 22, marginBottom: 6 }}>
                  Đánh giá tương thích
                </h3>
                <p className="text-body" style={{ color: 'var(--color-charcoal)', fontSize: 15 }}>
                  {matchResult.summary || 'CV của bạn đạt mức độ so khớp cơ bản với yêu cầu tuyển dụng.'}
                </p>
              </div>
            </Card>

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 18, color: 'var(--color-success)', marginBottom: 12 }}>
                  Kỹ năng đã đáp ứng ({matchResult.matched_skills?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(matchResult.matched_skills || []).map((sk: string, i: number) => (
                    <Badge key={i} variant="success">{sk}</Badge>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 18, color: 'var(--color-error)', marginBottom: 12 }}>
                  Kỹ năng còn thiếu ({matchResult.missing_skills?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(matchResult.missing_skills || []).map((sk: string, i: number) => (
                    <Badge key={i} variant="error">{sk}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Rewrite Suggestions */}
            {matchResult.rewrite_suggestions?.length > 0 && (
              <Card>
                <h3 className="text-heading-sm" style={{ fontSize: 20, marginBottom: 16 }}>
                  Gợi ý điều chỉnh CV bám sát JD hơn
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {matchResult.rewrite_suggestions.map((item: any, i: number) => (
                    <div key={i} className="card-linen" style={{ padding: 14 }}>
                      <p className="text-caption" style={{ fontWeight: 600, color: 'var(--color-twilight)', marginBottom: 2 }}>
                        PHẦN: {item.section?.toUpperCase()}
                      </p>
                      <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 13, marginBottom: 2 }}>
                        Gốc: "{item.original}"
                      </p>
                      <p className="text-body" style={{ color: 'var(--color-graphite)', fontWeight: 500, fontSize: 14 }}>
                        Nên sửa: "{item.improved}"
                      </p>
                      {item.reason && <p className="text-caption" style={{ color: 'var(--color-signal-blue)', marginTop: 2 }}>Lý do: {item.reason}</p>}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
