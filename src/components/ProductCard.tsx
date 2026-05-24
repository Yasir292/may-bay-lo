import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/data/products'
import { useCart } from '@/store/cart'

interface ProductCardProps {
  product: Product
  narrow?: boolean
}

export default function ProductCard({ product, narrow = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const addItem = useCart((s) => s.addItem)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultSize = product.sizes[0] || 'One Size'
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: defaultSize,
    })
  }

  const handleQuickInquiry = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Hello May Bay Lo! I would like to inquire about this product:\n\n*${product.name}*\nBrand: ${product.brand}\nCode: ${product.code}\n\nCould you please confirm availability? Thank you!`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/447495775341?text=${encoded}`, '_blank')
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`bg-white border border-light-border rounded-sm overflow-hidden transition-shadow duration-400 ${
          hovered ? 'shadow-card-hover' : 'shadow-card'
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden ${
            narrow ? 'aspect-[3/4]' : 'aspect-[4/5]'
          }`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isSale && (
              <span className="bg-gold text-navy font-body font-medium text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
                Sale
              </span>
            )}
            {product.isNew && (
              <span className="bg-navy text-gold font-body font-medium text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
                New
              </span>
            )}
            {product.id.startsWith('MBL-') && (
              <span className="bg-charcoal text-gold font-body font-medium text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm border border-gold/30 flex items-center gap-1">
                Trending 🔥
              </span>
            )}
          </div>
          {/* Quick WhatsApp Inquiry */}
          <AnimatePresence>
            {hovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleQuickInquiry}
                className="absolute top-3 right-3 bg-[#25D366] hover:bg-[#20ba5a] text-white p-2.5 rounded-full shadow-lg z-20 transition-colors"
                title="Quick WhatsApp Inquiry"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.63 2.025 14.16 1 11.533 1c-5.442 0-9.866 4.372-9.87 9.802 0 1.706.46 3.375 1.332 4.837l-.982 3.585 3.634-.97z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
          {/* Quick Add */}
          <motion.button
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
            }}
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-gold text-navy font-body font-semibold text-[13px] uppercase tracking-[0.08em] py-3 flex items-center justify-center gap-2 hover:bg-gold-light transition-colors duration-300 z-10"
          >
            <ShoppingBag size={16} />
            Add to Selection
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-body text-[13px] text-slate mb-1">{product.brand}</p>
          <h3 className="font-body font-medium text-[15px] text-navy truncate mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body text-[13px] text-gold uppercase tracking-[0.08em] font-semibold">
              Inquire to Order
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
