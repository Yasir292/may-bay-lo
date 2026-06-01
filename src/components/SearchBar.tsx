import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import type { Product } from '@/data/products'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      setResults([])
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const q = query.toLowerCase()
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    )
    setResults(filtered.slice(0, 6)) // limit to 6 results
  }, [query])

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`)
    onClose()
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleProductClick(results[0].id)
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 inset-x-0 bg-white border-b border-light-border shadow-xl z-50"
          >
            <div className="max-w-container mx-auto px-6 py-6">
              <div className="flex items-center justify-between gap-4 border-b border-light-border pb-4">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
                  <Search size={22} className="text-slate" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by designer, product name, denim, activewear..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-navy font-body text-body-lg placeholder-slate focus:outline-none focus:ring-0"
                  />
                </form>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-cream text-navy rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Suggestions & Results */}
              <div className="py-6">
                {results.length > 0 ? (
                  <div>
                    <h3 className="font-body text-[12px] font-semibold uppercase tracking-wider text-slate mb-4">
                      Products found ({results.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-4 p-2.5 rounded-md hover:bg-cream cursor-pointer transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 bg-cream rounded-sm overflow-hidden flex-shrink-0 border border-light-border">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-product.webp'
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-body text-[11px] font-bold uppercase tracking-wider text-gold block">
                              {product.brand}
                            </span>
                            <h4 className="font-body text-[14px] font-medium text-navy truncate">
                              {product.name}
                            </h4>
                            <span className="font-body text-[12px] text-slate capitalize">
                              {product.category} &bull; {product.subCategory || 'Collection'}
                            </span>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-slate opacity-0 group-hover:opacity-100 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : query.trim() ? (
                  <div className="text-center py-8">
                    <p className="font-body text-body-md text-slate">
                      No results found for &ldquo;<span className="text-navy font-semibold">{query}</span>&rdquo;
                    </p>
                    <p className="font-body text-[13px] text-slate mt-1">
                      Try searching for designers like &ldquo;Gucci&rdquo;, &ldquo;Dior&rdquo;, or categories like &ldquo;denim&rdquo;.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-body text-[12px] font-semibold uppercase tracking-wider text-slate mb-4">
                      Suggested Categories & Searches
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {['Gucci', 'Prada', 'Burberry', 'Denim', 'Loungewear', 'Activewear', 'Knitwear', 'Formalwear', 'Watches', 'Bags'].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-4 py-2 bg-cream text-navy hover:bg-gold hover:text-navy rounded-full font-body text-[13px] transition-all duration-300"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
