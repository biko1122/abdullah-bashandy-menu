import { Link } from 'react-router-dom'
import MenuCard from '../MenuCard/MenuCard'
import { ArrowIcon } from '../Ornaments/Ornaments'
import './PopularSection.css'

/**
 * "أشهر اختياراتنا" — بيتبني لوحده من الأصناف اللي فيها popular: true
 * (شوف src/data/menu.js). عايز تغيّر اللي بيظهر هنا؟ غيّر popular في المنيو.
 */
export default function PopularSection({ items, onOpenItem, limit = 6 }) {
  const shown = items.slice(0, limit)
  if (!shown.length) return null

  return (
    <section className="popular section" aria-labelledby="popular-title">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__main">
            <span className="section-head__index num">٠١</span>
            <div>
              <h2 className="section-head__title" id="popular-title">
                الناس بتحب إيه؟
              </h2>
              <p className="section-head__note">أكتر حاجات بتتطلب عندنا.</p>
            </div>
          </div>

          <Link to="/menu" className="popular__link">
            المنيو كامل
            <ArrowIcon />
          </Link>
        </div>

        <div className="card-grid popular__grid">
          {shown.map((item) => (
            <MenuCard key={item.id} item={item} onOpen={onOpenItem} />
          ))}
        </div>
      </div>
    </section>
  )
}
