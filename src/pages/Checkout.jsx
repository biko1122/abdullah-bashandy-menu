import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowIcon } from '../components/Ornaments/Ornaments'
import { useSelection } from '../context/SelectionContext'
import { formatPrice } from '../utils/currency'
import { MIN_ORDER_TOTAL, calculateTotals } from '../data/ordering'
import { createOrder, ApiError } from '../utils/api'
import './Checkout.css'

/**
 * صفحة تأكيد الطلب — **ديليفري بس** (قرار المطعم: مفيش استلام من الفرع).
 * خطوتين: بياناتك ← راجع واطلب. رسوم التوصيل بيحددها المطعم في المكالمة.
 */

/* ----------------------------- التحقق ----------------------------- */

/** الموبايل المصري: 11 رقم بيبدأ بـ 010/011/012/015 */
const PHONE_PATTERN = /^01[0125]\d{8}$/

const validate = ({ name, phone, address }) => {
  const errors = {}

  if (!name.trim()) errors.name = 'اكتب اسمك'
  else if (name.trim().length < 2) errors.name = 'الاسم قصير أوي'

  const digits = phone.replace(/\D/g, '')
  if (!digits) errors.phone = 'اكتب رقم تليفونك'
  else if (!PHONE_PATTERN.test(digits))
    errors.phone = 'الرقم لازم يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015'

  if (!address.trim()) errors.address = 'اكتب عنوانك عشان نعرف نوصّلك'
  else if (address.trim().length < 10)
    errors.address = 'اكتب العنوان بالتفصيل (الشارع والعمارة والدور)'

  return errors
}

/* ================================================================== */

export default function Checkout() {
  const { lines, total: subtotal, isEmpty, clearSelection } = useSelection()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [placed, setPlaced] = useState(null)

  const totals = useMemo(() => calculateTotals(subtotal, 'DELIVERY'), [subtotal])
  const belowMinimum = MIN_ORDER_TOTAL > 0 && subtotal < MIN_ORDER_TOTAL

  /* ------------------------- الإرسال ------------------------- */

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError(null)

    const found = validate({ name, phone, address })
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.querySelector(`[data-field="${Object.keys(found)[0]}"]`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      /* بنبعت الأكواد والكميات بس — السيرفر بيحسب من قاعدة البيانات */
      const order = await createOrder({
        type: 'DELIVERY',
        customer: {
          name: name.trim(),
          phone: phone.replace(/\D/g, ''),
          address: address.trim(),
        },
        note: note.trim() || null,
        items: lines.map((line) => ({
          sku: line.itemId,
          quantity: line.quantity,
          choices: line.choiceIds ?? {},
        })),
      })

      setPlaced(order)
      clearSelection()
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error : new ApiError('حصل خطأ مش متوقع. جرّب تاني.')
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* ==================== شاشة التأكيد بعد الطلب ==================== */

  if (placed) {
    return (
      <div className="checkout-done">
        <div className="shell checkout-done__inner">
          <div className="checkout-done__mark" aria-hidden="true">
            <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
              <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path
                d="M15 26.5 22.5 34 37 19"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="checkout-done__title">طلبك وصلنا</h1>

          <p className="checkout-done__number">
            رقم الطلب <span className="num">#{placed.orderNumber}</span>
          </p>

          <p className="checkout-done__text">
            هنكلّمك على <span className="num">{phone}</span> نأكّد الطلب، وبعدها نجهّزه
            ونبعته لحد عندك.
          </p>

          <p className="checkout-done__total">
            الإجمالي <span className="num">{formatPrice(placed.total)}</span>
            {!placed.deliveryFee ? (
              <span className="checkout-done__fee-note">+ رسوم التوصيل بيأكدها معاك المطعم</span>
            ) : null}
          </p>

          <div className="checkout-done__actions">
            <Link to="/menu" className="btn">
              اطلب تاني
              <ArrowIcon />
            </Link>
            <Link to="/" className="btn btn--ghost">
              الرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ==================== الاختيارات فاضية ==================== */

  if (isEmpty) {
    return (
      <div className="checkout">
        <div className="shell">
          <div className="empty-state">
            <h1 className="empty-state__title">مفيش حاجة في طلبك لسه</h1>
            <p className="empty-state__text">افتح المنيو واختار اللي نفسك فيه.</p>
            <Link to="/menu" className="btn">
              شوف المنيو
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ==================== صفحة الطلب ==================== */

  return (
    <div className="checkout">
      <div className="shell checkout__inner">
        <header className="checkout__head">
          <button type="button" className="checkout__back" onClick={() => navigate(-1)}>
            <span aria-hidden="true">→</span> رجوع
          </button>
          <h1 className="checkout__title">تأكيد الطلب</h1>
          <span className="checkout__type-badge">🛵 توصيل</span>
        </header>

        <form className="checkout__form" onSubmit={handleSubmit} noValidate>
          {/* ------------------ 1. بياناتك ------------------ */}
          <section className="cbox">
            <h2 className="cbox__title">
              <span className="cbox__step num">1</span>
              بياناتك
            </h2>

            <div className="cfield">
              <label htmlFor="name">الاسم</label>
              <input
                id="name"
                data-field="name"
                type="text"
                value={name}
                autoComplete="name"
                placeholder="اسمك كامل"
                aria-invalid={Boolean(errors.name)}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors((x) => ({ ...x, name: undefined }))
                }}
              />
              {errors.name ? <p className="cerr">{errors.name}</p> : null}
            </div>

            <div className="cfield">
              <label htmlFor="phone">رقم التليفون</label>
              <input
                id="phone"
                data-field="phone"
                type="tel"
                inputMode="numeric"
                dir="ltr"
                value={phone}
                autoComplete="tel"
                placeholder="01xxxxxxxxx"
                aria-invalid={Boolean(errors.phone)}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setErrors((x) => ({ ...x, phone: undefined }))
                }}
              />
              {errors.phone ? (
                <p className="cerr">{errors.phone}</p>
              ) : (
                <p className="chint">هنكلّمك عليه نأكّد الطلب</p>
              )}
            </div>

            <div className="cfield">
              <label htmlFor="address">عنوان التوصيل</label>
              <textarea
                id="address"
                data-field="address"
                rows={3}
                value={address}
                autoComplete="street-address"
                placeholder="الشارع، رقم العمارة، الدور، الشقة، وأي علامة مميزة"
                aria-invalid={Boolean(errors.address)}
                onChange={(e) => {
                  setAddress(e.target.value)
                  setErrors((x) => ({ ...x, address: undefined }))
                }}
              />
              {errors.address ? <p className="cerr">{errors.address}</p> : null}
            </div>

            <div className="cfield">
              <label htmlFor="note">
                ملاحظات <span className="cfield__optional">اختياري</span>
              </label>
              <textarea
                id="note"
                rows={2}
                value={note}
                maxLength={300}
                placeholder="مثلاً: من غير شطة، أو العيش سخن"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </section>

          {/* ------------------ 2. المراجعة ------------------ */}
          <section className="cbox">
            <h2 className="cbox__title">
              <span className="cbox__step num">2</span>
              راجع طلبك
            </h2>

            <ul className="creview">
              {lines.map((line) => (
                <li className="creview__line" key={line.key}>
                  <div className="creview__info">
                    <p className="creview__name">{line.item.name}</p>
                    {line.choiceSummary ? (
                      <p className="creview__choices">{line.choiceSummary}</p>
                    ) : null}
                    <p className="creview__unit num">
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>

                  <p className="creview__total num">{formatPrice(line.lineTotal)}</p>
                </li>
              ))}
            </ul>

            <dl className="csum">
              <div>
                <dt>حساب الأصناف</dt>
                <dd className="num">{formatPrice(totals.subtotal)}</dd>
              </div>

              <div>
                <dt>التوصيل</dt>
                <dd className={totals.deliveryFee > 0 ? 'num' : 'csum__policy'}>
                  {totals.deliveryFee > 0 ? formatPrice(totals.deliveryFee) : 'بيحددها المطعم'}
                </dd>
              </div>

              <div className="csum__total">
                <dt>الإجمالي</dt>
                <dd className="num">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            {totals.deliveryFee === 0 ? (
              <p className="chint">
                الإجمالي ده حساب الأكل بس — رسوم التوصيل بيأكدها معاك المطعم في المكالمة.
              </p>
            ) : null}

            {belowMinimum ? (
              <p className="cerr">
                أقل طلب هو {formatPrice(MIN_ORDER_TOTAL)} — زوّد شوية عشان نقدر نبعتلك.
              </p>
            ) : null}
          </section>

          {/* ------------------ الأخطاء والإرسال ------------------ */}

          {serverError ? (
            <div className="calert" role="alert">
              <p className="calert__title">الطلب ماتبعتش</p>
              <p className="calert__text">{serverError.message}</p>
              {serverError.details?.length ? (
                <ul className="calert__list">
                  {serverError.details.map((detail, index) => (
                    <li key={index}>{detail.message}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            className="btn checkout__submit"
            disabled={submitting || belowMinimum}
          >
            {submitting ? 'بنبعت الطلب…' : 'اطلب دلوقتي'}
            {!submitting ? (
              <span className="checkout__submit-total num">{formatPrice(totals.total)}</span>
            ) : null}
          </button>

          <p className="checkout__note">
            الدفع كاش عند الاستلام. هنكلّمك نأكّد الطلب قبل ما نجهّزه.
          </p>
        </form>
      </div>
    </div>
  )
}
