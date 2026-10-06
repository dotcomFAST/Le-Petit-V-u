import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Croissant, Instagram, Menu as MenuIcon, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { t } from './i18n.js'

export function Photo({ id, alt = '', className = '', position = 'center' }) {
  return <img className={`photo ${className}`} src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`} alt={alt} style={{ objectPosition: position }} loading="lazy" />
}

export function SectionLabel({ children, number }) {
  return <div className="section-label"><span>{number ?? '✳'}</span><span>{children}</span></div>
}

export function PageIntro({ eyebrow, title, intro, align = 'left' }) {
  return <header className={`page-intro page-intro-${align}`}><SectionLabel>{eyebrow}</SectionLabel><h1>{title.split('\n').map((line, i) => <span key={i}>{line}{i < title.split('\n').length - 1 && <br />}</span>)}</h1>{intro && <p>{intro}</p>}</header>
}

export function ButtonLink({ to, children, secondary = false, className = '' }) {
  return <Link className={`button-link ${secondary ? 'button-secondary' : ''} ${className}`} to={to}>{children}<ArrowRight size={16} strokeWidth={1.6} /></Link>
}

export function ProductCard({ item, language, onAdd, index = 0 }) {
  const [justAdded, setJustAdded] = useState(false)
  const add = () => { onAdd(item); setJustAdded(true); window.setTimeout(() => setJustAdded(false), 900) }
  return <article className={`product-card product-${index % 3}`}>
    <Link to="/order" className="product-image-wrap"><Photo id={item.image} alt={item.name[language]} /><span className="image-tape" /><span className="product-number">0{index + 1}</span></Link>
    <div className="product-copy"><div className="product-heading"><h3>{item.name[language]}</h3><span className="product-price">₴{item.price}</span></div><p>{item.description[language]}</p><button className="text-action" onClick={add} aria-label={`${t(language, 'common.add')} ${item.name[language]}`}>{justAdded ? t(language, 'common.added') : t(language, 'common.add')} {justAdded ? '✓' : <Plus size={15} />}</button></div>
  </article>
}

export function ArticleCard({ article, language, index = 0 }) {
  return <article className={`article-card article-card-${index % 3}`}><Link to={`/journal/${article.slug}`} className="article-image-wrap"><Photo id={article.image} alt={article.title[language]} /><span className="photo-caption">Le Petit Vœu · carnet no. 0{index + 1}</span></Link><div className="article-copy"><span className="hand-label">{article.category[language]}</span><h3><Link to={`/journal/${article.slug}`}>{article.title[language]}</Link></h3><p>{article.excerpt[language]}</p><Link className="text-action" to={`/journal/${article.slug}`}>{t(language, 'journal.article')} <ArrowUpRight size={15} /></Link></div></article>
}

export function LocationCard({ location, language, compact = false }) {
  return <article className={`location-card ${compact ? 'location-compact' : ''}`}><div className="location-index">{String(location.id).padStart(2, '0')}</div><div className="location-main"><div className="location-title-row"><h3>{location.city}</h3><span className={`format-tag ${location.format}`}>{t(language, `common.${location.format}`)}</span></div><p>{location.address[language]}</p><small>{location.countryName[language]}</small></div><div className="location-details"><span>{t(language, 'common.hours')}</span><strong>{location.hours}</strong></div>{location.format === 'cafe' && <Link className="location-reserve" to={`/reservations?location=${location.id}`}>{t(language, 'common.reserve')} <ArrowUpRight size={15} /></Link>}</article>
}

export function CartDrawer({ open, onClose, items, language, onChange }) {
  const lines = Object.values(items)
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  if (!open) return null
  return <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="cart-drawer" aria-label={t(language, 'common.cart')}><div className="drawer-head"><div><span className="hand-label">Le petit panier</span><h2>{t(language, 'common.cart')}</h2></div><button className="icon-button" onClick={onClose} aria-label={t(language, 'common.close')}><X /></button></div>{lines.length ? <><div className="drawer-items">{lines.map(({ product, quantity }) => <div className="drawer-line" key={product.id}><Photo id={product.image} alt="" /><div className="drawer-line-copy"><strong>{product.name[language]}</strong><span>₴{product.price * quantity}</span><div className="quantity-control"><button onClick={() => onChange(product.id, -1)} aria-label="Зменшити кількість"><Minus size={13} /></button><span>{quantity}</span><button onClick={() => onChange(product.id, 1)} aria-label="Збільшити кількість"><Plus size={13} /></button></div></div></div>)}</div><div className="drawer-bottom"><div className="total-row"><span>{t(language, 'common.total')}</span><strong>₴{total}</strong></div><Link onClick={onClose} className="button-link" to="/order">{t(language, 'nav.order')} <ArrowRight size={16} /></Link></div></> : <p className="empty-cart">{t(language, 'common.empty')}</p>}</aside></div>
}

export function Header({ language, setLanguage, count, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [['/', 'home'], ['/menu', 'menu'], ['/locations', 'places'], ['/about', 'story'], ['/journal', 'journal'], ['/contact', 'contact'], ['/order', 'order'], ['/reservations', 'reserve']]
  return <header className="site-header"><div className="header-inner"><button className="mobile-menu-button icon-button" aria-label="Відкрити меню" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <MenuIcon />}</button><Link className="wordmark" to="/" onClick={() => setMenuOpen(false)}><span>Le Petit <i>Vœu</i></span><small>BOULANGERIE · CAFÉ</small></Link><nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>{links.map(([to, key], i) => <NavLink key={key} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}><span className="nav-folio">0{i + 1}</span>{t(language, `nav.${key}`)}</NavLink>)}</nav><div className="header-actions"><Link className="header-order-link" to="/order">{t(language, 'nav.order')} <ArrowRight size={14} /></Link><div className="language-switch" aria-label="Мова"><span className="sr-only">Мова</span>{['uk', 'en', 'fr'].map((locale) => <button key={locale} onClick={() => setLanguage(locale)} className={language === locale ? 'active' : ''} aria-pressed={language === locale}>{locale.toUpperCase()}</button>)}</div><button className="cart-trigger icon-button" onClick={onCart} aria-label={`${t(language, 'common.cart')}, ${count}`}><ShoppingBag size={19} strokeWidth={1.5} /><span>{count}</span></button></div></div><div className="header-bottomline" /></header>
}

export function Footer({ language, setLanguage }) {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const nav = [['/menu', 'menu'], ['/locations', 'places'], ['/about', 'story'], ['/journal', 'journal'], ['/contact', 'contact']]
  return <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><Link className="wordmark footer-wordmark" to="/"><span>Le Petit <i>Vœu</i></span><small>BOULANGERIE · CAFÉ</small></Link><p>{t(language, 'footer.line')}<br /><span>{t(language, 'footer.note')}</span></p><div className="footer-social"><a href="https://instagram.com" aria-label="Instagram"><Instagram size={18} /></a><a href="https://facebook.com" aria-label="Facebook"><ArrowUpRight size={17} /></a><span>@lepetitvoeu</span></div></div><div className="footer-nav"><span className="footer-overline">À bientôt · До зустрічі</span>{nav.map(([to, key]) => <Link key={to} to={to}>{t(language, `nav.${key}`)} <ArrowUpRight size={13} /></Link>)}<div className="footer-languages">{['uk', 'en', 'fr'].map((locale) => <button key={locale} className={language === locale ? 'active' : ''} onClick={() => setLanguage(locale)}>{locale.toUpperCase()}</button>)}</div></div><form className="newsletter" onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}><span className="hand-label">Une petite carte postale</span><h3>{t(language, 'footer.newsletter')}</h3><p>{subscribed ? t(language, 'footer.thanks') : t(language, 'footer.newsletterText')}</p>{!subscribed && <div className="newsletter-input"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t(language, 'footer.email')} aria-label={t(language, 'footer.email')} required /><button aria-label={t(language, 'footer.subscribe')}><ArrowRight size={18} /></button></div>}<span className="postcard-stamp">LPV<br />2016</span></form></div><div className="footer-bottom"><span>© 2025 Le Petit Vœu · {t(language, 'footer.legal')}</span><span>Fait avec patience <Croissant size={14} /></span></div></footer>
}

export function BackToTop() {
  return <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="На початок сторінки"><ArrowDownRight size={17} /></button>
}