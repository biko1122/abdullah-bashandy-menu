import { useEffect, useRef } from 'react'
import { formatNumber } from '../../utils/currency'
import './CategoryNav.css'

/**
 * شريط الأقسام اللاصق.
 * الضغط على قسم بيفلتر المنيو على طول — من غير تحميل صفحة.
 * على الموبايل الشريط بيتحرك أفقيًا، والقسم المختار بيروح لنص الشاشة لوحده.
 */
export default function CategoryNav({ categories, activeId, onSelect, counts = {} }) {
  const listRef = useRef(null)
  const activeRef = useRef(null)

  useEffect(() => {
    const chip = activeRef.current
    const list = listRef.current
    if (!chip || !list) return
    const chipBox = chip.getBoundingClientRect()
    const listBox = list.getBoundingClientRect()
    if (chipBox.left < listBox.left || chipBox.right > listBox.right) {
      chip.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [activeId])

  const options = [{ id: 'all', name: 'الكل' }, ...categories]

  return (
    <nav className="catnav" aria-label="أقسام المنيو">
      <div className="catnav__fade catnav__fade--start" aria-hidden="true" />
      <ul className="catnav__list" ref={listRef}>
        {options.map((category) => {
          const isActive = activeId === category.id
          const count = category.id === 'all' ? counts.all : counts[category.id]
          return (
            <li key={category.id}>
              <button
                type="button"
                ref={isActive ? activeRef : null}
                className={`catnav__chip ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelect(category.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                {category.name}
                {typeof count === 'number' ? (
                  <span className="catnav__count num">{formatNumber(count)}</span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="catnav__fade catnav__fade--end" aria-hidden="true" />
    </nav>
  )
}
