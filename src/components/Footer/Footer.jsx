import { Link } from 'react-router-dom'
import { BrandMark } from '../Ornaments/Ornaments'
import { restaurant } from '../../data/restaurant'
import { PRICES_ARE_DEMO } from '../../data/menu'
import './Footer.css'

/** فوتر بسيط — اسم، سطر، مكان، وحقوق. مفيش أكتر من كده. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="ornament" aria-hidden="true" />

      <div className="shell footer__inner">
        <div className="footer__brand">
          <BrandMark size={44} />
          <p className="footer__name">{restaurant.name}</p>
          <p className="footer__tagline">{restaurant.tagline}</p>
        </div>

        <nav className="footer__links" aria-label="روابط سريعة">
          <Link to="/">الرئيسية</Link>
          <Link to="/menu">المنيو</Link>
          <a href={restaurant.location.mapsUrl} target="_blank" rel="noreferrer noopener">
            الاتجاهات
          </a>
          <Link to="/complaint">شكوى</Link>
        </nav>

        <p className="footer__place">
          {restaurant.location.district} — {restaurant.location.city}
          <br />
          <span>{restaurant.location.address}</span>
        </p>
      </div>

      <div className="shell footer__bottom">
        <p>
          © <span className="num">{year}</span> {restaurant.name}
        </p>
        <p className="footer__note">
          منيو رقمي للعرض والحساب بس — مفيش طلب أونلاين.
          {PRICES_ARE_DEMO ? ' الأسعار المعروضة مبدئية.' : ''}
        </p>
      </div>
    </footer>
  )
}
