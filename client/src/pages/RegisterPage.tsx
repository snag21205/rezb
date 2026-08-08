import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, Divider } from '../components/ui/index'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs: Partial<typeof form> = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    if (!form.email) errs.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ'
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu'
    else if (form.password.length < 8) errs.password = 'Mật khẩu tối thiểu 8 ký tự'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await signUp(form.email, form.password, form.fullName)
      if (res.needsConfirmation) {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.')
        navigate(`/verify-email-sent?email=${encodeURIComponent(form.email)}`)
      } else {
        toast.success('Đăng ký thành công!')
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Đăng ký thất bại')
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
          Tạo tài khoản thành viên.
        </h1>
        <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14 }}>
          Khám phá bộ công cụ AI tối ưu hóa CV và bài tập phỏng vấn dành cho ứng viên chuyên nghiệp.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <Card style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-graphite)', marginBottom: 6 }}>
            Đăng ký tài khoản
          </h2>
          <p className="text-caption" style={{ color: 'var(--color-ash)', marginBottom: 24 }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--color-signal-blue)', textDecoration: 'none', fontWeight: 500 }}>
              Đăng nhập ngay
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="register-name"
              label="Họ và tên"
              type="text"
              value={form.fullName}
              onChange={set('fullName')}
              error={errors.fullName}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
            />

            <Input
              id="register-email"
              label="Địa chỉ Email"
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              placeholder="name@company.com"
              autoComplete="email"
            />

            <Input
              id="register-password"
              label="Mật khẩu"
              type="password"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              hint="Tối thiểu 8 ký tự"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <Input
              id="register-confirm-password"
              label="Xác nhận mật khẩu"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <Button
              id="register-submit"
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Tạo tài khoản mới
            </Button>
          </form>

          <Divider />

          <p className="text-caption" style={{ textAlign: 'center', color: 'var(--color-ash)' }}>
            Bằng việc đăng ký, bạn đồng ý tuân thủ các quy định sử dụng dịch vụ của hệ thống.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
