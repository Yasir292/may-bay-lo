import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getProductsByBrand, getProductSubCategory } from '@/data/products'
import ProductCard from '@/components/ProductCard'

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

export default function ShopBrand() {
  const { brandName } = useParams<{ brandName: string }>()
  const decodedBrandName = decodeURIComponent(brandName || '')
  
  const [sortBy, setSortBy] = useState('Featured')
  const [showSort, setShowSort] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState('All Items')
  
  const products = getProductsByBrand(decodedBrandName)

  const subCategories = ['All Items', ...Array.from(new Set(products.map(p => getProductSubCategory(p)))).sort()]

  const filteredProducts = products.filter(p => {
    return selectedSubCategory === 'All Items' || getProductSubCategory(p) === selectedSubCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price
    if (sortBy === 'Price: High to Low') return b.price - a.price
    if (sortBy === 'Newest') return (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1)
    return 0
  })

  return (
    <div className="min-h-[100dvh] bg-cream pt-24">
      <div className="max-w-container mx-auto px-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] font-body text-slate mb-6">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate">Brands</span>
          <span>/</span>
          <span className="text-navy font-medium">{decodedBrandName}</span>
        </div>

        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <span className="section-label text-gold mb-2 block">Luxury Brand</span>
          <h1 className="font-display text-[36px] md:text-[48px] text-navy font-light leading-tight">
            {decodedBrandName}
          </h1>
          <p className="font-body text-body-md text-slate max-w-lg mt-2">
            Discover our curated collection of premium designer pieces from {decodedBrandName}.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-6 mb-8 border-b border-light-border pb-6">
          {/* Sub-Category Filter */}
          <div>
            <span className="font-body text-[12px] font-semibold uppercase tracking-wider text-navy block mb-3">Filter by Sub-Category</span>
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
            <p className="font-body text-body-lg text-slate mb-4">No products found for this brand.</p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-navy text-white hover:bg-gold hover:text-navy transition-colors font-body text-[14px] font-medium uppercase tracking-wider rounded-sm"
            >
              Back to Home
            </Link>
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
