import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from '../Ornaments/Ornaments'
import { useSelection } from '../../context/SelectionContext'
import { formatNumber, formatPrice } from '../../utils/currency'
import { restaurant } from '../../data/restaurant'
import './Navbar.css'

/**
 * الهيدر — لاصق فوق، وبيتحوّل لشكل أصغر ومصمت بعد ما تنزل شوية.
 * زرار "اختياراتك" بيظهر هنا على الشاشات الكبيرة (وعلى الموبايل بيبقى شريط عايم تحت).
 */
export default function Navbar({ onOpenSelection }) {
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, total, isEmpty } = useSelection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner shell">
        <Link to="/" className="nav__brand" aria-label={`${restaurant.name} — الرئيسية`}>
          <BrandMark size={38} className="nav__mark" />
          <span className="nav__names">
            <span className="nav__name">{restaurant.name}</span>
            <span className="nav__latin">{restaurant.nameLatin}</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="روابط الموقع">
          <NavLink to="/" className="nav__link" end>
            الرئيسية
          </NavLink>
          <NavLink to="/menu" className="nav__link">
            المنيو
          </NavLink>
          <Link to="/#location" className="nav__link nav__link--muted">
            المكان
          </Link>
        </nav>

        <button
          type="button"
          className={`nav__selection ${isEmpty ? 'is-empty' : ''}`}
          onClick={onOpenSelection}
        >
          <span className="nav__selection-label">اختياراتك</span>
          {isEmpty ? null : (
            <>
              <span className="nav__selection-count num">{formatNumber(itemCount)}</span>
              <span className="nav__selection-total num">{formatPrice(total)}</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
