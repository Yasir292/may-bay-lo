import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, CheckCircle2, Clock, Truck, Home, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTrackingStore, type OrderStatus, type Order } from '@/store/tracking'

const stageIcons: Record<OrderStatus, typeof Package> = {
  placed: Package,
  confirmed: CheckCircle2,
  processing: Clock,
  shipped: Truck,
  delivered: Home,
}

const stageLabels: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const allStages: OrderStatus[] = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']

function TrackingTimeline({ order }: { order: Order }) {
  const currentIndex = allStages.indexOf(order.status)

  return (
    <div className="mt-10">
      <h3 className="font-display text-[18px] text-navy mb-8">Order Progress</h3>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {/* Connecting Line Background */}
          <div className="absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gray-200" />
          {/* Active Line */}
          <div
            className="absolute top-[22px] left-[10%] h-[2px] bg-gold transition-all duration-700"
            style={{
              width: `${(currentIndex / (allStages.length - 1)) * 80}%`,
            }}
          />

          {allStages.map((stage, i) => {
            const Icon = stageIcons[stage]
            const isCompleted = i <= currentIndex
            const isCurrent = i === currentIndex

            return (
              <div key={stage} className="relative z-10 flex flex-col items-center w-[20%]">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? '#C9A96E' : '#F3F4F6',
                    borderColor: isCompleted ? '#C9A96E' : '#E5E7EB',
                  }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center ${
                    isCurrent ? 'shadow-lg shadow-gold/25' : ''
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className={isCompleted ? 'text-white' : 'text-gray-400'}
                  />
                </motion.div>
                <div className="text-center mt-3">
                  <p
                    className={`font-body font-medium text-[13px] ${
                      isCompleted ? 'text-navy' : 'text-slate'
                    }`}
                  >
                    {stageLabels[stage]}
                  </p>
                  {order.timeline[i] && (
                    <>
                      <p className="font-body text-[11px] text-slate mt-0.5">
                        {order.timeline[i].date}
                      </p>
                      <p className="font-body text-[11px] text-slate">
                        {order.timeline[i].time}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden flex flex-col gap-6 relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-gray-200" />
        {allStages.map((stage, i) => {
          const Icon = stageIcons[stage]
          const isCompleted = i <= currentIndex
          const isCurrent = i === currentIndex

          return (
            <div key={stage} className="relative z-10 flex items-start gap-4">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#C9A96E' : '#F3F4F6',
                  borderColor: isCompleted ? '#C9A96E' : '#E5E7EB',
                }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isCurrent ? 'shadow-lg shadow-gold/25' : ''
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className={isCompleted ? 'text-white' : 'text-gray-400'}
                />
              </motion.div>
              <div>
                <p
                  className={`font-body font-medium text-[14px] ${
                    isCompleted ? 'text-navy' : 'text-slate'
                  }`}
                >
                  {stageLabels[stage]}
                </p>
                {order.timeline[i] && (
                  <p className="font-body text-[12px] text-slate mt-0.5">
                    {order.timeline[i].date} at {order.timeline[i].time}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Estimated Delivery */}
      <div className="mt-10 p-5 bg-gold/8 border border-gold/20 rounded-sm">
        <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Estimated Delivery</p>
        <p className="font-body font-semibold text-[16px] text-navy">{order.estimatedDelivery}</p>
      </div>
    </div>
  )
}

function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="mt-10 pt-10 border-t border-light-border">
      <h3 className="font-display text-[18px] text-navy mb-6">Selection Summary</h3>
      <div className="flex flex-col gap-4">
        {order.items.map((item, i) => (
          <motion.div
            key={`${item.id}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4"
          >
            <div className="w-[50px] h-[60px] bg-cream overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-[13px] text-navy truncate">{item.name}</p>
              <p className="font-body text-[11px] text-slate">{item.brand} &middot; Size: {item.size} &middot; Qty: {item.quantity}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TrackingResult({ order }: { order: Order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-wrap gap-6 justify-between items-start mb-8 pb-8 border-b border-light-border">
        <div>
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Inquiry Number</p>
          <p className="font-body font-semibold text-[18px] text-navy">{order.orderNumber}</p>
        </div>
        <div>
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Tracking Number</p>
          <p className="font-body text-[15px] text-navy">{order.trackingNumber}</p>
        </div>
        <div>
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Inquiry Date</p>
          <p className="font-body text-[15px] text-navy">{order.date}</p>
        </div>
        <div>
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-slate mb-1">Status</p>
          <span className="inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-gold bg-gold/10 px-3 py-1">
            {stageLabels[order.status]}
          </span>
        </div>
      </div>

      <TrackingTimeline order={order} />
      <OrderSummary order={order} />
    </motion.div>
  )
}

export default function OrderTracking() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)
  const getOrder = useTrackingStore((s) => s.getOrder)

  useEffect(() => {
    // Check for order number in URL query params
    const params = new URLSearchParams(window.location.search)
    const orderNum = params.get('order')
    if (orderNum) {
      setQuery(orderNum)
      handleSearch(orderNum)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (orderNum?: string) => {
    const searchNum = orderNum || query.trim().toUpperCase()
    if (!searchNum) return

    setSearched(true)
    setNotFound(false)
    setOrder(null)

    const found = getOrder(searchNum)
    if (found) {
      setOrder(found)
    } else {
      setNotFound(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      <div className="max-w-container-narrow mx-auto px-6 py-section-mobile md:py-section-desktop">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-display-sm text-navy mb-3 text-center">
            Track Your Inquiry
          </h1>
          <p className="font-body text-[16px] text-slate text-center max-w-[500px] mx-auto mb-10">
            Enter your inquiry number to check the status and track your shipment.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-[560px] mx-auto mb-12">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  placeholder="e.g. MB-000001"
                  className="w-full h-[52px] px-5 pr-12 bg-white border border-light-border font-body text-[14px] text-navy placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors"
                />
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate/50"
                  strokeWidth={1.5}
                />
              </div>
              <button
                type="submit"
                className="h-[52px] px-8 bg-navy text-white font-body font-semibold text-[14px] uppercase tracking-[0.06em] hover:bg-navy/90 transition-colors duration-300 flex items-center gap-2"
              >
                Track
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="font-body text-[12px] text-slate mt-3 text-center">
              Try demo inquiries: <span className="text-gold font-medium">MB-000001</span> through{' '}
              <span className="text-gold font-medium">MB-000010</span>
            </p>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-light-border p-8 md:p-10"
            >
              <TrackingResult order={order} />
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16 bg-white border border-light-border"
            >
              <Package size={48} className="text-gold/40 mx-auto mb-4" />
              <h2 className="font-display text-[20px] text-navy mb-2">Inquiry Not Found</h2>
              <p className="font-body text-[14px] text-slate max-w-[380px] mx-auto mb-6">
                We couldn&apos;t find an inquiry with the number <strong>{query}</strong>. Please check the number and try again.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-gold font-body font-medium text-[14px] hover:underline"
              >
                Contact us for help
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}

          {!searched && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Truck size={40} className="text-gold/30 mx-auto mb-4" />
              <p className="font-body text-[14px] text-slate">
                Enter your order number above to see your tracking details.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
