import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getProductsByCategory, getProductSubCategory } from '@/data/products'
import ProductCard from '@/components/ProductCard'

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

export default function ShopWomen() {
  const [sortBy, setSortBy] = useState('Featured')
  const [showSort, setShowSort] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState('All Items')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  
  const products = getProductsByCategory('women')

  const subCategories = ['All Items', ...Array.from(new Set(products.map(p => getProductSubCategory(p)))).sort()]
  const brands = ['All Brands', ...Array.from(new Set(products.map(p => p.brand))).sort()]

  const filteredProducts = products.filter(p => {
    const matchSub = selectedSubCategory === 'All Items' || getProductSubCategory(p) === selectedSubCategory
    const matchBrand = selectedBrand === 'All Brands' || p.brand === selectedBrand
    return matchSub && matchBrand
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price
    if (sortBy === 'Price: High to Low') return b.price - a.price
    if (sortBy === 'Newest') return (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1)
    return 0
  })

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Hero Banner */}
      <div className="relative h-[360px] md:h-[440px] overflow-hidden">
        <img src="/category-women.jpg" alt="Women's Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="section-label text-gold mb-4">Collection</span>
          <h1 className="font-display text-display-md text-white mb-3">Women&apos;s Collection</h1>
          <p className="font-body text-body-lg text-white/80 max-w-lg">
            Elegant pieces for every occasion. From statement dresses to timeless accessories.
          </p>
        </div>
      </div>

      {/* Breadcrumbs + Filter Bar */}
      <div className="max-w-container mx-auto px-6 py-6">
        <div className="flex items-center gap-2 text-[13px] font-body text-slate mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop/women" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-navy font-medium">Women</span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-6 mb-8 border-b border-light-border pb-6">
          {/* Sub-Category Filter */}
          <div>
            <span className="font-body text-[12px] font-semibold uppercase tracking-wider text-navy block mb-3">Sub-Category</span>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
              {subCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  className={`px-4 py-2 rounded-full font-body text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 border ${
                    selectedSubCategory === cat
                      ? 'bg-navy text-gold border-navy shadow-md font-medium'
                      : 'bg-white text-navy border-light-border hover:border-gold hover:text-gold'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <span className="font-body text-[12px] font-semibold uppercase tracking-wider text-navy block mb-3">Brand</span>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-4 py-2 rounded-full font-body text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 border ${
                    selectedBrand === b
                      ? 'bg-navy text-gold border-navy shadow-md font-medium'
                      : 'bg-white text-navy border-light-border hover:border-gold hover:text-gold'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <p className="font-body text-[14px] text-slate">{filteredProducts.length} products</p>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 font-body text-[14px] text-navy hover:text-gold transition-colors"
            >
              Sort: {sortBy}
              <ChevronDown size={14} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-light-border shadow-lg rounded-sm z-10 min-w-[180px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSort(false) }}
                    className={`block w-full text-left px-4 py-2.5 font-body text-[13px] hover:bg-cream transition-colors ${sortBy === opt ? 'text-gold font-medium' : 'text-navy'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-body-lg text-slate mb-4">No products found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedSubCategory('All Items')
                setSelectedBrand('All Brands')
              }}
              className="px-6 py-2.5 bg-navy text-white hover:bg-gold hover:text-navy transition-colors font-body text-[14px] font-medium uppercase tracking-wider rounded-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
