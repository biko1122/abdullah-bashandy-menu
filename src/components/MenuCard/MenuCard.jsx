import { useEffect, useRef, useState } from 'react'
import { HeartIcon } from '../Ornaments/Ornaments'
import { useSelection } from '../../context/SelectionContext'
import { useFavorites } from '../../context/FavoritesContext'
import { formatPriceParts } from '../../utils/currency'
import { getCategory } from '../../data/categories'
import './MenuCard.css'

/**
 * كارت الصنف — اسم ووصف وسعر، من غير صور (قرار المطعم: مفيش صور أصناف).
 * الوصف بيظهر تحت الاسم دايمًا — على الموبايل والديسكتوب.
 *
 * الضغط على أي مكان في الكارت → يفتح تفاصيل الصنف.
 * الضغط على (+) → بيضيف على طول للاختيارات،
 *   إلا لو الصنف له اختيارات إجبارية (زي نوع العيش) وقتها بيفتح النافذة.
 */
export default function MenuCard({ item, onOpen }) {
  const { addItem, quantityOfItem } = useSelection()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [pulse, setPulse] = useState(false)
  const pulseTimer = useRef(null)

  useEffect(() => () => clearTimeout(pulseTimer.current), [])

  const category = getCategory(item.category)
  const { amount, currency } = formatPriceParts(item.price)
  const countInSelection = quantityOfItem(item.id)
  const needsChoices = (item.options || []).some((group) => group.required)
  const favorite = isFavorite(item.id)

  /* أصناف زي "بطاطس" ليها سعرين (بيتي بان 20 / سوري 40) — السعر المكتوب
     هو الأرخص، فبنكتب "من" قدامه عشان محدش يفتكره السعر الوحيد. */
  const startsFrom = (item.options || []).some((group) =>
    (group.choices || []).some((choice) => choice.priceDelta > 0)
  )

  const handleAdd = () => {
    if (!item.available) return
    if (needsChoices) {
      onOpen(item)
      return
    }
    addItem(item, { quantity: 1 })
    setPulse(true)
    clearTimeout(pulseTimer.current)
    pulseTimer.current = setTimeout(() => setPulse(false), 500)
  }

  return (
    <article
      className={`card ${item.available ? '' : 'card--out'} ${pulse ? 'card--pulse' : ''}`}
      /* لون القسم — بيلوّن الشريط الجانبي والبادچات */
      style={{ '--card-hue': category?.accent ?? 30 }}
    >
      <div className="card__body">
        {/* ---------------- السطر العلوي: البادچات والقلب ---------------- */}
        <div className="card__top">
          <div className="card__badges">
            {item.popular && item.available ? (
              <span className="card__stamp">الأكثر طلبًا</span>
            ) : null}
            {!item.available ? <span className="card__out-tag">خلص النهاردة</span> : null}
            {countInSelection > 0 ? (
              <span className="card__count num" aria-hidden="true">
                {countInSelection}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            className={`card__fav ${favorite ? 'is-on' : ''}`}
            onClick={() => toggleFavorite(item.id)}
            aria-pressed={favorite}
            aria-label={favorite ? `شيل ${item.name} من المفضلة` : `ضيف ${item.name} للمفضلة`}
          >
            <HeartIcon filled={favorite} />
          </button>
        </div>

        {/* ---------------- الاسم والوصف ---------------- */}
        <h3 className="card__name">
          <button type="button" className="card__trigger" onClick={() => onOpen(item)}>
            {item.name}
            <span className="sr-only"> — افتح التفاصيل</span>
          </button>
        </h3>

        {item.description ? <p className="card__desc">{item.description}</p> : null}

        {/* ---------------- السعر وزرار الإضافة ---------------- */}
        <div className="card__foot">
          <p className="card__price">
            {startsFrom ? <span className="card__from">من</span> : null}
            <span className="num">{amount}</span>
            <span className="card__currency">{currency}</span>
          </p>

          <button
            type="button"
            className="card__add"
            onClick={handleAdd}
            disabled={!item.available}
            aria-label={
              item.available ? `ضيف ${item.name} لاختياراتك` : `${item.name} مش متاح دلوقتي`
            }
          >
            <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true">
              <path
                d="M9 3.5v11M3.5 9h11"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
