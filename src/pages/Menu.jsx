import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryNav from '../components/CategoryNav/CategoryNav'
import MenuSection from '../components/MenuSection/MenuSection'
import MenuCard from '../components/MenuCard/MenuCard'
import Search from '../components/Search/Search'
import ItemModal from '../components/ItemModal/ItemModal'
import { categories, getCategory } from '../data/categories'
import { menu, PRICES_ARE_DEMO } from '../data/menu'
import { restaurant } from '../data/restaurant'
import { formatNumber } from '../utils/currency'
import { searchItems } from '../utils/search'
import './Menu.css'

/** المنيو الكامل: بحث + فلترة بالأقسام، كله لحظي من غير تحميل صفحة. */
export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [activeItem, setActiveItem] = useState(null)

  const categoryFromUrl = searchParams.get('cat')
  const activeCategory =
    categoryFromUrl && categories.some((c) => c.id === categoryFromUrl) ? categoryFromUrl : 'all'

  /* عنوان الصفحة بيتغيّر مع القسم المفتوح */
  useEffect(() => {
    const category = getCategory(activeCategory)
    document.title = category
      ? `${category.name} — ${restaurant.name}`
      : `المنيو — ${restaurant.name}`
  }, [activeCategory])

  const handleCategory = (id) => {
    setSearchParams(id === 'all' ? {} : { cat: id }, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* عدد الأصناف في كل قسم — بيظهر جنب اسم القسم في الشريط */
  const counts = useMemo(
    () =>
      categories.reduce(
        (acc, category) => {
          acc[category.id] = menu.filter((item) => item.category === category.id).length
          return acc
        },
        { all: menu.length }
      ),
    []
  )

  /* البحث — المنطق نفسه في src/utils/search.js */
  const searched = useMemo(() => searchItems(menu, query), [query])

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? searched
        : searched.filter((item) => item.category === activeCategory),
    [searched, activeCategory]
  )

  const isSearching = query.trim().length > 0
  const visibleCategories =
    activeCategory === 'all' ? categories : categories.filter((c) => c.id === activeCategory)

  return (
    <>
      <div className="menu-page">
        <header className="menu-page__head shell">
          <p className="menu-page__kicker">المنيو الكامل</p>
          <h1 className="menu-page__title">كل اللي عندنا</h1>
          <p className="menu-page__sub">
            <span className="num">{formatNumber(menu.length)}</span> صنف — دور، افتح التفاصيل،
            وابني وجبتك والحساب بيتظبط لوحده.
          </p>

          <div className="menu-page__search">
            <Search value={query} onChange={setQuery} />
          </div>

          {PRICES_ARE_DEMO ? (
            <p className="demo-note menu-page__demo">
              <span className="demo-note__dot" aria-hidden="true" />
              أسعار مبدئية للعرض — تتغيّر من <code>src/data/menu.js</code>
            </p>
          ) : null}
        </header>

        <div className="menu-page__sticky">
          <div className="shell">
            <CategoryNav
              categories={categories}
              activeId={activeCategory}
              counts={counts}
              onSelect={handleCategory}
            />
          </div>
        </div>

        <div className="shell menu-page__body">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__emoji" aria-hidden="true">
                🍽️
              </p>
              <p className="empty-state__title">مش لاقيين اللي بتدور عليه.</p>
              <p className="empty-state__text">جرب كلمة تانية… أو شوف المنيو كله.</p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setQuery('')
                  handleCategory('all')
                }}
              >
                امسح البحث
              </button>
            </div>
          ) : isSearching ? (
            /* أثناء البحث بنعرض النتايج كلها في شبكة واحدة */
            <section className="menu-page__results" aria-live="polite">
              <p className="menu-page__results-count">
                <span className="num">{formatNumber(filtered.length)}</span> نتيجة لـ «{query}»
              </p>
              <div className="card-grid">
                {filtered.map((item) => (
                  <MenuCard key={item.id} item={item} onOpen={setActiveItem} />
                ))}
              </div>
            </section>
          ) : (
            visibleCategories.map((category, index) => (
              <MenuSection
                key={category.id}
                category={category}
                index={activeCategory === 'all' ? index : categories.indexOf(category)}
                items={filtered.filter((item) => item.category === category.id)}
                onOpenItem={setActiveItem}
              />
            ))
          )}
        </div>
      </div>

      <ItemModal
        item={activeItem}
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
      />
    </>
  )
}
