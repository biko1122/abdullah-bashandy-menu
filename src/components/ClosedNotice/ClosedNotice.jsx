import { useEffect, useState } from 'react'
import { cairoClock, hoursUntilOpen, isOrderingOpen, OPENS_AT } from '../../utils/hours'
import './ClosedNotice.css'

/**
 * بيقول للموقع إحنا بنستقبل طلبات دلوقتي ولا لأ.
 *
 * بيعيد الحساب كل نص دقيقة عشان لو الزبون سايب الصفحة مفتوحة
 * الساعة ٥:٥٩ والدنيا بقت ٦، الزرار يفتح لوحده من غير ما يعمل refresh.
 */
export function useOrderingOpen() {
  const [open, setOpen] = useState(() => isOrderingOpen())

  useEffect(() => {
    const tick = () => setOpen(isOrderingOpen())
    const timer = setInterval(tick, 30000)
    /* أول ما يرجع للصفحة نحسب تاني — التابات النايمة بتوقّف المؤقتات */
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  return open
}

/**
 * لافتة "قافلين دلوقتي".
 * مبتظهرش خالص في مواعيد الشغل — فينفع تحطها في أي صفحة من غير قلق.
 */
export default function ClosedNotice({ compact = false }) {
  const open = useOrderingOpen()
  if (open) return null

  const remaining = hoursUntilOpen()

  return (
    <div className={`closed ${compact ? 'closed--compact' : ''}`} role="status">
      <span className="closed__icon" aria-hidden="true">
        🌙
      </span>
      <div className="closed__text">
        <p className="closed__title">
          قافلين دلوقتي — الساعة <span className="num">{cairoClock()}</span>
        </p>
        <p className="closed__sub">
          بنستقبل الطلبات من <span className="num">{OPENS_AT}</span> الصبح لحد{' '}
          <span className="num">1</span> بعد نص الليل.
          {remaining > 0 ? (
            <>
              {' '}
              فاضل <span className="num">{remaining}</span>{' '}
              {remaining === 1 ? 'ساعة' : 'ساعات'} على الفتح.
            </>
          ) : (
            ' هنفتح خلال شوية.'
          )}
        </p>
      </div>
    </div>
  )
}
