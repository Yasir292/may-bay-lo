import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Heart } from 'lucide-react'
import { useCart } from '@/store/cart'
import MiniCart from './MiniCart'
import SearchBar from './SearchBar'

const shopCategories = [
  { name: 'Men', path: '/shop/men', image: '/category-men.webp' },
  { name: 'Women', path: '/shop/women', image: '/category-women.webp' },
  { name: 'Children', path: '/shop/children', image: '/category-children.webp' },
  { name: 'Accessories', path: '/shop/accessories', image: '/category-accessories.webp' },
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
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false)
  const [miniCartOpen, setMiniCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const cartItems = useCart((s) => s.items)
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const brandsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (brandsRef.current && !brandsRef.current.contains(e.target as Node)) {
        setBrandsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-white transition-all duration-300">
        {/* Level 1: Utility Strip */}
        <div className="w-full bg-[#1c1c1c] text-white text-[11px] font-body py-1.5 px-6 border-b border-[#2d2d2d] hidden md:block">
          <div className="max-w-container-wide mx-auto flex justify-between items-center">
            <span>FREE UK DELIVERY ON ORDERS OVER £150</span>
            <div className="flex gap-4 items-center text-white/70">
              <Link to="/shipping-returns" className="hover:text-white transition-colors">Help</Link>
              <span>|</span>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              <span>|</span>
              <span className="cursor-pointer hover:text-white transition-colors">Store Finder</span>
            </div>
          </div>
        </div>

        {/* Level 2: Main Header Row */}
        <div className="w-full h-[70px] border-b border-[#e5e5e5] flex items-center px-6 bg-white">
          <div className="w-full max-w-container-wide mx-auto flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.webp" alt="MAY BAY LO" className="h-[40px] md:h-[50px] w-auto object-contain" />
            </Link>

            {/* Embedded Search Input (triggers full Search Modal on focus/click) */}
            <div className="hidden md:flex flex-1 max-w-[540px] relative">
              <div 
                onClick={() => setSearchOpen(true)}
                className="w-full h-[40px] px-4 bg-[#f2f2f2] border border-transparent rounded-sm flex items-center justify-between text-slate cursor-pointer hover:border-slate/30 transition-all"
              >
                <span className="font-body text-[13px]">Search product, brand, denim...</span>
                <Search size={18} className="text-slate" />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              {/* Mobile Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden text-[#1a1a1a] hover:text-[#5a5a5a] transition-colors"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Account */}
              <button className="text-[#1a1a1a] hover:text-[#5a5a5a] transition-colors flex items-center gap-1.5 font-body text-[13px]">
                <User size={20} strokeWidth={1.5} />
                <span className="hidden lg:inline text-navy font-semibold uppercase tracking-wider">Sign In</span>
              </button>

              {/* Favorites (Heart) */}
              <button className="text-[#1a1a1a] hover:text-[#5a5a5a] transition-colors">
                <Heart size={20} strokeWidth={1.5} />
              </button>

              {/* Cart Bag */}
              <button
                onClick={() => setMiniCartOpen(true)}
                className="relative text-[#1a1a1a] hover:text-[#5a5a5a] transition-colors"
                aria-label="View Bag"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-[#1a1a1a] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-[#1a1a1a] hover:text-[#5a5a5a] transition-colors"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Level 3: Department Nav Links Row */}
        <div className="w-full h-[44px] bg-white border-b border-[#e5e5e5] hidden md:flex items-center px-6">
          <div className="max-w-container-wide mx-auto flex items-center justify-start gap-8 w-full">
            <Link
              to="/new-in"
              className="font-body font-bold text-[13px] text-[#191919] uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-[#191919] py-2 transition-all"
            >
              New In
            </Link>
            <Link
              to="/shop/women"
              className="font-body font-bold text-[13px] text-[#191919] uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-[#191919] py-2 transition-all"
            >
              Women
            </Link>
            <Link
              to="/shop/men"
              className="font-body font-bold text-[13px] text-[#191919] uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-[#191919] py-2 transition-all"
            >
              Men
            </Link>
            <Link
              to="/shop/children"
              className="font-body font-bold text-[13px] text-[#191919] uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-[#191919] py-2 transition-all"
            >
              Children
            </Link>
            <Link
              to="/shop/accessories"
              className="font-body font-bold text-[13px] text-[#191919] uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-[#191919] py-2 transition-all"
            >
              Accessories
            </Link>

            {/* Brands Dropdown Menu */}
            <div ref={brandsRef} className="relative">
              <button
                onClick={() => setBrandsOpen(!brandsOpen)}
                className="flex items-center gap-1 font-body font-bold text-[13px] text-[#191919] uppercase tracking-[0.08em] border-b-2 border-transparent hover:border-[#191919] py-2 transition-all"
              >
                Brands
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {brandsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setBrandsOpen(false)}
                    className="absolute top-full left-0 mt-1 w-[200px] bg-white rounded-sm shadow-xl border border-[#e5e5e5] overflow-hidden"
                  >
                    <div className="flex flex-col py-1.5">
                      {topBrands.map((brand) => (
                        <button
                          key={brand.name}
                          onClick={() => {
                            navigate(brand.path)
                            setBrandsOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 font-body font-medium text-[13px] text-[#1a1a1a] hover:bg-[#f5f5f5] hover:text-[#191919] transition-all"
                        >
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[70px] left-0 right-0 bg-white border-t border-[#e5e5e5] md:hidden overflow-hidden shadow-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {shopCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setMobileOpen(false)}
                    className="font-body font-bold text-[14px] text-[#1a1a1a] uppercase tracking-[0.06em] hover:text-[#5a5a5a] transition-colors py-2 border-b border-[#e5e5e5]"
                  >
                    {cat.name}
                  </Link>
                ))}
                
                {/* Mobile Brands Collapsible */}
                <div>
                  <button
                    onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                    className="flex justify-between items-center w-full font-body font-bold text-[14px] text-[#1a1a1a] uppercase tracking-[0.06em] hover:text-[#5a5a5a] transition-colors py-2 border-b border-[#e5e5e5] text-left"
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
                        className="overflow-hidden bg-[#f9f9f9] pl-4"
                      >
                        {topBrands.map((brand) => (
                          <Link
                            key={brand.name}
                            to={brand.path}
                            onClick={() => setMobileOpen(false)}
                            className="block font-body text-[13px] text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors py-2 border-b border-[#e5e5e5]/40 last:border-b-0"
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
                  className="font-body font-bold text-[14px] text-[#1a1a1a] uppercase tracking-[0.06em] py-2 border-b border-[#e5e5e5]"
                >
                  About
                </Link>
                <Link
                  to="/shipping-returns"
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-bold text-[14px] text-[#1a1a1a] uppercase tracking-[0.06em] py-2 border-b border-[#e5e5e5]"
                >
                  Shipping & Returns
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-bold text-[14px] text-[#1a1a1a] uppercase tracking-[0.06em] py-2"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacing element to offset the fixed header */}
      <div className="h-[70px] md:h-[146px]" />

      {/* MiniCart Drawer */}
      <MiniCart isOpen={miniCartOpen} onClose={() => setMiniCartOpen(false)} />

      {/* Search Bar Modal */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
