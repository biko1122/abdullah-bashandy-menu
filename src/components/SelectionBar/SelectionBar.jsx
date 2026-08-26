import { useSelection } from '../../context/SelectionContext'
import { formatNumber, formatPrice } from '../../utils/currency'
import './SelectionBar.css'

/**
 * الشريط العايم على الموبايل.
 * مش عربة تسوّق — ده مجرد ملخّص سريع للي اخترته وإجماليه.
 */
export default function SelectionBar({ onOpen }) {
  const { itemCount, total, isEmpty } = useSelection()

  return (
    <div className={`selbar ${isEmpty ? 'is-hidden' : ''}`} aria-hidden={isEmpty}>
      <button type="button" className="selbar__button" onClick={onOpen} tabIndex={isEmpty ? -1 : 0}>
        <span className="selbar__label">
          اختياراتك
          <span className="selbar__count num">{formatNumber(itemCount)}</span>
        </span>

        <span className="selbar__divider" aria-hidden="true" />

        <span className="selbar__total num">{formatPrice(total)}</span>
      </button>
    </div>
  )
}
