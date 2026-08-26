/**
 * ==========================================================================
 *  FavoritesContext — المفضلة (القلب)
 * ==========================================================================
 *  حاجة بسيطة جدًا: بنحفظ ids الأصناف اللي المستخدم حبّها في المتصفح.
 *  مفيش حساب ولا تسجيل دخول — البيانات على جهازه بس.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'bashandy.favorites.v1'

const FavoritesContext = createContext(null)

const readStored = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(readStored)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      /* تجاهُل — المفضلة مش حاجة حرجة */
    }
  }, [ids])

  const toggleFavorite = useCallback((itemId) => {
    setIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    )
  }, [])

  const isFavorite = useCallback((itemId) => ids.includes(itemId), [ids])

  const value = useMemo(
    () => ({ favorites: ids, toggleFavorite, isFavorite, count: ids.length }),
    [ids, toggleFavorite, isFavorite]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites لازم تتنادى جوه <FavoritesProvider>')
  return context
}

export default FavoritesContext
