import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, Divider } from '../components/ui/index'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!email) errs.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email không hợp lệ'
    if (!password) errs.password = 'Vui lòng nhập mật khẩu'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Đăng nhập thành công!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message ?? 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
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
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 32, maxWidth: 440 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 4,
            border: '1px solid var(--color-twilight)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'var(--color-twilight)',
          }}>❖</div>
          <span className="font-serif" style={{ fontSize: 24, color: 'var(--color-graphite)', marginRight: 4 }}>rezb</span>
          <span className="text-caption" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-ash)' }}>
            • General Intelligence Co.
          </span>
        </div>

        <h1 className="text-heading" style={{ marginBottom: 12 }}>
          Phân tích CV & Chinh phục Phỏng vấn.
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14 }}>
          Nền tảng trí tuệ nhân tạo hỗ trợ hoàn thiện CV và rèn luyện kỹ năng phỏng vấn theo mô hình chuẩn.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Card style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-graphite)', marginBottom: 6 }}>
            Đăng nhập tài khoản
          </h2>
          <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 24 }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: 'var(--color-signal-blue)', textDecoration: 'none', fontWeight: 500 }}>
              Đăng ký ngay
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="login-email"
              label="Địa chỉ Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              placeholder="name@company.com"
              autoComplete="email"
            />

            <Input
              id="login-password"
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
              <Link to="/forgot-password" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              id="login-submit"
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Tiếp tục với Email
            </Button>
          </form>

          <Divider label="Hỗ trợ" />

          <p className="text-caption" style={{ textAlign: 'center', color: 'var(--color-ash)' }}>
            Bằng việc đăng nhập, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
