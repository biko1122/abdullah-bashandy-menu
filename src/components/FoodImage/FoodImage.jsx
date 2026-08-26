import { useState } from 'react'
import { resolveImage } from '../../utils/images'
import './FoodImage.css'

/**
 * صورة أكل — أو بديل مرسوم لو الصورة لسه مش موجودة.
 *
 * الفكرة: تقدر تشغّل الموقع من غير ولا صورة، والشكل يفضل متظبط.
 * أول ما تحط الصورة في src/assets/images/menu/ بنفس الاسم اللي في menu.js
 * هتظهر مكان البديل أوتوماتيك.
 *
 * props:
 *  - folder: مجلد الصورة جوه src/assets/images (menu | hero | categories | atmosphere)
 *  - src: اسم الملف
 *  - alt: وصف الصورة (مهم للقراءة الصوتية)
 *  - label: نص البديل (بنستخدم اسم الصنف)
 *  - hue: درجة اللون للبديل (بتيجي من القسم)
 */
export default function FoodImage({
  folder = 'menu',
  src,
  alt = '',
  label = '',
  hue = 30,
  eager = false,
  className = '',
}) {
  const url = resolveImage(folder, src)
  const [failed, setFailed] = useState(false)

  if (url && !failed) {
    return (
      <img
        className={`food-image ${className}`}
        src={url}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
      />
    )
  }

  /* البديل: خلفية دافية + أول كلمة من الاسم بخط الهوية */
  const monogram = String(label).trim().split(' ')[0] || '؟'

  return (
    <div
      className={`food-image food-image--placeholder ${className}`}
      role="img"
      aria-label={alt || label}
      style={{
        '--ph-hue': hue,
      }}
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
        <path
          d="M30 60h60M60 30v60"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
    </div>
  )
}
