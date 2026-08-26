/**
 * ==========================================================================
 *  MenuContext — المنيو الحي من السيرفر
 * ==========================================================================
 *  قبل كده المنيو كان بيتقرا من ملف ثابت (src/data/menu.js) — يعني تغيير
 *  سعر من لوحة التحكم كان بيغيّر قاعدة البيانات بس والموقع يفضل عارض القديم.
 *
 *  دلوقتي:
 *    1. الصفحة بتفتح فورًا بالمنيو الثابت (مفيش شاشة تحميل)
 *    2. في الخلفية بنجيب المنيو الحي من السيرفر
 *    3. أول ما يوصل بنستبدل — الأسعار اللي الأدمن غيّرها بتظهر
 *    4. لو السيرفر مش متاح، الموقع يفضل شغال بالنسخة الثابتة
 *
 *  ملاحظة أمان: العرض بس هو اللي من الملف الثابت وقت الطوارئ —
 *  الحساب النهائي لأي أوردر بيتم في السيرفر من قاعدة البيانات دايمًا.
 * ==========================================================================
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { menu as localMenu } from '../data/menu'
import { fetchMenu } from '../utils/api'

const MenuContext = createContext(null)

/**
 * بنحوّل شكل الـ API لنفس شكل الملف الثابت بالظبط —
 * عشان كل مكونات الموقع تشتغل زي ما هي من غير أي تعديل.
 */
const transformApiMenu = (categories) => {
  const items = []
  for (const category of categories) {
    for (const product of category.products ?? []) {
      items.push({
        id: product.sku,
        name: product.name,
        description: product.description ?? '',
        category: category.slug,
        price: product.price,
        popular: Boolean(product.isPopular),
        available: product.isAvailable !== false,
        tags: product.tags ?? [],
        options: (product.optionGroups ?? []).map((group) => ({
          id: group.key,
          name: group.name,
          required: group.isRequired !== false,
          choices: (group.choices ?? []).map((choice) => ({
            id: choice.key,
            name: choice.name,
            priceDelta: choice.priceDelta ?? 0,
          })),
        })),
      })
    }
  }
  return items
}

export function MenuProvider({ children }) {
  /* بنبدأ بالثابت — الصفحة بتترسم فورًا */
  const [menu, setMenu] = useState(localMenu)
  /* هل اللي معروض جاي من السيرفر فعلًا؟ */
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetchMenu()
      .then((categories) => {
        if (cancelled) return
        const items = transformApiMenu(categories)
        /* حماية: لو السيرفر رجّع حاجة فاضية أو مكسورة، منستبدلش */
        if (items.length > 0) {
          setMenu(items)
          setIsLive(true)
        }
      })
      .catch(() => {
        /* السيرفر مش متاح — بنكمل بالثابت وخلاص */
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => {
    const byId = new Map(menu.map((item) => [item.id, item]))
    return {
      menu,
      isLive,
      getItemById: (id) => byId.get(id),
      popularItems: menu.filter((item) => item.popular && item.available),
    }
  }, [menu, isLive])

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

/** هوك الوصول للمنيو من أي مكوّن. */
export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) throw new Error('useMenu لازم تتنادى جوه <MenuProvider>')
  return context
}

export default MenuContext
