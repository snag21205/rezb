import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

// ===== Input =====
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label htmlFor={inputId} className="text-caption" style={{ color: 'var(--color-charcoal)', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-ash)', pointerEvents: 'none', fontSize: 14,
          }}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx('input', className)}
          style={{
            paddingLeft: leftIcon ? 36 : undefined,
            paddingRight: rightIcon ? 36 : undefined,
            borderColor: error ? 'var(--color-error)' : undefined,
          }}
          {...props}
        />
        {rightIcon && (
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-ash)',
          }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-caption" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}
      {hint && !error && (
        <p className="text-caption" style={{ color: 'var(--color-ash)' }}>{hint}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// ===== Textarea =====
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label htmlFor={inputId} className="text-caption" style={{ color: 'var(--color-charcoal)', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={clsx('input', className)}
        style={{
          resize: 'vertical',
          minHeight: 110,
          borderColor: error ? 'var(--color-error)' : undefined,
        }}
        {...props}
      />
      {error && (
        <p className="text-caption" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}
      {hint && !error && (
        <p className="text-caption" style={{ color: 'var(--color-ash)' }}>{hint}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'
