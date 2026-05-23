import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/store/cart'
import MiniCart from './MiniCart'

const shopCategories = [
  { name: 'Men', path: '/shop/men', image: '/category-men.jpg' },
  { name: 'Women', path: '/shop/women', image: '/category-women.jpg' },
  { name: 'Children', path: '/shop/children', image: '/category-children.jpg' },
  { name: 'Accessories', path: '/shop/accessories', image: '/category-accessories.jpg' },
]

const topBrands = [
  { name: 'Rolex', path: '/brand/Rolex' },
  { name: 'Prada', path: '/brand/Prada' },
  { name: 'Gucci', path: '/brand/Gucci' },
  { name: 'Dior', path: '/brand/Dior' },
  { name: 'Burberry', path: '/brand/Burberry' },
  { name: 'Louis Vuitton', path: '/brand/Louis Vuitton' },
  { name: 'Hermès', path: '/brand/Hermes' },
  { name: 'Stone Island', path: '/brand/Stone Island' },
  { name: 'Bottega Veneta', path: '/brand/Bottega Veneta' },
  { name: 'Chanel', path: '/brand/Chanel' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const navigate = useNavigate()
  const cartItems = useCart((s) => s.items)
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const shopRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false)
      }
      if (brandsRef.current && !brandsRef.current.contains(e.target as Node)) {
        setBrandsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="fixed top-0 left-0 right-0 z-50 h-[80px] flex items-center transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(10, 22, 40, 0.98)' : 'rgba(10, 22, 40, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="w-full max-w-container-wide mx-auto px-6 flex items-center justify-between">
          {/* Left: Shop dropdown + nav links */}
          <div className="hidden md:flex items-center gap-8">
            <div ref={shopRef} className="relative">
              <button
                onClick={() => setShopOpen(!shopOpen)}
                onMouseEnter={() => setShopOpen(true)}
                className="flex items-center gap-1 font-body font-medium text-[14px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors duration-300"
              >
                Shop
                <motion.span
                  animate={{ rotate: shopOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    onMouseLeave={() => setShopOpen(false)}
                    className="absolute top-full left-0 mt-2 w-[540px] bg-charcoal rounded-sm shadow-2xl border border-dark-border overflow-hidden"
                  >
                    <div className="grid grid-cols-4 gap-0">
                      {shopCategories.map((cat, i) => (
                        <motion.button
                          key={cat.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            navigate(cat.path)
                            setShopOpen(false)
                          }}
                          className="group flex flex-col items-center p-4 hover:bg-navy transition-colors duration-200 cursor-pointer text-left w-full"
                        >
                          <div className="w-full aspect-[3/4] overflow-hidden rounded-sm mb-3">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <span className="font-body font-medium text-[13px] text-white uppercase tracking-[0.06em] group-hover:text-gold transition-colors">
                            {cat.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brands Dropdown */}
            <div ref={brandsRef} className="relative">
              <button
                onClick={() => setBrandsOpen(!brandsOpen)}
                onMouseEnter={() => setBrandsOpen(true)}
                className="flex items-center gap-1 font-body font-medium text-[14px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors duration-300"
              >
                Brands
                <motion.span
                  animate={{ rotate: brandsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {brandsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    onMouseLeave={() => setBrandsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-[220px] bg-charcoal rounded-sm shadow-2xl border border-dark-border overflow-hidden"
                  >
                    <div className="flex flex-col py-2">
                      {topBrands.map((brand, i) => (
                        <motion.button
                          key={brand.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => {
                            navigate(brand.path)
                            setBrandsOpen(false)
                          }}
                          className="w-full text-left px-5 py-2.5 font-body font-medium text-[13px] text-white/95 hover:text-gold hover:bg-navy transition-all duration-200"
                        >
                          {brand.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              to="/about"
              className="font-body font-medium text-[14px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="font-body font-medium text-[14px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src="/logo.png" alt="May Bay Lo" className="h-[58px] w-auto object-contain" />
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-5">
            <button className="text-white hover:text-gold transition-colors duration-300">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setMiniCartOpen(true)}
              className="relative text-white hover:text-gold transition-colors duration-300"
              aria-label="View Selection"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-gold text-navy text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="hidden md:block text-white hover:text-gold transition-colors duration-300">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white hover:text-gold transition-colors duration-300"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[80px] left-0 right-0 bg-navy border-t border-dark-border md:hidden overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {shopCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setMobileOpen(false)}
                    className="font-body font-medium text-[15px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors py-2 border-b border-dark-border"
                  >
                    {cat.name}
                  </Link>
                ))}
                
                {/* Mobile Brands Collapsible */}
                <div>
                  <button
                    onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                    className="flex justify-between items-center w-full font-body font-medium text-[15px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors py-2 border-b border-dark-border text-left"
                  >
                    <span>Brands</span>
                    <motion.span animate={{ rotate: mobileBrandsOpen ? 180 : 0 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {mobileBrandsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-navy/50 pl-4"
                      >
                        {topBrands.map((brand) => (
                          <Link
                            key={brand.name}
                            to={brand.path}
                            onClick={() => setMobileOpen(false)}
                            className="block font-body text-[14px] text-white/80 hover:text-gold transition-colors py-2 border-b border-dark-border/40 last:border-b-0"
                          >
                            {brand.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  to="/about"
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-medium text-[15px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors py-2 border-b border-dark-border"
                >
                  About
                </Link>
                <Link
                  to="/shipping-returns"
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-medium text-[15px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors py-2 border-b border-dark-border"
                >
                  Shipping & Returns
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-medium text-[15px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors py-2"
                >
                  Contact
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    setMiniCartOpen(true)
                  }}
                  className="font-body font-medium text-[15px] text-white uppercase tracking-[0.06em] hover:text-gold transition-colors py-2 border-b border-dark-border text-left"
                >
                  Selection ({totalItems} items)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* MiniCart Drawer */}
      <MiniCart isOpen={miniCartOpen} onClose={() => setMiniCartOpen(false)} />
    </>
  )
}
