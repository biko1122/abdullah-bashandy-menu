import './Search.css'

/**
 * خانة البحث — بتدوّر على اسم الصنف والوصف والقسم والكلمات المفتاحية.
 * (منطق البحث نفسه في src/pages/Menu.jsx)
 */
export default function Search({ value, onChange, placeholder = 'دور على أكلك…', id = 'menu-search' }) {
  return (
    <div className="search">
      <label className="sr-only" htmlFor={id}>
        دور في المنيو
      </label>

      <svg className="search__icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>

      <input
        id={id}
        className="search__input"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />

      {value ? (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange('')}
          aria-label="امسح البحث"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
