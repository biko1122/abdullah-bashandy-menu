import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import SelectionBar from './components/SelectionBar/SelectionBar'
import SelectionDrawer from './components/SelectionDrawer/SelectionDrawer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Checkout from './pages/Checkout'
import './App.css'

/**
 * كل ما نغيّر صفحة نرجع لفوق،
 * ولو الرابط فيه #قسم بننزل على القسم ده بدل ما نرجع لفوق.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        /* تأخير بسيط عشان الصفحة الجديدة تكون اترسمت */
        const timer = setTimeout(
          () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          60
        )
        return () => clearTimeout(timer)
      }
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function App() {
  const [selectionOpen, setSelectionOpen] = useState(false)

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        تخطَّ للمحتوى
      </a>

      <ScrollManager />

      <Navbar onOpenSelection={() => setSelectionOpen(true)} />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* أي رابط تاني بيرجع للرئيسية */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />

      <SelectionBar onOpen={() => setSelectionOpen(true)} />

      <SelectionDrawer open={selectionOpen} onClose={() => setSelectionOpen(false)} />
    </div>
  )
}
