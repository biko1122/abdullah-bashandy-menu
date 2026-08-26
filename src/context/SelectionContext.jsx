/**
 * ==========================================================================
 *  SelectionContext — "اختياراتك"
 * ==========================================================================
 *  ده مش عربة شراء ومفيش أي طلب بيتبعت لحد.
 *  ده مجرد مكان بنجمّع فيه اللي المستخدم اختاره عشان نحسبله الإجمالي.
 *
 *  بنخزّن في localStorage أقل حاجة ممكنة (id الصنف + الاختيارات + الكمية)،
 *  والأسعار والأسماء بنجيبها من src/data/menu.js وقت العرض —
 *  يعني لو غيّرت سعر في المنيو، الاختيارات المحفوظة بتتحدّث لوحدها.
 * ==========================================================================
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { useMenu } from './MenuContext'

const STORAGE_KEY = 'bashandy.selection.v1'

const SelectionContext = createContext(null)

/* --------------------------- مفتاح السطر --------------------------------
 * نفس الصنف بنفس الاختيارات = سطر واحد بتزيد كميته.
 * نفس الصنف باختيارات مختلفة = سطر منفصل (فول حار غير فول عادي).
 * ---------------------------------------------------------------------- */
const buildLineKey = (itemId, choiceIds = {}) => {
  const parts = Object.keys(choiceIds)
    .sort()
    .map((groupId) => `${groupId}:${choiceIds[groupId]}`)
  return parts.length ? `${itemId}__${parts.join('_')}` : itemId
}

/* ------------------------------ التخزين -------------------------------- */

const readStoredLines = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((line) => line && typeof line.itemId === 'string')
      .map((line) => ({
        key: line.key || buildLineKey(line.itemId, line.choiceIds),
        itemId: line.itemId,
        choiceIds: line.choiceIds && typeof line.choiceIds === 'object' ? line.choiceIds : {},
        quantity: Math.max(1, Math.min(99, Number(line.quantity) || 1)),
      }))
  } catch {
    return []
  }
}

/* ------------------------------ الحالة --------------------------------- */

const reducer = (lines, action) => {
  switch (action.type) {
    case 'add': {
      const { itemId, choiceIds, quantity } = action
      const key = buildLineKey(itemId, choiceIds)
      const existing = lines.find((line) => line.key === key)
      if (existing) {
        return lines.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
            : line
        )
      }
      return [...lines, { key, itemId, choiceIds, quantity }]
    }

    case 'increase':
      return lines.map((line) =>
        line.key === action.key
          ? { ...line, quantity: Math.min(99, line.quantity + 1) }
          : line
      )

    /* لو الكمية وصلت 1 ونقّصنا تاني → السطر يتشال */
    case 'decrease':
      return lines
        .map((line) =>
          line.key === action.key ? { ...line, quantity: line.quantity - 1 } : line
        )
        .filter((line) => line.quantity > 0)

    case 'setQuantity':
      return lines
        .map((line) =>
          line.key === action.key
            ? { ...line, quantity: Math.min(99, Math.max(0, action.quantity)) }
            : line
        )
        .filter((line) => line.quantity > 0)

    case 'remove':
      return lines.filter((line) => line.key !== action.key)

    case 'clear':
      return []

    default:
      return lines
  }
}

/* ------------------------------ المزوّد -------------------------------- */

export function SelectionProvider({ children }) {
  /* المنيو الحي — الأسعار والأسماء بتتقري منه وقت العرض */
  const { getItemById } = useMenu()

  const [lines, dispatch] = useReducer(reducer, null, readStoredLines)

  /* حفظ تلقائي في المتصفح */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* لو المتصفح مانع التخزين، الموقع بيفضل شغال عادي */
    }
  }, [lines])

  /* بنربط كل سطر ببيانات الصنف الحالية ونحسب سعره */
  const detailedLines = useMemo(() => {
    return lines
      .map((line) => {
        const item = getItemById(line.itemId)
        if (!item) return null // الصنف اتشال من المنيو

        const chosen = (item.options || [])
          .map((group) => {
            const choiceId = line.choiceIds?.[group.id]
            const choice = group.choices.find((c) => c.id === choiceId)
            if (!choice) return null
            return {
              groupId: group.id,
              groupName: group.name,
              choiceId: choice.id,
              choiceName: choice.name,
              priceDelta: choice.priceDelta || 0,
            }
          })
          .filter(Boolean)

        const extras = chosen.reduce((sum, c) => sum + c.priceDelta, 0)
        const unitPrice = item.price + extras

        return {
          ...line,
          item,
          chosen,
          unitPrice,
          lineTotal: unitPrice * line.quantity,
          /* وصف مختصر للاختيارات: "فينو · حامية" */
          choiceSummary: chosen.map((c) => c.choiceName).join(' · '),
        }
      })
      .filter(Boolean)
  }, [lines])

  /* ------------------ الإجمالي = مجموع (السعر × الكمية) ---------------- */
  const total = useMemo(
    () => detailedLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [detailedLines]
  )

  const itemCount = useMemo(
    () => detailedLines.reduce((sum, line) => sum + line.quantity, 0),
    [detailedLines]
  )

  /* -------------------------- العمليات -------------------------------- */

  const addItem = useCallback((item, { quantity = 1, choiceIds = {} } = {}) => {
    if (!item || item.available === false) return
    dispatch({
      type: 'add',
      itemId: item.id,
      choiceIds,
      quantity: Math.max(1, Math.min(99, quantity)),
    })
  }, [])

  const increaseQuantity = useCallback((key) => dispatch({ type: 'increase', key }), [])
  const decreaseQuantity = useCallback((key) => dispatch({ type: 'decrease', key }), [])
  const setQuantity = useCallback(
    (key, quantity) => dispatch({ type: 'setQuantity', key, quantity }),
    []
  )
  const removeItem = useCallback((key) => dispatch({ type: 'remove', key }), [])
  const clearSelection = useCallback(() => dispatch({ type: 'clear' }), [])

  /* كام مرة الصنف ده متختار (بكل اختياراته) — بنستخدمها في كروت المنيو */
  const quantityOfItem = useCallback(
    (itemId) =>
      detailedLines
        .filter((line) => line.itemId === itemId)
        .reduce((sum, line) => sum + line.quantity, 0),
    [detailedLines]
  )

  const value = useMemo(
    () => ({
      lines: detailedLines,
      total,
      itemCount,
      isEmpty: detailedLines.length === 0,
      addItem,
      increaseQuantity,
      decreaseQuantity,
      setQuantity,
      removeItem,
      clearSelection,
      quantityOfItem,
      buildLineKey,
    }),
    [
      detailedLines,
      total,
      itemCount,
      addItem,
      increaseQuantity,
      decreaseQuantity,
      setQuantity,
      removeItem,
      clearSelection,
      quantityOfItem,
    ]
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

/** هوك الوصول للاختيارات من أي مكوّن. */
export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection لازم تتنادى جوه <SelectionProvider>')
  }
  return context
}

export default SelectionContext
