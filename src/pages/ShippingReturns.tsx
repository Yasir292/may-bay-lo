import { motion } from 'framer-motion'
import { Truck, Clock, Shield, RotateCcw, Package, Globe } from 'lucide-react'

export default function ShippingReturns() {
  const sections = [
    {
      icon: Truck,
      title: 'Free Worldwide Shipping',
      content: 'All orders qualify for complimentary worldwide express shipping. We ship to over 100 countries worldwide, with all packages dispatched via premium couriers.',
    },
    {
      icon: Clock,
      title: 'Delivery Timeframes',
      content: 'UK orders: 1-2 business days. European orders: 2-4 business days. International orders: 5-7 business days. All orders are fully tracked.',
    },
    {
      icon: Shield,
      title: 'Authenticity Guarantee',
      content: 'Every item sold by May Bay Lo is guaranteed 100% authentic. We source directly from brand-authorised distributors and boutiques. Each item undergoes rigorous quality control.',
    },
    {
      icon: RotateCcw,
      title: 'Returns Policy',
      content: 'Items may be returned within 30 days of delivery for a full refund. Items must be unused, with all original tags attached. Return shipping is complimentary for UK orders.',
    },
    {
      icon: Package,
      title: 'Packaging',
      content: 'All orders arrive in our signature May Bay Lo packaging. Gift wrapping is available upon request during your WhatsApp order placement.',
    },
    {
      icon: Globe,
      title: 'Customs & Duties',
      content: 'For international orders, customs duties and taxes may apply. These are the responsibility of the recipient. We declare the full purchase value on all shipments.',
    },
  ]

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Header */}
      <div className="bg-navy py-20 md:py-28">
        <div className="max-w-container-narrow mx-auto px-6 text-center">
          <span className="section-label text-gold mb-4">Customer Care</span>
          <h1 className="font-display text-display-md text-white mb-4">Shipping & Returns</h1>
          <p className="font-body text-body-lg text-white/80 max-w-2xl mx-auto">
            We strive to make your shopping experience as seamless as possible. Here&apos;s everything you need to know.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-container-narrow mx-auto px-6 py-section-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="p-8 bg-white border border-light-border rounded-sm"
            >
              <sec.icon size={24} className="text-gold mb-4" />
              <h3 className="font-display text-[22px] text-navy mb-3">{sec.title}</h3>
              <p className="font-body text-[15px] text-slate leading-relaxed">{sec.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center p-10 bg-navy rounded-sm"
        >
          <h3 className="font-display text-[24px] text-white mb-3">Need Help?</h3>
          <p className="font-body text-[15px] text-white/70 mb-6">
            Our customer care team is available Monday to Friday, 9am to 6pm GMT.
          </p>
          <a
            href="https://wa.me/447495775341"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-gold-light transition-colors duration-300"
          >
            Contact Us on WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  )
}
