import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'

const navItems = [
  { to: '/dashboard', label: 'Tổng quan', end: true },
  { to: '/cv-analysis', label: 'Phân tích CV' },
  { to: '/jd-matching', label: 'So khớp JD' },
  { to: '/interview', label: 'Mock Interview' },
  { to: '/history', label: 'Lịch sử' },
]

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Đã đăng xuất')
    navigate('/login')
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-parchment)', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(254, 255, 252, 0.88)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid var(--color-mist)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Rebrand Brand Logo: rezb */}
          <NavLink to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: 'var(--color-twilight)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--color-parchment)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}>❖</div>
            <span className="font-serif" style={{ fontSize: 22, fontWeight: 400, color: 'var(--color-graphite)', letterSpacing: '-0.03em' }}>
              rezb
            </span>
            <span className="badge badge-blue" style={{ fontSize: 10, padding: '1px 6px', marginLeft: 2 }}>
              v2.4
            </span>
          </NavLink>

          {/* Apple-style Liquid Glass Pill Navigation */}
          <nav style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--color-linen)',
            padding: 4,
            borderRadius: 50,
            border: '1px solid var(--color-mist)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
          }}>
            {navItems.map(item => {
              const isActive = item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={{
                    position: 'relative',
                    padding: '6px 16px',
                    borderRadius: 50,
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    color: isActive ? 'var(--color-ink-black)' : 'var(--color-ash)',
                    transition: 'color 0.2s ease',
                    zIndex: 1,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="liquid-glass-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                        mass: 0.8,
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 50,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(16px) saturate(180%)',
                        border: '1px solid rgba(40, 40, 52, 0.12)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07), inset 0 1px 1px rgba(255, 255, 255, 1)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          {/* User Profile & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span className="text-caption" style={{ fontWeight: 600, color: 'var(--color-graphite)' }}>
                {displayName}
              </span>
              <span className="text-caption" style={{ color: 'var(--color-ash)', fontSize: 11 }}>
                {user?.email}
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Animated Page Transition */}
      <main style={{ flex: 1, padding: '36px 24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.995 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Literary Colophon Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-mist)',
        background: 'var(--color-paper)',
        padding: '48px 24px 32px',
        marginTop: 64,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 5,
                background: 'var(--color-twilight)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#fff',
              }}>❖</div>
              <span className="font-serif" style={{ fontSize: 20, color: 'var(--color-graphite)' }}>
                rezb
              </span>
            </div>
            <p className="text-body" style={{ color: 'var(--color-ash)', fontSize: 13, maxWidth: 320, lineHeight: 1.6, marginBottom: 16 }}>
              Nền tảng trí tuệ nhân tạo phân tích CV, so khớp JD & giả lập phỏng vấn chuyên sâu theo chuẩn General Intelligence.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 50, background: 'var(--color-linen)', border: '1px solid var(--color-mist)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
              <span className="text-caption" style={{ fontSize: 11, color: 'var(--color-charcoal)', fontWeight: 500 }}>Gemini 1.5 Flash • Systems Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-caption" style={{ fontWeight: 600, color: 'var(--color-graphite)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Tính năng
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <NavLink to="/cv-analysis" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Phân tích CV ATS</NavLink>
              <NavLink to="/jd-matching" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>So khớp Yêu cầu JD</NavLink>
              <NavLink to="/interview" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Mock Interview STAR</NavLink>
              <NavLink to="/history" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Lịch sử đánh giá</NavLink>
            </div>
          </div>

          {/* Technology & Architecture */}
          <div>
            <p className="text-caption" style={{ fontWeight: 600, color: 'var(--color-graphite)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Công nghệ
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="text-caption" style={{ color: 'var(--color-ash)' }}>Google Gemini AI</span>
              <span className="text-caption" style={{ color: 'var(--color-ash)' }}>Supabase Auth & PostgreSQL</span>
              <span className="text-caption" style={{ color: 'var(--color-ash)' }}>Express TypeScript Server</span>
              <span className="text-caption" style={{ color: 'var(--color-ash)' }}>React & Framer Motion</span>
            </div>
          </div>

          {/* Legal & System Colophon */}
          <div>
            <p className="text-caption" style={{ fontWeight: 600, color: 'var(--color-graphite)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
              Thông tin
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Điều khoản dịch vụ</a>
              <a href="#" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Chính sách bảo mật</a>
              <a href="#" className="text-caption" style={{ color: 'var(--color-ash)', textDecoration: 'none' }}>Tài liệu API Docs</a>
              <span className="text-caption" style={{ color: 'var(--color-fog)', fontSize: 11 }}>Build 2026.08-rev4</span>
            </div>
          </div>
        </div>

        {/* Colophon Bottom Bar */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: 24,
          borderTop: '1px solid var(--color-mist)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p className="font-serif" style={{ fontSize: 14, color: 'var(--color-ash)', fontStyle: 'italic' }}>
            "Literary journal beside a bonfire — An editorial intelligence platform."
          </p>
          <p className="text-caption" style={{ color: 'var(--color-ash)', fontSize: 12 }}>
            © 2026 <strong style={{ color: 'var(--color-graphite)' }}>rezb</strong> by General Intelligence Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
