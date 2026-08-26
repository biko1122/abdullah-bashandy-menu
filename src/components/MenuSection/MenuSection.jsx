import MenuCard from '../MenuCard/MenuCard'
import { formatNumber } from '../../utils/currency'
import './MenuSection.css'

/**
 * قسم كامل في المنيو: عنوان مرقّم + شبكة كروت.
 * الترقيم (٠١، ٠٢…) مستوحى من المنيوهات المطبوعة.
 */
export default function MenuSection({ category, items, index, onOpenItem }) {
  if (!items.length) return null

  const number = String(index + 1).padStart(2, '0')

  return (
    <section className="menu-section" id={`section-${category.id}`} aria-labelledby={`title-${category.id}`}>
      <header className="menu-section__head">
        <div className="menu-section__title-wrap">
          <span className="menu-section__number num" aria-hidden="true">
            {number}
          </span>
          <div>
            <h2 className="menu-section__title" id={`title-${category.id}`}>
              {category.name}
            </h2>
            {category.note ? <p className="menu-section__note">{category.note}</p> : null}
          </div>
        </div>

        <span className="menu-section__count">
          <span className="num">{formatNumber(items.length)}</span> صنف
        </span>
      </header>

      <div className="menu-section__rule" aria-hidden="true" />

      <div className="card-grid">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} onOpen={onOpenItem} />
        ))}
      </div>
    </section>
  )
}
