/**
 * ==========================================================================
 *  البحث في المنيو
 * ==========================================================================
 *  البحث بيشتغل على: اسم الصنف + الوصف + اسم القسم + الكلمات المفتاحية (tags).
 *
 *  وقبل المقارنة بنبسّط النص عشان الكتابة السريعة تلاقي برضه:
 *    "طعميه" تلاقي "طعمية"   |   "اسكندراني" تلاقي "إسكندراني"
 */

import { getCategory } from '../data/categories'

/** تبسيط النص العربي: تشكيل، همزات، تاء مربوطة، ألف مقصورة. */
export const normalizeArabic = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '') // تشكيل + تطويل
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()

/** النص اللي بندوّر جوّاه لكل صنف. */
const haystackFor = (item) =>
  normalizeArabic(
    [item.name, item.description, getCategory(item.category)?.name, ...(item.tags || [])].join(' ')
  )

/**
 * يرجّع الأصناف اللي فيها كلمة البحث.
 * لو البحث فاضي بيرجّع المنيو كله زي ما هو.
 */
export const searchItems = (items, query) => {
  const term = normalizeArabic(query)
  if (!term) return items
  return items.filter((item) => haystackFor(item).includes(term))
}
