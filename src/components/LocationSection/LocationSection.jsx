import { restaurant } from '../../data/restaurant'
import { ArrowIcon } from '../Ornaments/Ornaments'
import './LocationSection.css'

/**
 * المكان والتواصل.
 * أي بيان قيمته null في src/data/restaurant.js مش بيظهر خالص،
 * وأي بيان عليه isPlaceholder بيظهر جنبه كلمة (مبدئي) عشان تعرف تغيّره.
 */
export default function LocationSection() {
  const { location, contact, hours } = restaurant

  /* كل بيان تواصل بيتقرأ بنفس الشكل: value + href + note */
  const contactRow = (key, label, entry) => ({
    key,
    label,
    value: entry.value,
    href: entry.href,
    note: entry.note,
    external: key !== 'phone',
    placeholder: entry.isPlaceholder,
  })

  const rows = [
    {
      key: 'address',
      label: 'العنوان',
      value: [location.address, location.district, location.area, location.city]
        .filter(Boolean)
        .join('، '),
      placeholder: false,
    },
    {
      key: 'hours',
      label: 'المواعيد',
      value: hours.value ?? hours.text,
      placeholder: hours.isPlaceholder,
    },
    contactRow('phone', 'تليفون', contact.phone),
    contactRow('whatsapp', 'واتساب', contact.whatsapp),
    contactRow('facebook', 'فيسبوك', contact.facebook),
    contactRow('instagram', 'إنستجرام', contact.instagram),
  ].filter((row) => row.value)

  return (
    <section className="location section" id="location" aria-labelledby="location-title">
      <div className="shell location__inner">
        <div className="location__head">
          <span className="section-head__index num">٠٣</span>
          <div>
            <h2 className="section-head__title" id="location-title">
              تعالى عندنا
            </h2>
            <p className="section-head__note">
              {location.district} — {location.city}
            </p>
          </div>
        </div>

        <dl className="location__rows">
          {rows.map((row) => (
            <div className="location__row" key={row.key}>
              <dt>{row.label}</dt>
              <dd>
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.external ? '_blank' : undefined}
                    rel="noreferrer noopener"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
                {row.note ? <span className="location__note">{row.note}</span> : null}
                {row.placeholder ? <span className="location__placeholder">مبدئي</span> : null}
              </dd>
            </div>
          ))}
        </dl>

        <a
          className="btn location__cta"
          href={location.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          الاتجاهات على الخريطة
          <ArrowIcon />
        </a>
      </div>
    </section>
  )
}
