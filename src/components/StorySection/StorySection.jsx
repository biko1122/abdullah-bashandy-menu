import FoodImage from '../FoodImage/FoodImage'
import { PatternStrip } from '../Ornaments/Ornaments'
import { restaurant } from '../../data/restaurant'
import './StorySection.css'

/**
 * "من قلب السيدة زينب" — القسم اللي بيدّي الموقع شخصيته.
 * حكاية قصيرة… مش صفحة "من نحن" كاملة.
 */
export default function StorySection() {
  return (
    <section className="story" aria-labelledby="story-title">
      <PatternStrip className="story__top-pattern" height={14} opacity={0.35} />

      <div className="story__inner shell">
        <div className="story__visual">
          <FoodImage
            folder="atmosphere"
            src="shopfront.jpg"
            alt="واجهة المحل في السيدة زينب"
            label="السيدة زينب"
            hue={30}
          />
        </div>

        <div className="story__text">
          <p className="story__kicker">من قلب السيدة زينب</p>

          <h2 className="story__title" id="story-title">
            أكل مصري بسيط…
            <br />
            بس معمول صح.
          </h2>

          <p className="story__body">
            من أكل الشارع المصري اللي بنحبه — فول متدمس من بدري، وطعمية بتتقلى قدامك —
            لحد أطباق الجريل والبرجر.
          </p>

          <p className="story__body">منيو بسيطة، أكل كتير، وطعم يتعرف.</p>

          <p className="story__sign">
            <span className="story__sign-name">{restaurant.name}</span>
            <span className="story__sign-note">{restaurant.tagline}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
