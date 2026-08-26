import logoEmblem from '../../assets/brand/logo-emblem.png'

/**
 * زخارف الهوية — عناصر صغيرة بتتكرر في الموقع.
 * كلها SVG بتاخد لونها من currentColor، يعني بتتلوّن لوحدها حسب المكان.
 */

/**
 * علامة المحل — الشعار الرسمي المتاخد من غلاف المنيو المطبوع.
 * (كان قبل كده رسمة SVG، دلوقتي بقى الشعار الحقيقي بتاع المطعم)
 */
export function BrandMark({ size = 40, className = '' }) {
  return (
    <img
      className={`brand-mark ${className}`}
      src={logoEmblem}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  )
}

/** فاصل زخرفي: خط — معيّن — خط. */
export function Divider({ className = '' }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: 'var(--border-strong)',
      }}
    >
      <span style={{ flex: 1, height: 1, background: 'currentColor' }} />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0l5 5-5 5-5-5 5-5Z" fill="currentColor" />
      </svg>
      <span style={{ flex: 1, height: 1, background: 'currentColor' }} />
    </div>
  )
}

/** شريط نقوش رفيع — بيتكرر أفقيًا. */
export function PatternStrip({ className = '', height = 14, opacity = 0.5 }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        height,
        opacity,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `${height * 2}px ${height}px`,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14'%3E%3Cpath d='M0 13 L7 1 L14 13 L21 1 L28 13' fill='none' stroke='%23c4892b' stroke-width='1.5'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

/** سهم صغير (بيستخدم في الروابط). */
export function ArrowIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11 3.5 4.5 8l6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** قلب المفضلة. */
export function HeartIcon({ filled = false, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden="true"
    >
      <path
        d="M10 16.5s-6.2-3.9-6.2-8A3.4 3.4 0 0 1 10 6.2a3.4 3.4 0 0 1 6.2 2.3c0 4.1-6.2 8-6.2 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
