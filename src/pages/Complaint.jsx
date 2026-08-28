import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createComplaint, ApiError } from '../utils/api'
import { restaurant } from '../data/restaurant'
import './Complaint.css'

/**
 * صفحة تقديم شكوى.
 *
 * الفكرة إن الزبون يقول اللي مضايقه من غير ما يعمل حساب ولا يستنى حد
 * يرد على التليفون. الشكوى بتروح للسيرفر على طول، ومدير المحل بس هو
 * اللي بيشوفها من التابلت.
 *
 * التحقق بيتعمل مرتين — هنا عشان الرد يبقى فوري، وفي السيرفر عشان
 * ده اللي بيحمي فعلًا. اللي هنا مجرد راحة للمستخدم.
 */

const PHONE_RE = /^01[0125]\d{8}$/
const MIN_MESSAGE = 10
const MAX_MESSAGE = 1500

export default function Complaint() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [ticket, setTicket] = useState(null)

  const clearError = (field) => setErrors((x) => ({ ...x, [field]: undefined }))

  const validate = () => {
    const found = {}

    if (!name.trim()) found.name = 'اكتب اسمك'
    else if (name.trim().length > 80) found.name = 'الاسم طويل أوي'

    const cleanPhone = phone.replace(/\s/g, '')
    if (!cleanPhone) found.phone = 'اكتب رقم تليفونك'
    else if (!PHONE_RE.test(cleanPhone)) found.phone = 'الرقم لازم يكون ١١ رقم ويبدأ بـ 010 أو 011 أو 012 أو 015'

    const cleanMessage = message.trim()
    if (!cleanMessage) found.message = 'قولنا إيه اللي حصل'
    else if (cleanMessage.length < MIN_MESSAGE) found.message = 'اكتب تفاصيل أكتر شوية'
    else if (cleanMessage.length > MAX_MESSAGE) found.message = 'الشكوى طويلة أوي'

    /* رقم الأوردر اختياري — بنتحقق منه بس لو الزبون كتب حاجة */
    if (orderNumber.trim() && !/^\d{1,7}$/.test(orderNumber.trim())) {
      found.orderNumber = 'رقم الأوردر أرقام بس'
    }

    return found
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError(null)

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      /* بننزل على أول حقل فيه مشكلة بدل ما المستخدم يدوّر */
      const first = document.querySelector(`[data-field="${Object.keys(found)[0]}"]`)
      first?.focus()
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }

    setSending(true)
    try {
      const result = await createComplaint({
        name: name.trim(),
        phone: phone.replace(/\s/g, ''),
        message: message.trim(),
        ...(orderNumber.trim() ? { orderNumber: Number(orderNumber.trim()) } : {}),
      })
      setTicket(result.number)
    } catch (error) {
      setApiError(
        error instanceof ApiError ? error.message : 'حصل خطأ. جرّب تاني بعد شوية.'
      )
    } finally {
      setSending(false)
    }
  }

  /* ------------------------- بعد ما تتبعت ------------------------- */

  if (ticket !== null) {
    return (
      <div className="complaint">
        <div className="ornament" aria-hidden="true" />

        <div className="shell complaint__inner">
          <div className="complaint__done">
            <div className="complaint__done-mark" aria-hidden="true">
              ✓
            </div>
            <h1 className="complaint__done-title">وصلتنا شكواك</h1>
            <p className="complaint__done-text">
              رقم الشكوى <span className="num complaint__ticket">#{ticket}</span> — إدارة
              المحل هتراجعها وهنكلّمك على الرقم اللي كتبته.
            </p>
            <p className="complaint__done-note">
              لو الموضوع مستعجل، كلّمنا على{' '}
              <a href={restaurant.contact.phone.href} className="complaint__tel num" dir="ltr">
                {restaurant.contact.phone.value}
              </a>
            </p>

            <div className="complaint__done-actions">
              <Link to="/menu" className="btn">
                ارجع للمنيو
              </Link>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setTicket(null)
                  setName('')
                  setPhone('')
                  setOrderNumber('')
                  setMessage('')
                  setErrors({})
                }}
              >
                ابعت شكوى تانية
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* --------------------------- الفورم --------------------------- */

  return (
    <div className="complaint">
      <div className="ornament" aria-hidden="true" />

      <div className="shell complaint__inner">
        <header className="complaint__head">
          <p className="complaint__kicker">صندوق الشكاوي</p>
          <h1 className="complaint__title">قولنا إيه اللي مضايقك</h1>
          <p className="complaint__sub">
            المحل شغال من ١٩٤٨ وبيتعلّم من كل ملاحظة. الشكوى بتوصل لإدارة المحل
            على طول — مش لموظف.
          </p>
        </header>

        <form className="complaint__form" onSubmit={handleSubmit} noValidate>
          {apiError ? (
            <div className="calert" role="alert">
              <div className="calert__title">الشكوى مبعتتش</div>
              <div className="calert__text">{apiError}</div>
            </div>
          ) : null}

          <div className="cfield">
            <label htmlFor="cname">الاسم</label>
            <input
              id="cname"
              data-field="name"
              type="text"
              value={name}
              autoComplete="name"
              placeholder="اسمك"
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => {
                setName(e.target.value)
                clearError('name')
              }}
            />
            {errors.name ? <p className="cerr">{errors.name}</p> : null}
          </div>

          <div className="cfield">
            <label htmlFor="cphone">رقم التليفون</label>
            <input
              id="cphone"
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
                clearError('phone')
              }}
            />
            {errors.phone ? (
              <p className="cerr">{errors.phone}</p>
            ) : (
              <p className="chint">عشان نقدر نرد عليك</p>
            )}
          </div>

          <div className="cfield">
            <label htmlFor="corder">
              رقم الأوردر <span className="cfield__optional">اختياري</span>
            </label>
            <input
              id="corder"
              data-field="orderNumber"
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={orderNumber}
              placeholder="123"
              aria-invalid={Boolean(errors.orderNumber)}
              onChange={(e) => {
                setOrderNumber(e.target.value)
                clearError('orderNumber')
              }}
            />
            {errors.orderNumber ? (
              <p className="cerr">{errors.orderNumber}</p>
            ) : (
              <p className="chint">لو الشكوى على طلب معيّن، الرقم بيسهّل علينا نلاقيه</p>
            )}
          </div>

          <div className="cfield">
            <label htmlFor="cmessage">المشكلة</label>
            <textarea
              id="cmessage"
              data-field="message"
              rows={6}
              value={message}
              maxLength={MAX_MESSAGE}
              placeholder="احكيلنا اللي حصل بالتفصيل — إيه اللي طلبته، وإمتى، وإيه اللي مظبطش"
              aria-invalid={Boolean(errors.message)}
              onChange={(e) => {
                setMessage(e.target.value)
                clearError('message')
              }}
            />
            {errors.message ? (
              <p className="cerr">{errors.message}</p>
            ) : (
              <p className="chint num">
                {message.trim().length} / {MAX_MESSAGE}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn--block" disabled={sending}>
            {sending ? 'بيتبعت…' : 'ابعت الشكوى'}
          </button>

          <p className="complaint__privacy">
            بياناتك بتوصل لإدارة المحل بس، ومبتظهرش لأي حد تاني.
          </p>
        </form>
      </div>
    </div>
  )
}
