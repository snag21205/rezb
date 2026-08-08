import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { Card, Spinner } from '../components/ui/index'
import Button from '../components/ui/Button'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Process Supabase Auth Hash or Code parameters
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setStatus('error')
        setErrorMsg(error.message)
        return
      }

      if (data.session) {
        setStatus('success')
        toast.success('Xác thực email thành công! Đang chuyển hướng...')
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2000)
      } else {
        // Fallback: check if hash or URL code exists
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          setStatus('success')
          toast.success('Xác thực email thành công!')
          setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
        } else {
          setStatus('error')
          setErrorMsg('Liên kết xác thực không hợp lệ hoặc đã hết hạn.')
        }
      }
    })
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-parchment)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}
      >
        <Card style={{ padding: 40 }}>
          {status === 'verifying' && (
            <div>
              <Spinner size={36} color="var(--color-signal-blue)" />
              <h2 className="font-serif" style={{ fontSize: 24, color: 'var(--color-graphite)', marginTop: 20, marginBottom: 8 }}>
                Đang xác thực Email...
              </h2>
              <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14 }}>
                Vui lòng đợi trong giây lát để hệ thống kích hoạt tài khoản rezb của bạn.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, margin: '0 auto 16px', border: '1px solid rgba(46, 125, 50, 0.3)',
              }}>
                ✓
              </div>
              <h2 className="font-serif" style={{ fontSize: 26, color: 'var(--color-graphite)', marginBottom: 8 }}>
                Xác thực thành công!
              </h2>
              <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14, marginBottom: 24 }}>
                Tài khoản rezb của bạn đã được xác nhận. Đang chuyển tới trang quản lý...
              </p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Truy cập Dashboard ngay
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(197, 48, 48, 0.1)', color: 'var(--color-error)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, margin: '0 auto 16px', border: '1px solid rgba(197, 48, 48, 0.3)',
              }}>
                ✕
              </div>
              <h2 className="font-serif" style={{ fontSize: 24, color: 'var(--color-graphite)', marginBottom: 8 }}>
                Xác thực không thành công
              </h2>
              <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 14, marginBottom: 24 }}>
                {errorMsg || 'Liên kết kích hoạt đã hết hạn hoặc không khả dụng.'}
              </p>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Quay lại Đăng nhập
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
