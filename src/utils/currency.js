/**
 * ==========================================================================
 *  تنسيق الأسعار — مكان واحد لكل الأرقام في الموقع
 * ==========================================================================
 *  عايز تغيّر شكل السعر في كل الموقع؟ غيّر من هنا وبس.
 */

/** رمز العملة اللي بيظهر جنب الرقم. */
export const CURRENCY_LABEL = 'ج.م'

/**
 * false → أرقام عادية:   35 ج.م   (الافتراضي — أسهل في القراءة السريعة)
 * true  → أرقام عربية:  ٣٥ ج.م
 */
export const USE_ARABIC_NUMERALS = false

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

/** يحوّل أي رقم لأرقام عربية هندية. */
export const toArabicDigits = (value) =>
  String(value).replace(/[0-9]/g, (digit) => ARABIC_DIGITS[Number(digit)])

/** الرقم لوحده، من غير رمز العملة. */
export const formatNumber = (value) => {
  const rounded = Math.round(Number(value) || 0)
  return USE_ARABIC_NUMERALS ? toArabicDigits(rounded) : String(rounded)
}

/**
 * السعر كامل بالعملة.
 * formatPrice(185) → "185 ج.م"
 */
export const formatPrice = (value) => `${formatNumber(value)} ${CURRENCY_LABEL}`

/**
 * نفس السعر بس مقسوم لجزئين — مفيد لما نحب نعرض الرقم بخط أكبر من العملة.
 * formatPriceParts(185) → { amount: "185", currency: "ج.م" }
 */
export const formatPriceParts = (value) => ({
  amount: formatNumber(value),
  currency: CURRENCY_LABEL,
})

/** صيغة الكمية: "2 ×" */
export const formatQuantity = (qty) => `${formatNumber(qty)} ×`
