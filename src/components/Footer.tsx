import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/30">
      <div className="max-w-container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="May Bay Lo" className="h-[60px] w-auto object-contain mb-4" />
            </Link>
            <p className="font-body text-[14px] text-white/70 leading-relaxed">
              London&apos;s Finest Since 2018
            </p>
            <p className="font-body text-[14px] text-white/50 leading-relaxed mt-3">
              Curating luxury fashion from the world&apos;s most prestigious houses, delivered with British elegance.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body font-semibold text-[14px] text-gold uppercase tracking-[0.08em] mb-5">
              Shop
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Men', path: '/shop/men' },
                { name: 'Women', path: '/shop/women' },
                { name: 'Children', path: '/shop/children' },
                { name: 'Accessories', path: '/shop/accessories' },
                { name: 'New Arrivals', path: '/shop/men' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="font-body text-[14px] text-white/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold text-[14px] text-gold uppercase tracking-[0.08em] mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Shipping & Returns', path: '/shipping-returns' },
                { name: 'Contact', path: '/contact' },
                { name: 'FAQ', path: '/shipping-returns' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="font-body text-[14px] text-white/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-[14px] text-gold uppercase tracking-[0.08em] mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <a
                  href="mailto:info@maybaylo.uk"
                  className="font-body text-[14px] text-white/70 hover:text-gold transition-colors duration-300"
                >
                  info@maybaylo.uk
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <a
                  href="https://wa.me/447495775341"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[14px] text-white/70 hover:text-gold transition-colors duration-300"
                >
                  +44 7495 775341
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-gold flex-shrink-0 mt-1" />
                <span className="font-body text-[14px] text-white/70">
                  42 Savile Row,<br />
                  Mayfair, London W1S 3PR
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social + Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <a href="#" className="text-gold hover:scale-110 transition-transform duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gold hover:scale-110 transition-transform duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gold hover:scale-110 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a href="#" className="text-gold hover:scale-110 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.64 5.93h.43a4.94 4.94 0 0 0 3.25-1.24l.1-.11a.48.48 0 0 0-.08-.72l-.13-.1a7.43 7.43 0 0 0-3.71-1.24h-.16a.43.43 0 0 0-.24.08.48.48 0 0 0-.19.38v2.9a.47.47 0 0 0 .41.47h.02a.52.52 0 0 0 .5-.42zM5.32 13.85a.49.49 0 0 0-.72 0 4.82 4.82 0 0 0-1.24 3.21c0 .13 0 .26.08.38a.46.46 0 0 0 .38.22h3a.48.48 0 0 0 .48-.41.58.58 0 0 0 0-.14v-.08a7.51 7.51 0 0 0-1.26-3.2zM18.22 13.83a4.84 4.84 0 0 0-3.25 1.24l-.1.11a.48.48 0 0 0 .08.72l.13.1a7.48 7.48 0 0 0 3.71 1.24h.16a.45.45 0 0 0 .43-.46v-2.9a.47.47 0 0 0-.41-.47h-.02a.56.56 0 0 0-.51.42zM10.13 18.14a4.94 4.94 0 0 0 3.25 1.24h.16a.45.45 0 0 0 .43-.46v-2.9a.47.47 0 0 0-.41-.47h-.02a.55.55 0 0 0-.5.42.52.52 0 0 0 0 .14 7.51 7.51 0 0 0-3.71 1.24l-.13.1a.48.48 0 0 0 .08.72l.1.07zM12.48 5.93h-.43a4.94 4.94 0 0 0-3.25 1.24l-.1.11a.48.48 0 0 0 .08.72l.13.1a7.51 7.51 0 0 0 3.71 1.24h.16a.43.43 0 0 0 .24-.08.48.48 0 0 0 .19-.38V6.4a.47.47 0 0 0-.41-.47h-.02zM14.28 13.05a.52.52 0 0 0-.5.42.58.58 0 0 0 0 .14v.08a7.53 7.53 0 0 0 1.26 3.2.49.49 0 0 0 .72 0 4.85 4.85 0 0 0 1.24-3.22.45.45 0 0 0-.08-.38.46.46 0 0 0-.38-.22h-3.02a.47.47 0 0 0-.24.08z" />
                </svg>
              </a>
            </div>
            <p className="font-body text-[13px] text-white/50">
              2026 May Bay Lo. All Rights Reserved.
            </p>
            <div className="flex items-center gap-3">
              {/* Payment icons SVG */}
              <img src="/payment-icons.svg" alt="Payment methods" className="h-6 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
