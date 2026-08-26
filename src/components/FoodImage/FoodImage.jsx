import { useState } from 'react'
import { imageForItem, resolveImage } from '../../utils/images'
import './FoodImage.css'

/**
 * صورة أكل — أو بديل مرسوم لو الصورة لسه مش موجودة.
 *
 * الاستخدام مع صنف من المنيو (بيدوّر على الصورة تلقائيًا):
 *   <FoodImage item={item} hue={category.accent} />
 *
 * أو بصورة محددة بالاسم:
 *   <FoodImage folder="hero" src="hero-main.jpg" />
 *
 * الموقع بيشتغل من غير ولا صورة — وكل ما تحط صورة بتظهر مكان البديل لوحدها.
 */
export default function FoodImage({
  item,
  folder = 'menu',
  src,
  alt = '',
  label = '',
  hue = 30,
  eager = false,
  className = '',
}) {
  /* لو اتبعت صنف، بندوّر بكوده؛ وإلا بنستخدم الاسم المحدد */
  const url = item ? imageForItem(item) : resolveImage(folder, src)
  const [failed, setFailed] = useState(false)

  const text = label || item?.name || ''

  if (url && !failed) {
    return (
      <img
        className={`food-image ${className}`}
        src={url}
        alt={alt || text}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
      />
    )
  }

  /* البديل: خلفية بلون القسم + أول كلمة من الاسم */
  const monogram = String(text).trim().split(' ')[0] || '؟'

  return (
    <div
      className={`food-image food-image--placeholder ${className}`}
      role="img"
      aria-label={alt || text}
      style={{ '--ph-hue': hue }}
    >
      <span className="food-image__monogram" aria-hidden="true">
        {monogram}
      </span>
      <svg
        className="food-image__motif"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M30 60h60M60 30v60" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      </svg>
    </div>
  )
}
