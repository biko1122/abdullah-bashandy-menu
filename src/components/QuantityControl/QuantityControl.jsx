import { formatNumber } from '../../utils/currency'
import './QuantityControl.css'

/**
 * زرار الكمية: −  1  +
 * بيستخدم في نافذة الصنف وفي قائمة الاختيارات.
 */
export default function QuantityControl({
  value,
  onIncrease,
  onDecrease,
  label = 'الكمية',
  size = 'md',
  minusLabel = 'قلّل واحد',
  plusLabel = 'زوّد واحد',
  disabledMinus = false,
}) {
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={onDecrease}
        disabled={disabledMinus}
        aria-label={minusLabel}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <span className="qty__value num" aria-live="polite">
        {formatNumber(value)}
      </span>

      <button type="button" className="qty__btn" onClick={onIncrease} aria-label={plusLabel}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
