import { Link } from 'react-router-dom'
import Sheet from '../Sheet/Sheet'
import QuantityControl from '../QuantityControl/QuantityControl'
import { Divider } from '../Ornaments/Ornaments'
import { useSelection } from '../../context/SelectionContext'
import { formatNumber, formatPrice } from '../../utils/currency'
import { getCategory } from '../../data/categories'
import './SelectionDrawer.css'

/**
 * "اختياراتك" — ملخّص اللي المستخدم اختاره وإجمالي الحساب.
 *
 * مفيش هنا: دفع، تأكيد طلب، توصيل، عنوان، ولا أي حاجة من دي.
 * الحسبة كلها: مجموع (سعر الصنف × الكمية).
 */
export default function SelectionDrawer({ open, onClose }) {
  const { lines, total, itemCount, isEmpty, increaseQuantity, decreaseQuantity, removeItem, clearSelection } =
    useSelection()

  const handleClear = () => {
    clearSelection()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="drawer"
      labelledBy="selection-title"
      footer={
        isEmpty ? null : (
          <div className="seldrawer__footer">
            <div className="seldrawer__total-row">
              <span className="seldrawer__total-label">الإجمالي</span>
              <span className="seldrawer__total-value num">{formatPrice(total)}</span>
            </div>

            <p className="seldrawer__disclaimer">
              الحساب تقديري حسب أسعار المنيو — مفيش أي طلب بيتبعت من هنا.
            </p>

            <div className="seldrawer__actions">
              <button type="button" className="btn btn--ghost" onClick={handleClear}>
                مسح الاختيارات
              </button>
              <button type="button" className="btn btn--dark" onClick={onClose}>
                كمّل تصفح
              </button>
            </div>
          </div>
        )
      }
    >
      <div className="seldrawer">
        <header className="seldrawer__head">
          <h2 className="seldrawer__title" id="selection-title">
            اختياراتك
          </h2>
          {!isEmpty ? (
            <p className="seldrawer__sub">
              <span className="num">{formatNumber(itemCount)}</span> حاجة في الطبق
            </p>
          ) : null}
          <Divider className="seldrawer__divider" />
        </header>

        {isEmpty ? (
          <div className="seldrawer__empty">
            <p className="seldrawer__empty-emoji" aria-hidden="true">
              👀
            </p>
            <p className="seldrawer__empty-title">لسه مفيش اختيارات</p>
            <p className="seldrawer__empty-text">ابدأ اختار اللي نفسك فيه من المنيو.</p>
            <Link to="/menu" className="btn" onClick={onClose}>
              شوف المنيو
            </Link>
          </div>
        ) : (
          <ul className="seldrawer__list">
            {lines.map((line) => {
              const category = getCategory(line.item.category)
              return (
                <li
                  className="selline"
                  key={line.key}
                  style={{ '--line-hue': category?.accent ?? 30 }}
                >
                  <div className="selline__info">
                    <p className="selline__name">{line.item.name}</p>
                    {line.choiceSummary ? (
                      <p className="selline__choices">{line.choiceSummary}</p>
                    ) : null}
                    <p className="selline__unit num">{formatPrice(line.unitPrice)} للواحدة</p>
                  </div>

                  <div className="selline__side">
                    <p className="selline__total num">{formatPrice(line.lineTotal)}</p>

                    <div className="selline__controls">
                      <QuantityControl
                        size="sm"
                        value={line.quantity}
                        onIncrease={() => increaseQuantity(line.key)}
                        onDecrease={() => decreaseQuantity(line.key)}
                        label={`كمية ${line.item.name}`}
                        minusLabel={`قلّل ${line.item.name}`}
                        plusLabel={`زوّد ${line.item.name}`}
                      />

                      <button
                        type="button"
                        className="selline__remove"
                        onClick={() => removeItem(line.key)}
                        aria-label={`شيل ${line.item.name}`}
                      >
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                          <path
                            d="M3 4.5h10M6.5 4.5V3.2h3v1.3M5 4.5l.6 8h4.8l.6-8"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Sheet>
  )
}
