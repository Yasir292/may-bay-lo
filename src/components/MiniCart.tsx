import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/store/cart'

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { items, removeItem, updateQuantity, emptyCart } = useCart()

  const generateOrderNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000)
    return `MB-${random}`
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    const orderNumber = generateOrderNumber()

    const itemsList = items
      .map((item, idx) => {
        return `${idx + 1}. *${item.name}* (${item.brand}) - Size: ${item.size} x${item.quantity}`
      })
      .join('\n')

    const message = `Hello May Bay Lo! I would like to inquire about Selection #${orderNumber}:\n\n${itemsList}\n\nPlease confirm availability and details. Thank you!`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/447495775341?text=${encodedMessage}`, '_blank')

    // Store order number for confirmation page, then clear selection and navigate
    sessionStorage.setItem('pendingOrderNumber', orderNumber)
    setTimeout(() => {
      emptyCart()
      onClose()
      window.location.href = '/order-confirmation'
    }, 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-light-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-display text-[20px] text-navy">Your Selection</h2>
                <span className="font-body text-[13px] text-slate">
                  ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-slate hover:text-navy transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-gold/30 mb-4" />
                  <p className="font-body text-[15px] text-navy mb-2">Your selection is empty</p>
                  <p className="font-body text-[13px] text-slate mb-6">
                    Discover our curated collections
                  </p>
                  <Link
                    to="/"
                    onClick={onClose}
                    className="bg-gold text-navy font-body font-semibold text-[13px] uppercase tracking-[0.08em] px-8 py-3 hover:bg-gold-light transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-cream border border-light-border"
                    >
                      {/* Thumbnail */}
                      <Link
                        to={`/product/${item.id}`}
                        onClick={onClose}
                        className="w-[72px] h-[90px] flex-shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[11px] text-slate uppercase tracking-wider">
                          {item.brand}
                        </p>
                        <Link
                          to={`/product/${item.id}`}
                          onClick={onClose}
                          className="font-body font-medium text-[14px] text-navy hover:text-gold transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="font-body text-[12px] text-slate mt-0.5">
                          Size: {item.size}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity controls */}
                          <div className="inline-flex items-center border border-light-border">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-navy hover:bg-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 h-7 flex items-center justify-center font-body text-[12px] text-navy border-x border-light-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-navy hover:bg-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="text-slate hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-light-border px-6 py-5 space-y-4">
                <p className="font-body text-[12px] text-slate leading-relaxed">
                  Submit your selection list below to order directly via WhatsApp. Our team will verify availability and finalize your custom order.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleCheckout}
                    className="flex items-center justify-center gap-2 w-full bg-gold text-navy font-body font-semibold text-[13px] uppercase tracking-[0.08em] py-3.5 hover:bg-gold-light transition-all duration-300"
                  >
                    Send Inquiry via WhatsApp
                    <ArrowRight size={16} />
                  </button>
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="flex items-center justify-center w-full border border-navy text-navy font-body font-semibold text-[13px] uppercase tracking-[0.08em] py-3 hover:bg-navy hover:text-white transition-all duration-300"
                  >
                    View Full Selection
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
