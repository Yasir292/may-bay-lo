import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, MessageCircle, Truck, Home, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'

const steps = [
  {
    icon: MessageCircle,
    title: "Inquiry Verification",
    description: 'Our team will verify the availability of your selected articles.',
  },
  {
    icon: Package,
    title: 'Custom Price Quote',
    description: "We'll send you a custom price quote and details directly via WhatsApp.",
  },
  {
    icon: Truck,
    title: 'Inspection & Dispatch',
    description: 'Once confirmed, your items undergo quality inspection and are dispatched.',
  },
  {
    icon: Home,
    title: 'Complimentary Delivery',
    description: 'Your package is shipped with complimentary express courier delivery.',
  },
]

function generateOrderNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `MB-${random}`
}

export default function OrderConfirmation() {
  const items = useCart((s) => s.items)
  const emptyCart = useCart((s) => s.emptyCart)
  const [orderNumber] = useState(generateOrderNumber())
  const [orderDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }))





  useEffect(() => {
    const timer = setTimeout(() => {
      emptyCart()
    }, 5000)
    return () => clearTimeout(timer)
  }, [emptyCart])

  return (
    <div className="min-h-[100dvh] bg-cream">
      <div className="max-w-container-narrow mx-auto px-6 py-section-mobile md:py-section-desktop">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-[72px] h-[72px] bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check size={36} className="text-gold" strokeWidth={1.5} />
          </motion.div>
          <h1 className="font-display text-display-sm text-navy mb-3">
            Inquiry Sent Successfully
          </h1>
          <p className="font-body text-[16px] text-slate max-w-[500px] mx-auto">
            Your inquiry list has been received. Our team will contact you via WhatsApp shortly to finalize your request.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="bg-white border border-light-border p-8 md:p-10 mb-8"
        >
          <div className="flex flex-wrap gap-6 justify-between items-start mb-8 pb-8 border-b border-light-border">
            <div>
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Inquiry Number</p>
              <p className="font-body font-semibold text-[18px] text-navy">{orderNumber}</p>
            </div>
            <div>
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Date</p>
              <p className="font-body text-[15px] text-navy">{orderDate}</p>
            </div>
            <div>
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Estimated Dispatch</p>
              <p className="font-body text-[15px] text-navy">1-2 Business Days</p>
            </div>
            <div>
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-gold bg-gold/10 px-3 py-1">
                Awaiting Verification
              </span>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 ? (
            <div className="flex flex-col gap-4">
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-2">Selected Articles</p>
              {items.map((item, i) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-[60px] h-[75px] overflow-hidden flex-shrink-0 bg-cream">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-[14px] text-navy truncate">{item.name}</p>
                    <p className="font-body text-[12px] text-slate">{item.brand} &middot; Size: {item.size} &middot; Qty: {item.quantity}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag size={32} className="text-gold/40 mx-auto mb-3" />
              <p className="font-body text-[14px] text-slate">Your selection has been cleared.</p>
            </div>
          )}
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-12"
        >
          <h2 className="font-display text-[22px] text-navy mb-6 text-center">What&apos;s Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="bg-white border border-light-border p-6 text-center"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon size={22} className="text-gold" strokeWidth={1.5} />
                </div>
                <div className="font-body font-semibold text-[13px] text-navy mb-2">
                  {i + 1}. {step.title}
                </div>
                <p className="font-body text-[12px] text-slate leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/track-order"
            className="flex items-center justify-center gap-2 bg-navy text-white font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-10 py-4 hover:bg-navy/90 transition-colors duration-300 min-w-[220px]"
          >
            Track Your Inquiry
            <Truck size={16} />
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-10 py-4 hover:bg-gold-light transition-colors duration-300 min-w-[220px]"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
