import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import { useCart } from '@/store/cart'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'

function generateOrderNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `MB-${random}`
}

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, emptyCart } = useCart()

  // Cross-sell: pick 4 random products not currently in selection
  const cartIds = new Set(items.map((i) => i.id))
  const crossSellProducts = products
    .filter((p) => !cartIds.has(p.id))
    .slice(0, 4)

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    const orderNumber = generateOrderNumber()

    const itemsList = items
      .map((item, idx) => {
        return `${idx + 1}. *${item.name}* (${item.brand}) - Size: ${item.size} x${item.quantity}`
      })
      .join('\n')

    const message = `Hello May Bay Lo! I would like to inquire about Selection #${orderNumber}:\n\n${itemsList}\n\nPlease confirm availability and details. Thank you!`

    const encodedMessage = encodeURIComponent(message)
    const waUrl = `https://wa.me/447495775341?text=${encodedMessage}`

    // Open WhatsApp
    window.open(waUrl, '_blank')

    // Navigate to order confirmation and clear selection
    navigate('/order-confirmation', { state: { orderNumber } })
    emptyCart()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[100dvh] bg-cream">
        <div className="min-h-[80vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-6"
          >
            <ShoppingBag size={48} className="text-gold/50 mx-auto mb-6" />
            <h1 className="font-display text-display-sm text-navy mb-4">
              Your Selection List is Empty
            </h1>
            <p className="font-body text-[16px] text-slate mb-8">
              Discover our curated collections and select items to order.
            </p>
            <Link
              to="/"
              className="inline-block bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-10 py-4 hover:bg-gold-light transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>

        {/* Cross-sell on empty cart too */}
        {crossSellProducts.length > 0 && (
          <div className="max-w-container mx-auto px-6 pb-section-desktop">
            <div className="flex items-center gap-3 justify-center mb-10">
              <Sparkles size={20} className="text-gold" />
              <h2 className="font-display text-display-sm text-navy text-center">
                Complete Your Look
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {crossSellProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      <div className="max-w-container mx-auto px-6 py-section-desktop">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-display-sm text-navy mb-2"
        >
          Selection List
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-body text-[15px] text-slate mb-10"
        >
          {items.reduce((sum, i) => sum + i.quantity, 0)}{' '}
          {items.length === 1 ? 'item' : 'items'}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Selection Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item, i) => (
              <motion.div
                key={`${item.id}-${item.size}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-5 p-5 bg-white border border-light-border"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-[120px] h-[150px] flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-body text-[13px] text-slate">{item.brand}</p>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-body font-medium text-[15px] text-navy hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="font-body text-[13px] text-slate mt-1">
                      Size: {item.size}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="inline-flex items-center border border-light-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-navy hover:bg-cream transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center font-body text-[14px] text-navy border-x border-light-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-navy hover:bg-cream transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-slate hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <button
              onClick={emptyCart}
              className="self-start font-body text-[14px] text-slate hover:text-red-500 transition-colors mt-2"
            >
              Clear Selection List
            </button>
          </div>

          {/* Inquiry Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="h-fit bg-white border border-light-border p-8"
          >
            <h2 className="font-display text-[22px] text-navy mb-6">
              Inquiry Summary
            </h2>
            <div className="flex flex-col gap-3 mb-6">
              <p className="font-body text-[14px] text-slate leading-relaxed">
                You have selected <strong>{items.reduce((sum, i) => sum + i.quantity, 0)}</strong> items for inquiry. Once you submit this selection, our support team will contact you via WhatsApp with a price quote and verify item availability.
              </p>
            </div>
            <button
              onClick={handleWhatsAppCheckout}
              className="flex items-center justify-center gap-2 w-full bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] py-4 hover:bg-gold-light transition-all duration-300"
            >
              Send Inquiry via WhatsApp
              <ArrowRight size={16} />
            </button>
            <p className="font-body text-[12px] text-slate text-center mt-4">
              Submit your inquiry securely via WhatsApp
            </p>
          </motion.div>
        </div>

        {/* Complete Your Look — Cross Sell */}
        {crossSellProducts.length > 0 && (
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 justify-center mb-10"
            >
              <Sparkles size={20} className="text-gold" />
              <h2 className="font-display text-display-sm text-navy text-center">
                Complete Your Look
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {crossSellProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
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
