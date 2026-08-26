/**
 * ==========================================================================
 *  حل مسارات الصور
 * ==========================================================================
 *  الفكرة: بيانات المنيو بتخزّن اسم الملف بس (مثلاً 'foul.jpg')،
 *  والملف ده بيدوّر عليه جوه src/assets/images/ ويرجّع المسار النهائي.
 *
 *  يعني عشان تحط صورة لصنف:
 *    1. حط الصورة في  src/assets/images/menu/
 *    2. اكتب اسمها في حقل image في src/data/menu.js
 *  وخلاص — من غير أي import يدوي.
 *
 *  لو الصورة مش موجودة، الموقع بيعرض بديل مرسوم (placeholder) بشكل مظبوط
 *  بدل ما يبان لينك مكسور.
 */

/* Vite بيجمع كل الصور الموجودة وقت البناء. */
const imageModules = import.meta.glob(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' }
)

/* بنبني خريطة: 'menu/foul.jpg' → '/assets/foul-a1b2c3.jpg' */
const byPath = new Map()
/* وخريطة تانية من غير الامتداد: 'menu/foul' → url
   عشان لو حطيت foul.webp بدل foul.jpg يشتغل برضه. */
const byBaseName = new Map()

for (const [modulePath, url] of Object.entries(imageModules)) {
  const relative = modulePath.replace('../assets/images/', '')
  byPath.set(relative, url)

  const withoutExtension = relative.replace(/\.[a-z0-9]+$/i, '')
  /* الأولوية لصور حقيقية على أي svg مؤقت */
  const isVector = /\.svg$/i.test(relative)
  if (!byBaseName.has(withoutExtension) || !isVector) {
    byBaseName.set(withoutExtension, url)
  }
}

/**
 * يرجّع مسار الصورة أو null لو مش موجودة.
 *
 * resolveImage('menu', 'foul.jpg')       → مسار الصورة
 * resolveImage('hero', 'hero-main.jpg')  → مسار الصورة
 */
export const resolveImage = (folder, fileName) => {
  if (!fileName) return null
  const path = `${folder}/${fileName}`
  if (byPath.has(path)) return byPath.get(path)

  const withoutExtension = path.replace(/\.[a-z0-9]+$/i, '')
  return byBaseName.get(withoutExtension) ?? null
}

/** اختصارات لكل مجلد. */
export const menuImage = (fileName) => resolveImage('menu', fileName)
export const heroImage = (fileName) => resolveImage('hero', fileName)
export const categoryImage = (fileName) => resolveImage('categories', fileName)
export const atmosphereImage = (fileName) => resolveImage('atmosphere', fileName)

/** كل الصور المتاحة — مفيد لو حبيت تتأكد إيه اللي اتحمّل فعلاً. */
export const availableImages = () => [...byPath.keys()]
