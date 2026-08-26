import { useEffect, useMemo, useState } from 'react'
import Sheet from '../Sheet/Sheet'
import FoodImage from '../FoodImage/FoodImage'
import QuantityControl from '../QuantityControl/QuantityControl'
import { HeartIcon } from '../Ornaments/Ornaments'
import { useSelection } from '../../context/SelectionContext'
import { useFavorites } from '../../context/FavoritesContext'
import { formatPrice } from '../../utils/currency'
import { getCategory } from '../../data/categories'
import './ItemModal.css'

/** الاختيار الافتراضي لكل مجموعة (أول اختيار في المجموعات الإجبارية). */
const defaultChoices = (item) => {
  const initial = {}
  for (const group of item?.options || []) {
    if (group.required && group.choices?.length) initial[group.id] = group.choices[0].id
  }
  return initial
}

/**
 * تفاصيل الصنف — bottom sheet على الموبايل، نافذة على الديسكتوب.
 * الزرار هنا بيضيف للاختيارات بس… مفيش أي طلب بيتبعت.
 */
export default function ItemModal({ item, open, onClose }) {
  const { addItem } = useSelection()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [quantity, setQuantity] = useState(1)
  const [choices, setChoices] = useState({})

  /* بنمسك آخر صنف اتفتح عشان النافذة تكمّل أنيميشن القفل
     حتى لو الصفحة صفّرت الصنف المختار. */
  const [shown, setShown] = useState(item)

  useEffect(() => {
    if (item) setShown(item)
  }, [item])

  /* كل ما نفتح صنف جديد نرجّع الكمية والاختيارات للوضع الافتراضي */
  useEffect(() => {
    if (open && item) {
      setQuantity(1)
      setChoices(defaultChoices(item))
    }
  }, [open, item])

  const category = shown ? getCategory(shown.category) : null

  const unitPrice = useMemo(() => {
    if (!shown) return 0
    const extras = (shown.options || []).reduce((sum, group) => {
      const choice = group.choices.find((c) => c.id === choices[group.id])
      return sum + (choice?.priceDelta || 0)
    }, 0)
    return shown.price + extras
  }, [shown, choices])

  if (!shown) return null

  const favorite = isFavorite(shown.id)

  const handleAdd = () => {
    addItem(shown, { quantity, choiceIds: choices })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} labelledBy="item-modal-title" variant="modal">
      <div className="item">
        <div className="item__media">
          <FoodImage
            folder="menu"
            src={shown.image}
            alt={shown.name}
            label={shown.name}
            hue={category?.accent ?? 30}
            eager
          />
        </div>

        <div className="item__content">
          <div className="item__meta">
            <span className="item__category">{category?.name}</span>
            {shown.popular ? <span className="stamp">الأكثر طلبًا</span> : null}
            {!shown.available ? <span className="stamp stamp--muted">مش متاح دلوقتي</span> : null}
          </div>

          <div className="item__headline">
            <h2 className="item__title" id="item-modal-title">
              {shown.name}
            </h2>

            <button
              type="button"
              className={`item__fav ${favorite ? 'is-on' : ''}`}
              onClick={() => toggleFavorite(shown.id)}
              aria-pressed={favorite}
              aria-label={favorite ? 'شيل من المفضلة' : 'ضيف للمفضلة'}
            >
              <HeartIcon filled={favorite} size={20} />
            </button>
          </div>

          <p className="item__desc">{shown.description}</p>

          <p className="item__price">{formatPrice(shown.price)}</p>

          {(shown.options || []).map((group) => (
            <fieldset className="item__group" key={group.id}>
              <legend className="item__group-title">
                {group.name}
                {group.required ? null : <span className="item__optional">اختياري</span>}
              </legend>

              <div className="item__choices">
                {group.choices.map((choice) => {
                  const checked = choices[group.id] === choice.id
                  return (
                    <label
                      key={choice.id}
                      className={`choice ${checked ? 'is-on' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`${shown.id}-${group.id}`}
                        value={choice.id}
                        checked={checked}
                        onChange={() =>
                          setChoices((current) => ({ ...current, [group.id]: choice.id }))
                        }
                      />
                      <span className="choice__name">{choice.name}</span>
                      {choice.priceDelta ? (
                        <span className="choice__delta num">+{choice.priceDelta}</span>
                      ) : null}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <div className="item__actions">
            <div className="item__qty">
              <span className="item__qty-label">الكمية</span>
              <QuantityControl
                size="lg"
                value={quantity}
                onIncrease={() => setQuantity((q) => Math.min(99, q + 1))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                disabledMinus={quantity <= 1}
              />
            </div>

            <button
              type="button"
              className="btn item__add"
              onClick={handleAdd}
              disabled={!shown.available}
            >
              <span>{shown.available ? 'أضف لاختياراتك' : 'مش متاح دلوقتي'}</span>
              {shown.available ? (
                <span className="item__add-total">{formatPrice(unitPrice * quantity)}</span>
              ) : null}
            </button>
          </div>

          <p className="item__hint">ده مش طلب — إحنا بنحسبلك وجبتك بس.</p>
        </div>
      </div>
    </Sheet>
  )
}
