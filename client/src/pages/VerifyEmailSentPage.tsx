import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/index'
import Button from '../components/ui/Button'

export default function VerifyEmailSentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { resendVerificationEmail } = useAuth()
  const email = searchParams.get('email') || ''

  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const handleResend = async () => {
    if (!email) {
      toast.error('Không tìm thấy địa chỉ email')
      return
    }

    setResending(true)
    try {
      await resendVerificationEmail(email)
      toast.success(`Đã gửi lại email xác nhận tới ${email}!`)
      setCooldown(60)
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || 'Không thể gửi lại email xác minh')
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-parchment)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}
      >
        <Card style={{ padding: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(65, 161, 207, 0.08)', color: 'var(--color-signal-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 20px', border: '1px solid rgba(65, 161, 207, 0.25)',
          }}>
            ✉
          </div>

          <h1 className="text-heading" style={{ fontSize: 26, marginBottom: 12 }}>
            Kiểm tra Hộp thư xác nhận
          </h1>

          <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Hệ thống đã gửi một liên kết xác thực tới email:{' '}
            <strong style={{ color: 'var(--color-graphite)' }}>{email || 'của bạn'}</strong>.
            <br />
            Vui lòng mở hộp thư (kiểm tra cả thư mục Spam/Quảng cáo) và nhấp vào liên kết để hoàn tất kích hoạt tài khoản <strong className="font-serif">rezb</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Button
              variant="primary"
              size="lg"
              loading={resending}
              disabled={cooldown > 0}
              onClick={handleResend}
            >
              {cooldown > 0 ? `Gửi lại email sau (${cooldown}s)` : 'Gửi lại Email xác nhận'}
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
            >
              Đã xác nhận? Đăng nhập ngay
            </Button>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-mist)' }}>
            <p className="text-caption" style={{ color: 'var(--color-ash)' }}>
              Nhập sai địa chỉ email?{' '}
              <Link to="/register" style={{ color: 'var(--color-signal-blue)', textDecoration: 'none', fontWeight: 500 }}>
                Đăng ký lại
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
