import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ruler, ShieldAlert, ArrowLeft } from 'lucide-react'

type TabType = 'apparel' | 'footwear' | 'accessories'

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('apparel')

  const apparelSizes = [
    { uk: 'XS (UK 6)', eu: '34', us: '2', chest: '80-84 cm', waist: '62-66 cm', hips: '86-90 cm' },
    { uk: 'S (UK 8-10)', eu: '36-38', us: '4-6', chest: '85-89 cm', waist: '67-71 cm', hips: '91-95 cm' },
    { uk: 'M (UK 12-14)', eu: '40-42', us: '8-10', chest: '90-94 cm', waist: '72-76 cm', hips: '96-100 cm' },
    { uk: 'L (UK 16)', eu: '44', us: '12', chest: '95-99 cm', waist: '77-81 cm', hips: '101-105 cm' },
    { uk: 'XL (UK 18)', eu: '46', us: '14', chest: '100-104 cm', waist: '82-86 cm', hips: '106-110 cm' },
    { uk: 'XXL (UK 20)', eu: '48', us: '16', chest: '105-109 cm', waist: '87-91 cm', hips: '111-115 cm' },
  ]

  const footwearSizes = [
    { uk: '3', eu: '36', us: '5', length: '22.8 cm' },
    { uk: '4', eu: '37', us: '6', length: '23.5 cm' },
    { uk: '5', eu: '38', us: '7', length: '24.2 cm' },
    { uk: '6', eu: '39', us: '8', length: '25.0 cm' },
    { uk: '7', eu: '40', us: '9', length: '25.6 cm' },
    { uk: '8', eu: '41', us: '10', length: '26.4 cm' },
    { uk: '9', eu: '42', us: '11', length: '27.0 cm' },
    { uk: '10', eu: '43', us: '12', length: '27.8 cm' },
    { uk: '11', eu: '44', us: '13', length: '28.5 cm' },
  ]

  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-16">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-[13px] font-medium text-gold hover:text-navy uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 font-accent italic text-[14px] text-gold uppercase tracking-wider mb-3">
            <Ruler size={16} />
            Fitting & Measurements
          </span>
          <h1 className="font-display text-display-md text-navy">Size Guide</h1>
          <p className="font-body text-slate mt-2 max-w-lg mx-auto">
            Find your perfect fit. Our sizes align with standard UK, European, and US sizing charts.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-light-border mb-8">
          {(['apparel', 'footwear', 'accessories'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-body text-[14px] font-semibold uppercase tracking-wider transition-all duration-300 border-b-2 text-center ${
                activeTab === tab
                  ? 'border-gold text-gold font-bold'
                  : 'border-transparent text-slate hover:text-navy'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 md:p-8 rounded-sm shadow-card border border-light-border"
        >
          {activeTab === 'apparel' && (
            <div>
              <h2 className="font-display text-[22px] text-navy mb-4">Clothing Size Conversion</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-[13px]">
                  <thead>
                    <tr className="border-b border-light-border bg-cream text-navy uppercase font-semibold text-[11px] tracking-wider">
                      <th className="p-3">UK Size</th>
                      <th className="p-3">EU Size</th>
                      <th className="p-3">US Size</th>
                      <th className="p-3">Chest</th>
                      <th className="p-3">Waist</th>
                      <th className="p-3">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apparelSizes.map((row, i) => (
                      <tr key={i} className="border-b border-light-border/60 hover:bg-cream/40 transition-colors">
                        <td className="p-3 font-semibold text-navy">{row.uk}</td>
                        <td className="p-3 text-slate">{row.eu}</td>
                        <td className="p-3 text-slate">{row.us}</td>
                        <td className="p-3 text-slate">{row.chest}</td>
                        <td className="p-3 text-slate">{row.waist}</td>
                        <td className="p-3 text-slate">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'footwear' && (
            <div>
              <h2 className="font-display text-[22px] text-navy mb-4">Footwear Size Conversion</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-[13px]">
                  <thead>
                    <tr className="border-b border-light-border bg-cream text-navy uppercase font-semibold text-[11px] tracking-wider">
                      <th className="p-3">UK Size</th>
                      <th className="p-3">EU Size</th>
                      <th className="p-3">US Size</th>
                      <th className="p-3">Foot Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {footwearSizes.map((row, i) => (
                      <tr key={i} className="border-b border-light-border/60 hover:bg-cream/40 transition-colors">
                        <td className="p-3 font-semibold text-navy">{row.uk}</td>
                        <td className="p-3 text-slate">{row.eu}</td>
                        <td className="p-3 text-slate">{row.us}</td>
                        <td className="p-3 text-slate">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'accessories' && (
            <div>
              <h2 className="font-display text-[22px] text-navy mb-4">Accessories & Rings Sizing</h2>
              <p className="font-body text-body text-slate mb-6 leading-relaxed">
                Most of our bags, sunglasses, and leather accessories are <strong>One Size</strong>.
                For belts and rings, please refer to the standard measurements:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body">
                <div>
                  <h3 className="font-semibold text-navy text-[15px] mb-3 uppercase tracking-wider">Belts</h3>
                  <ul className="space-y-2 text-[13px] text-slate">
                    <li><strong className="text-navy">80 cm:</strong> Fits waist size 28-30 inches</li>
                    <li><strong className="text-navy">85 cm:</strong> Fits waist size 30-32 inches</li>
                    <li><strong className="text-navy">90 cm:</strong> Fits waist size 32-34 inches</li>
                    <li><strong className="text-navy">95 cm:</strong> Fits waist size 34-36 inches</li>
                    <li><strong className="text-navy">100 cm:</strong> Fits waist size 36-38 inches</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-[15px] mb-3 uppercase tracking-wider">Rings</h3>
                  <ul className="space-y-2 text-[13px] text-slate">
                    <li><strong className="text-navy">Size 52 (EU):</strong> Size 6 (US) / L (UK)</li>
                    <li><strong className="text-navy">Size 54 (EU):</strong> Size 7 (US) / N (UK)</li>
                    <li><strong className="text-navy">Size 56 (EU):</strong> Size 8 (US) / P (UK)</li>
                    <li><strong className="text-navy">Size 58 (EU):</strong> Size 9 (US) / R (UK)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Advice Card */}
        <div className="mt-8 bg-navy p-5 rounded-sm border border-gold/20 flex gap-4 items-start text-left">
          <ShieldAlert size={22} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-body font-semibold text-white text-[14px] uppercase tracking-wide mb-1">
              Unsure about your sizing?
            </h4>
            <p className="font-body text-[13px] text-white/80 leading-relaxed">
              Since we process all selections via WhatsApp, you can discuss sizing directly with our sizing agents.
              Just state your typical chest/waist measurements or shoe size in the inquiry, and we will confirm the ideal fit before ordering!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
