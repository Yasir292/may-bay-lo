import { useState, useCallback, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Truck, Shield, RotateCcw, X, ZoomIn, MessageCircle, Check } from 'lucide-react'
import { getProductById, products } from '@/data/products'
import { useCart } from '@/store/cart'
import ProductCard from '@/components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = getProductById(id || '')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const addItem = useCart((s) => s.addItem)

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1)
    setSelectedSize('')
    setShowToast(false)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-[100dvh] bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-display-sm text-navy mb-4">
            Product Not Found
          </h1>
          <Link to="/" className="text-gold hover:underline font-body">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const size = selectedSize || product.sizes[0] || 'One Size'
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = useCallback(() => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size,
      quantity,
    })
    setShowToast(true)
    const timer = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timer)
  }, [addItem, product, size, quantity])

  const handleWhatsAppInquiry = () => {
    const sizeStr = size ? `Size: ${size}` : ''
    const quantityStr = quantity > 1 ? `Quantity: ${quantity}` : ''
    const message = `Hello May Bay Lo! I would like to order the following product:\n\n*${product.name}*\nBrand: ${product.brand}\nCode: ${product.code}\n${sizeStr}\n${quantityStr}\n\nCould you please confirm availability and details? Thank you!`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/447495775341?text=${encodedMessage}`, '_blank')
  }



  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Added to Cart Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-[88px] left-1/2 z-[90] bg-navy text-white px-6 py-3 rounded-sm shadow-xl flex items-center gap-3"
          >
            <Check size={18} className="text-gold" />
            <span className="font-body text-[14px]">
              <span className="font-medium">{product.name}</span> added to Selection
            </span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white/60 hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <div className="max-w-container mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-[13px] font-body text-slate">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/shop/${product.category}`}
            className="hover:text-gold transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-navy font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <div
              className="aspect-[4/5] bg-white border border-light-border rounded-sm overflow-hidden cursor-zoom-in relative group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                  <ZoomIn size={20} className="text-navy" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="flex flex-col"
          >
            <p className="font-accent italic text-[16px] text-gold mb-2">
              {product.brand}
            </p>
            <h1 className="font-display text-display-sm text-navy mb-1">
              {product.name}
            </h1>
            <p className="text-slate text-xs font-body mb-4 tracking-wider uppercase opacity-80">
              Code: {product.code}
            </p>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-body font-semibold text-price text-gold uppercase tracking-[0.08em]">
                Inquire for Price
              </span>
            </div>

            <p className="font-body text-body text-slate leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size */}
            {product.sizes.length > 1 && (
              <div className="mb-6">
                <p className="font-body font-medium text-[13px] text-navy uppercase tracking-[0.08em] mb-3">
                  Size: {size}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] h-[48px] px-3 font-body text-[14px] border transition-all duration-200 ${
                        size === s
                          ? 'border-gold bg-gold text-navy'
                          : 'border-light-border text-navy hover:border-gold'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-body font-medium text-[13px] text-navy uppercase tracking-[0.08em] mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-light-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-navy hover:bg-cream transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-body text-[15px] text-navy border-x border-light-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-navy hover:bg-cream transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* WhatsApp Order */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] py-4 hover:bg-gold-light transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] mb-4 flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Order via WhatsApp
            </button>

            {/* Add to Selection */}
            <button
              onClick={handleAddToCart}
              className="w-full border border-navy text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] py-4 hover:bg-navy hover:text-white transition-all duration-300 mb-8 text-center"
            >
              Add to Selection List
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-light-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-gold" />
                <span className="font-body text-[12px] text-slate">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={20} className="text-gold" />
                <span className="font-body text-[12px] text-slate">
                  Authentic Guarantee
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-gold" />
                <span className="font-body text-[12px] text-slate">
                  Easy Returns
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-display-sm text-navy text-center mb-10">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
