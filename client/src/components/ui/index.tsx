import type { ReactNode, CSSProperties } from 'react'
import { clsx } from 'clsx'

// ===== Card =====
interface CardProps {
  children: ReactNode
  className?: string
  linen?: boolean
  style?: CSSProperties
  onClick?: () => void
}

export function Card({ children, className, linen, style, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        linen ? 'card-linen' : 'card',
        onClick && 'cursor-pointer',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ===== Badge =====
type BadgeVariant = 'blue' | 'success' | 'warning' | 'error' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  )
}

// ===== Spinner =====
interface SpinnerProps {
  size?: number
  color?: string
}

export function Spinner({ size = 18, color = 'var(--color-twilight)' }: SpinnerProps) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size, borderTopColor: color }}
      aria-label="Loading..."
    />
  )
}

// ===== Skeleton =====
interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = 16, className, style }: SkeletonProps) {
  return (
    <div
      className={clsx('skeleton', className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  )
}

// ===== Progress Bar =====
interface ProgressBarProps {
  value: number  // 0-100
  label?: string
  color?: string
  height?: number
  showValue?: boolean
}

export function ProgressBar({ value, label, color, height = 5, showValue }: ProgressBarProps) {
  const clampedVal = Math.max(0, Math.min(100, value))
  const barColor = color ?? (
    clampedVal >= 75 ? 'var(--color-success)' :
    clampedVal >= 50 ? 'var(--color-signal-blue)' :
    clampedVal >= 25 ? 'var(--color-warning)' :
    'var(--color-error)'
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && <span className="text-caption" style={{ color: 'var(--color-ash)', fontWeight: 500 }}>{label}</span>}
          {showValue && <span className="text-caption" style={{ color: barColor, fontWeight: 600 }}>{clampedVal}%</span>}
        </div>
      )}
      <div style={{
        height,
        borderRadius: 9999,
        background: 'var(--color-mist)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${clampedVal}%`,
          borderRadius: 9999,
          background: barColor,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

// ===== Score Circle =====
interface ScoreCircleProps {
  score: number   // 0-100
  size?: number
  label?: string
}

export function ScoreCircle({ score, size = 90, label }: ScoreCircleProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const strokeWidth = 4
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clampedScore / 100)

  const color = clampedScore >= 75 ? 'var(--color-success)' :
                clampedScore >= 50 ? 'var(--color-signal-blue)' :
                clampedScore >= 25 ? 'var(--color-warning)' :
                'var(--color-error)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--color-mist)" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="font-serif" style={{ fontSize: size * 0.28, color: 'var(--color-graphite)' }}>{clampedScore}</span>
          {size > 70 && <span className="text-caption" style={{ color: 'var(--color-ash)', marginTop: -4 }}>/100</span>}
        </div>
      </div>
      {label && <span className="text-caption" style={{ color: 'var(--color-charcoal)', fontWeight: 500 }}>{label}</span>}
    </div>
  )
}

// ===== Divider =====
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="divider" />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div className="divider" style={{ flex: 1, margin: 0 }} />
      <span className="text-caption" style={{ color: 'var(--color-ash)', whiteSpace: 'nowrap' }}>{label}</span>
      <div className="divider" style={{ flex: 1, margin: 0 }} />
    </div>
  )
}
