import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import CategoryNav from '../components/CategoryNav/CategoryNav'
import PopularSection from '../components/PopularSection/PopularSection'
import MealBuilder from '../components/MealBuilder/MealBuilder'
import StorySection from '../components/StorySection/StorySection'
import LocationSection from '../components/LocationSection/LocationSection'
import ItemModal from '../components/ItemModal/ItemModal'
import { categories } from '../data/categories'
import { PRICES_ARE_DEMO } from '../data/menu'
import { useMenu } from '../context/MenuContext'
import { restaurant } from '../data/restaurant'
import './Home.css'

/** الصفحة الرئيسية — تعريف سريع بالمحل وأشهر الأصناف وتجربة "اعمل وجبتك". */
export default function Home() {
  const { menu, popularItems } = useMenu()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    document.title = `${restaurant.name} — ${restaurant.tagline}`
  }, [])

  const counts = categories.reduce(
    (acc, category) => {
      acc[category.id] = menu.filter((item) => item.category === category.id).length
      return acc
    },
    { all: menu.length }
  )

  return (
    <>
      <Hero />

      {/* اختصار الأقسام — بيوديك على المنيو والقسم مفتوح */}
      <section className="quicknav" aria-labelledby="quicknav-title">
        <div className="shell">
          <div className="quicknav__head">
            <h2 className="quicknav__title" id="quicknav-title">
              قسم إيه اللي في بالك؟
            </h2>
            {PRICES_ARE_DEMO ? (
              <p className="demo-note">
                <span className="demo-note__dot" aria-hidden="true" />
                الأسعار المعروضة مبدئية للعرض — الأسعار الرسمية بتتحدّث من ملف المنيو.
              </p>
            ) : null}
          </div>

          <CategoryNav
            categories={categories}
            activeId={null}
            counts={counts}
            onSelect={(id) => navigate(id === 'all' ? '/menu' : `/menu?cat=${id}`)}
          />
        </div>
      </section>

      <PopularSection items={popularItems} onOpenItem={setActiveItem} limit={6} />

      <MealBuilder />

      <StorySection />

      <LocationSection />

      <ItemModal
        item={activeItem}
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
      />
    </>
  )
}
