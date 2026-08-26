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

  const rows = [
    {
      key: 'address',
      label: 'العنوان',
      value: `${location.address} — ${location.district}، ${location.city}`,
      placeholder: false,
    },
    {
      key: 'hours',
      label: 'المواعيد',
      value: hours.value ?? hours.text,
      placeholder: hours.isPlaceholder,
    },
    {
      key: 'phone',
      label: 'تليفون',
      value: contact.phone.value,
      href: contact.phone.value ? `tel:${contact.phone.value}` : null,
      placeholder: contact.phone.isPlaceholder,
    },
    {
      key: 'facebook',
      label: 'فيسبوك',
      value: contact.facebook.value,
      href: contact.facebook.value,
      placeholder: contact.facebook.isPlaceholder,
    },
    {
      key: 'instagram',
      label: 'إنستجرام',
      value: contact.instagram.value,
      href: contact.instagram.value,
      placeholder: contact.instagram.isPlaceholder,
    },
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
                  <a href={row.href} target={row.key === 'phone' ? undefined : '_blank'} rel="noreferrer noopener">
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
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
