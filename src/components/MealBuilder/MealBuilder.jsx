import { useMemo, useState } from 'react'
import { mealBuilderSteps } from '../../data/mealBuilder'
import { useMenu } from '../../context/MenuContext'
import { useSelection } from '../../context/SelectionContext'
import { formatPrice } from '../../utils/currency'
import './MealBuilder.css'

/**
 * "اعمل وجبتك" — تجربة سريعة لتكوين وجبة والحساب بيتحدّث لحظيًا.
 * في الآخر بيضيف اللي اخترته لـ "اختياراتك" — وبرضه من غير أي طلب.
 *
 * الأصناف اللي بتظهر هنا متظبطة من src/data/mealBuilder.js
 */
export default function MealBuilder() {
  const { getItemById } = useMenu()
  const { addItem } = useSelection()
  const [picked, setPicked] = useState({}) // { stepId: [itemId, …] }
  const [added, setAdded] = useState(false)

  const steps = useMemo(
    () =>
      mealBuilderSteps
        .map((step) => ({
          ...step,
          items: step.itemIds.map(getItemById).filter((item) => item && item.available),
        }))
        .filter((step) => step.items.length > 0),
    [getItemById]
  )

  const chosenItems = useMemo(() => {
    const ids = Object.values(picked).flat()
    return ids.map(getItemById).filter(Boolean)
  }, [picked, getItemById])

  const total = chosenItems.reduce((sum, item) => sum + item.price, 0)

  const toggle = (step, itemId) => {
    setAdded(false)
    setPicked((current) => {
      const currentStep = current[step.id] || []
      if (step.mode === 'single') {
        return { ...current, [step.id]: currentStep.includes(itemId) ? [] : [itemId] }
      }
      return {
        ...current,
        [step.id]: currentStep.includes(itemId)
          ? currentStep.filter((id) => id !== itemId)
          : [...currentStep, itemId],
      }
    })
  }

  const handleAddAll = () => {
    chosenItems.forEach((item) => addItem(item, { quantity: 1 }))
    setPicked({})
    setAdded(true)
  }

  if (!steps.length) return null

  return (
    <section className="builder section" aria-labelledby="builder-title">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__main">
            <span className="section-head__index num">٠٢</span>
            <div>
              <h2 className="section-head__title" id="builder-title">
                اعمل وجبتك
              </h2>
              <p className="section-head__note">اختار… وإحنا بنحسب معاك على طول.</p>
            </div>
          </div>
        </div>

        <div className="builder__box">
          <div className="builder__steps">
            {steps.map((step, index) => (
              <div className="builder__step" key={step.id}>
                <div className="builder__step-head">
                  <span className="builder__step-num num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className="builder__step-title">{step.title}</h3>
                  <span className="builder__step-note">{step.note}</span>
                </div>

                <div className="builder__options">
                  {step.items.map((item) => {
                    const isOn = (picked[step.id] || []).includes(item.id)
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`builder__pill ${isOn ? 'is-on' : ''}`}
                        onClick={() => toggle(step, item.id)}
                        aria-pressed={isOn}
                      >
                        <span className="builder__pill-name">{item.name}</span>
                        <span className="builder__pill-price num">{formatPrice(item.price)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <aside className="builder__summary" aria-live="polite">
            <p className="builder__summary-label">حساب الوجبة</p>

            {chosenItems.length ? (
              <ul className="builder__list">
                {chosenItems.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <span className="num">{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="builder__hint">
                {added ? 'اتضافت لاختياراتك ✓ — تعمل واحدة تانية؟' : 'اختار من فوق وشوف الحساب بيتظبط.'}
              </p>
            )}

            <div className="builder__total">
              <span>الإجمالي</span>
              <strong className="num">{formatPrice(total)}</strong>
            </div>

            <button
              type="button"
              className="btn btn--block"
              onClick={handleAddAll}
              disabled={!chosenItems.length}
            >
              ضيف الوجبة لاختياراتك
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}
