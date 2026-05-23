import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useCurrency, currencies, type CurrencyCode } from '@/store/currency'

export default function CurrencySwitcher() {
  const [open, setOpen] = useState(false)
  const currency = useCurrency((s) => s.currency)
  const setCurrency = useCurrency((s) => s.setCurrency)
  const ref = useRef<HTMLDivElement>(null)

  const active = currencies[currency]
  const allCurrencies = Object.values(currencies)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-body text-[13px] text-white hover:text-gold transition-colors duration-300"
      >
        <span className="font-medium">{active?.code}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={12} strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-2 w-[180px] bg-navy border border-dark-border rounded-sm shadow-2xl overflow-hidden z-50"
          >
            {allCurrencies.map((c) => (
              <button
                key={c.code}
                onClick={() => handleSelect(c.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
                  c.code === currency
                    ? 'bg-gold/15 text-gold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-body font-medium text-[13px]">{c.code}</span>
                  <span className="font-body text-[11px] text-slate">{c.name}</span>
                </div>
                <span className="ml-auto font-body text-[12px] text-slate">{c.symbol}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
