/**
 * ==========================================================================
 *  حل مسارات الصور
 * ==========================================================================
 *  الفكرة: **مفيش أي اسم صورة مكتوب في ملف المنيو**.
 *  الصورة بتتلاقى تلقائيًا من كود الصنف (id).
 *
 *  عشان تحط صورة لصنف:
 *    حط الصورة باسم كود الصنف في src/assets/images/menu/
 *    يعني صنف id = 'fs-001'  →  الصورة اسمها  fs-001.jpg
 *
 *  والامتداد مش مهم: jpg أو png أو webp — كله يشتغل.
 *
 *  لو الصورة مش موجودة، بندوّر بالترتيب ده:
 *    1. صورة الصنف نفسه        menu/fs-001.jpg
 *    2. صورة القسم             categories/foul-sandwiches.jpg
 *    3. بديل مرسوم بالكود      (خلفية بلون القسم + أول كلمة من الاسم)
 *
 *  يعني الموقع شغال من غير ولا صورة، وكل ما تحط صورة بتظهر لوحدها.
 * ==========================================================================
 */

/* Vite بيجمّع كل الصور الموجودة وقت البناء */
const imageModules = import.meta.glob(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' }
)

/* خريطة: 'menu/fs-001.jpg' → '/assets/fs-001-a1b2c3.jpg' */
const byPath = new Map()
/* وخريطة من غير الامتداد: 'menu/fs-001' → url */
const byBaseName = new Map()

for (const [modulePath, url] of Object.entries(imageModules)) {
  const relative = modulePath.replace('../assets/images/', '')
  byPath.set(relative, url)

  const withoutExtension = relative.replace(/\.[a-z0-9]+$/i, '')
  /* الأولوية لصورة حقيقية على أي svg مؤقت */
  const isVector = /\.svg$/i.test(relative)
  if (!byBaseName.has(withoutExtension) || !isVector) {
    byBaseName.set(withoutExtension, url)
  }
}

/**
 * يرجّع مسار الصورة أو null.
 * resolveImage('menu', 'fs-001')      → مسار الصورة لو موجودة
 * resolveImage('menu', 'fs-001.jpg')  → نفس النتيجة
 */
export const resolveImage = (folder, fileName) => {
  if (!fileName) return null
  const path = `${folder}/${fileName}`
  if (byPath.has(path)) return byPath.get(path)

  const withoutExtension = path.replace(/\.[a-z0-9]+$/i, '')
  return byBaseName.get(withoutExtension) ?? null
}

/**
 * صورة صنف — دي الدالة الأساسية اللي المنيو بيستخدمها.
 * بتجرّب صورة الصنف الأول، وبعدين صورة القسم.
 *
 * imageForItem({ id: 'fs-001', category: 'foul-sandwiches' })
 */
export const imageForItem = (item) => {
  if (!item) return null
  return resolveImage('menu', item.id) ?? resolveImage('categories', item.category) ?? null
}

/** اختصارات لكل مجلد */
export const menuImage = (fileName) => resolveImage('menu', fileName)
export const heroImage = (fileName) => resolveImage('hero', fileName)
export const categoryImage = (fileName) => resolveImage('categories', fileName)
export const atmosphereImage = (fileName) => resolveImage('atmosphere', fileName)

/** كل الصور المتاحة — مفيد لو حبيت تتأكد إيه اللي اتحمّل فعلاً */
export const availableImages = () => [...byPath.keys()]

/** كام صنف عنده صورة خاصة بيه (مش صورة القسم) */
export const itemsWithOwnImage = () =>
  [...byBaseName.keys()].filter((key) => key.startsWith('menu/')).length
