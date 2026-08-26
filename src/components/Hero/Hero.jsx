import { Link } from 'react-router-dom'
import { ArrowIcon, PatternStrip } from '../Ornaments/Ornaments'
import { restaurant } from '../../data/restaurant'
import './Hero.css'

/**
 * الهيرو — كلام مطبوع بس، من غير صور.
 * الاسم كبير في النص، وتحته التفاصيل الصغيرة زي غلاف منيو مطبوع.
 */
export default function Hero() {
  const { location, microCopy } = restaurant

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner shell">
        <div className="hero__text">
          <p className="hero__kicker">
            <span className="hero__kicker-line" aria-hidden="true" />
            {microCopy.heroKicker}
          </p>

          <h1 className="hero__title" id="hero-title">
            {restaurant.name}
          </h1>

          <p className="hero__latin" aria-hidden="true">
            {restaurant.nameLatin}
          </p>

          <p className="hero__lead">
            {restaurant.taglineLong}
            <br />
            من أول طبق الفول والطعمية… لحد الجريل والبرجر.
          </p>

          <ul className="hero__tags">
            {['فول', 'طعمية', 'جريل', 'برجر'].map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <div className="hero__actions">
            <Link to="/menu" className="btn">
              شوف المنيو
              <ArrowIcon />
            </Link>

            <a
              className="btn btn--ghost"
              href={location.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              الاتجاهات
            </a>
          </div>

          <dl className="hero__meta">
            <div>
              <dt>المكان</dt>
              <dd>
                {location.district} — {location.city}
              </dd>
            </div>
            <div>
              <dt>العنوان</dt>
              <dd>{location.address}</dd>
            </div>
          </dl>
        </div>

        <PatternStrip className="hero__strip" height={12} opacity={0.5} />
      </div>
    </section>
  )
}
