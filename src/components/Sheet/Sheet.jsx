import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Sheet.css'

/**
 * قاعدة النوافذ: bottom sheet على الموبايل، ونافذة/لوح جانبي على الشاشات الكبيرة.
 *
 * بتتكفّل بـ:
 *  - قفل تمرير الصفحة ورا النافذة
 *  - الإغلاق بـ Escape أو الضغط على الخلفية
 *  - حصر التركيز (Tab) جوه النافذة عشان الكيبورد والقارئ الصوتي
 *  - أنيميشن فتح وقفل بسيط
 *
 * variant: 'modal' (وسط الشاشة) | 'drawer' (لوح جانبي)
 */
export default function Sheet({
  open,
  onClose,
  title,
  variant = 'modal',
  labelledBy,
  children,
  footer,
}) {
  const panelRef = useRef(null)
  const lastFocused = useRef(null)
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  /* فتح / قفل مع وقت للأنيميشن */
  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement
      setMounted(true)
      setClosing(false)
      return
    }
    if (mounted) {
      setClosing(true)
      const timer = setTimeout(() => {
        setMounted(false)
        setClosing(false)
        if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus()
      }, 220)
      return () => clearTimeout(timer)
    }
  }, [open, mounted])

  /* قفل تمرير الصفحة */
  useEffect(() => {
    if (!mounted) return
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [mounted])

  /* التركيز الأولي */
  useEffect(() => {
    if (!open || !panelRef.current) return
    const focusable = panelRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const target = focusable || panelRef.current
    const timer = setTimeout(() => target.focus({ preventScroll: true }), 40)
    return () => clearTimeout(timer)
  }, [open])

  /* Escape + حصر التركيز */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const items = [
        ...panelRef.current.querySelectorAll(
          'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((el) => el.offsetParent !== null)

      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose]
  )

  if (!mounted) return null

  const state = closing ? 'is-closing' : 'is-open'

  return createPortal(
    <div className={`sheet sheet--${variant} ${state}`} onKeyDown={handleKeyDown}>
      <div className="sheet__backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="sheet__grab" aria-hidden="true" />

        <button type="button" className="sheet__close" onClick={onClose} aria-label="إغلاق">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="sheet__body">{children}</div>

        {footer ? <div className="sheet__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body
  )
}
