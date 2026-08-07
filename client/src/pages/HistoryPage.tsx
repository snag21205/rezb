import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Badge, Spinner } from '../components/ui/index'
import Button from '../components/ui/Button'
import { getInterviewHistory } from '../services/api'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInterviewHistory()
      .then(data => setSessions(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-display" style={{ fontSize: 36, marginBottom: 8 }}>
          Lịch sử Phỏng vấn
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)' }}>
          Danh sách lưu trữ tất cả các phiên thực hành phỏng vấn trước đây của bạn.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spinner size={32} color="var(--color-twilight)" />
        </div>
      ) : sessions.length === 0 ? (
        <Card style={{ padding: 48, textAlign: 'center' }}>
          <p className="text-body" style={{ color: 'var(--color-ash)', marginBottom: 16 }}>
            Bạn chưa có dữ liệu phiên phỏng vấn nào.
          </p>
          <Button variant="primary" onClick={() => navigate('/interview')}>
            Tạo buổi phỏng vấn đầu tiên
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.map(s => (
            <Card
              key={s.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onClick={() => navigate(`/interview/${s.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: 18, color: 'var(--color-graphite)', marginBottom: 4 }}>
                    {s.job_descriptions?.title || 'Phỏng vấn thử'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge variant={s.status === 'completed' ? 'success' : 'warning'}>
                      {s.status === 'completed' ? 'Hoàn thành' : 'Đang thực hiện'}
                    </Badge>
                    <span className="text-caption" style={{ color: 'var(--color-ash)' }}>
                      Loại: {s.type}
                    </span>
                    <span className="text-caption" style={{ color: 'var(--color-ash)' }}>
                      • {new Date(s.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {s.total_score !== null && (
                  <div style={{ textAlign: 'right' }}>
                    <p className="text-caption" style={{ color: 'var(--color-ash)' }}>Điểm tổng kết</p>
                    <p className="font-serif" style={{ fontSize: 20, color: 'var(--color-success)' }}>
                      {s.total_score}<span className="text-caption" style={{ fontSize: 12 }}>/100</span>
                    </p>
                  </div>
                )}
                <span style={{ fontSize: 16, color: 'var(--color-twilight)' }}>→</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
