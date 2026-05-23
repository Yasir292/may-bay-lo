import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Header */}
      <div className="bg-navy py-20 md:py-28">
        <div className="max-w-container-narrow mx-auto px-6 text-center">
          <span className="section-label text-gold mb-4">Get in Touch</span>
          <h1 className="font-display text-display-md text-white mb-4">Contact Us</h1>
          <p className="font-body text-body-lg text-white/80 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Reach out via WhatsApp, email, or the form below.
          </p>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 py-section-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <h2 className="font-display text-display-sm text-navy mb-8">Send a Message</h2>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-navy text-center"
              >
                <p className="font-body text-[18px] text-gold mb-2">Thank you for your message.</p>
                <p className="font-body text-[14px] text-white/70">We&apos;ll be in touch shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block font-body font-medium text-[12px] text-slate uppercase tracking-[0.08em] mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-[48px] px-4 bg-white border border-light-border text-navy font-body text-[16px] focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body font-medium text-[12px] text-slate uppercase tracking-[0.08em] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[48px] px-4 bg-white border border-light-border text-navy font-body text-[16px] focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body font-medium text-[12px] text-slate uppercase tracking-[0.08em] mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-[48px] px-4 bg-white border border-light-border text-navy font-body text-[16px] focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body font-medium text-[12px] text-slate uppercase tracking-[0.08em] mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-light-border text-navy font-body text-[16px] focus:border-gold focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] py-4 hover:bg-gold-light transition-all duration-300 hover:scale-[1.01]"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <h2 className="font-display text-display-sm text-navy mb-8">Contact Information</h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4 p-5 bg-white border border-light-border">
                <Phone size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body font-medium text-[14px] text-navy mb-1">WhatsApp</p>
                  <a href="https://wa.me/447495775341" target="_blank" rel="noopener noreferrer" className="font-body text-[15px] text-slate hover:text-gold transition-colors">
                    +44 7495 775341
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-white border border-light-border">
                <Mail size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body font-medium text-[14px] text-navy mb-1">Email</p>
                  <a href="mailto:info@maybaylo.uk" className="font-body text-[15px] text-slate hover:text-gold transition-colors">
                    info@maybaylo.uk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-white border border-light-border">
                <MapPin size={20} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body font-medium text-[14px] text-navy mb-1">Address</p>
                  <p className="font-body text-[15px] text-slate">
                    42 Savile Row,<br />
                    Mayfair, London W1S 3PR<br />
                    United Kingdom
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-4 p-6 bg-navy text-center">
                <p className="font-body text-[15px] text-white/80 mb-4">
                  Prefer to chat? Reach us directly on WhatsApp for instant assistance.
                </p>
                <a
                  href="https://wa.me/447495775341"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-gold-light transition-colors duration-300"
                >
                  Chat on WhatsApp
                </a>
              </div>

              {/* Social */}
              <div className="flex items-center gap-4 mt-2">
                <a href="#" className="text-navy hover:text-gold transition-colors">
                  <Instagram size={22} />
                </a>
                <a href="#" className="text-navy hover:text-gold transition-colors">
                  <Facebook size={22} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
