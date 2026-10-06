import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CartDrawer, Footer, Header } from './components.jsx'
import { AboutPage, ArticlePage, ContactPage, HomePage, JournalPage, LocationsPage, MenuPage, NotFoundPage, OrderPage, ReservationPage } from './pages.jsx'
import { products } from './data.js'

function PageEffects() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const targets = document.querySelectorAll('main section, main .page-intro')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.08 })
    targets.forEach((target) => { target.classList.add('reveal-item'); observer.observe(target) })
    return () => observer.disconnect()
  }, [location.pathname])
  return null
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('petit-voeu-cart') || '{}')
    return Object.fromEntries(Object.entries(saved).filter(([id, line]) => products.some((product) => product.id === id) && Number.isInteger(line.quantity) && line.quantity > 0).map(([id, line]) => [id, { product: products.find((product) => product.id === id), quantity: line.quantity }]))
  } catch { return {} }
}

export default function App() {
  const [language, setLanguageState] = useState(() => localStorage.getItem('petit-voeu-language') || 'uk')
  const [cart, setCart] = useState(readCart)
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { localStorage.setItem('petit-voeu-cart', JSON.stringify(Object.fromEntries(Object.entries(cart).map(([id, line]) => [id, { quantity: line.quantity }])))) }, [cart])
  useEffect(() => { document.documentElement.lang = language }, [language])

  const setLanguage = (locale) => {
    setLanguageState(locale)
    localStorage.setItem('petit-voeu-language', locale)
  }
  const addItem = (product) => setCart((current) => ({ ...current, [product.id]: { product, quantity: (current[product.id]?.quantity || 0) + 1 } }))
  const changeQuantity = (id, amount) => setCart((current) => {
    const nextQuantity = (current[id]?.quantity || 0) + amount
    if (nextQuantity <= 0) {
      const next = { ...current }
      delete next[id]
      return next
    }
    return { ...current, [id]: { ...current[id], quantity: nextQuantity } }
  })
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)

  return <>
    <PageEffects />
    <Header language={language} setLanguage={setLanguage} count={count} onCart={() => setCartOpen(true)} />
    <Routes>
      <Route path="/" element={<HomePage language={language} onAdd={addItem} />} />
      <Route path="/menu" element={<MenuPage language={language} onAdd={addItem} />} />
      <Route path="/locations" element={<LocationsPage language={language} />} />
      <Route path="/about" element={<AboutPage language={language} />} />
      <Route path="/journal" element={<JournalPage language={language} />} />
      <Route path="/journal/:slug" element={<ArticleRoute language={language} />} />
      <Route path="/order" element={<OrderPage language={language} cart={cart} onAdd={addItem} onChange={changeQuantity} onClear={() => setCart({})} />} />
      <Route path="/reservations" element={<ReservationPage key={location.search} language={language} />} />
      <Route path="/contact" element={<ContactPage language={language} />} />
      <Route path="*" element={<NotFoundPage language={language} />} />
    </Routes>
    <Footer language={language} setLanguage={setLanguage} />
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} language={language} onChange={changeQuantity} />
  </>
}

function ArticleRoute({ language }) {
  const location = useLocation()
  return <ArticlePage key={location.pathname} language={language} slug={location.pathname.split('/').pop()} />
}