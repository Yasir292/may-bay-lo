import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
          <div className="absolute top-3 left-3 flex flex-col gap-2">
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
          </div>
          {/* Quick Add */}
          <motion.button
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
            }}
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-gold text-navy font-body font-semibold text-[13px] uppercase tracking-[0.08em] py-3 flex items-center justify-center gap-2 hover:bg-gold-light transition-colors duration-300"
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
