import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, ScoreCircle, Skeleton } from '../components/ui/index'
import Button from '../components/ui/Button'
import { getDashboardStats } from '../services/api'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="text-display" style={{ fontSize: 36, marginBottom: 8 }}>
          Tổng quan hồ sơ
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)' }}>
          Theo dõi chất lượng CV và quá trình chuẩn bị phỏng vấn của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 16,
        marginBottom: 40,
      }}>
        <Card>
          <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Lần phân tích CV
          </p>
          {loading ? (
            <Skeleton width={60} height={36} />
          ) : (
            <span className="font-serif" style={{ fontSize: 36, color: 'var(--color-graphite)' }}>
              {stats?.totalAnalyses ?? 0}
            </span>
          )}
        </Card>

        <Card>
          <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Phiên phỏng vấn
          </p>
          {loading ? (
            <Skeleton width={60} height={36} />
          ) : (
            <span className="font-serif" style={{ fontSize: 36, color: 'var(--color-graphite)' }}>
              {stats?.interviewSessions ?? 0}
            </span>
          )}
        </Card>

        <Card>
          <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Điểm TB Phỏng vấn
          </p>
          {loading ? (
            <Skeleton width={60} height={36} />
          ) : (
            <span className="font-serif" style={{ fontSize: 36, color: 'var(--color-success)' }}>
              {stats?.averageInterviewScore ?? 0}<span className="text-caption" style={{ color: 'var(--color-ash)', fontSize: 14 }}>/100</span>
            </span>
          )}
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div>
            <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ATS Score gần nhất
            </p>
            <span className="text-caption" style={{ color: 'var(--color-charcoal)' }}>
              {stats?.latestATSScore ? 'Đã chấm điểm' : 'Chưa có dữ liệu'}
            </span>
          </div>
          {loading ? (
            <Skeleton width={50} height={50} style={{ borderRadius: '50%' }} />
          ) : (
            <ScoreCircle score={stats?.latestATSScore ?? 0} size={56} />
          )}
        </Card>
      </div>

      {/* Primary Feature Sections */}
      <h2 className="text-heading-sm" style={{ marginBottom: 24 }}>
        Công cụ chính
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
      }}>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 28 }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: 12 }}>CV Analysis</span>
              <h3 className="text-heading-sm" style={{ fontSize: 22, marginBottom: 8 }}>Phân tích CV bằng AI</h3>
              <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14, marginBottom: 24 }}>
                Rà soát từ khóa ATS, phát hiện lỗi cấu trúc và nhận gợi ý viết lại từng phần cho CV của bạn.
              </p>
            </div>
            <Link to="/cv-analysis" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ width: '100%' }}>Tải CV lên phân tích</Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 28 }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: 12 }}>JD Matching</span>
              <h3 className="text-heading-sm" style={{ fontSize: 22, marginBottom: 8 }}>So khớp CV & JD</h3>
              <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14, marginBottom: 24 }}>
                So sánh mức độ tương thích giữa CV của bạn với Mô tả công việc (JD) để tìm ra các skill còn thiếu.
              </p>
            </div>
            <Link to="/jd-matching" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" style={{ width: '100%' }}>So khớp với JD</Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 28 }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: 12 }}>Mock Interview</span>
              <h3 className="text-heading-sm" style={{ fontSize: 22, marginBottom: 8 }}>Luyện tập Phỏng vấn</h3>
              <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14, marginBottom: 24 }}>
                Phỏng vấn thử với AI Interviewer theo mô hình STAR, chấm điểm chi tiết từng câu trả lời.
              </p>
            </div>
            <Link to="/interview" style={{ textDecoration: 'none' }}>
              <Button variant="dark" style={{ width: '100%' }}>Thực hành phỏng vấn</Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
