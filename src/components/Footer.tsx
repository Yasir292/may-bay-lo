import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f5] border-t border-[#e5e5e5]">
      <div className="max-w-container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.webp" alt="MAY BAY LO" className="h-[32px] md:h-[40px] w-auto object-contain" />
            </Link>
            <p className="font-body text-[14px] text-[#4a4a4a] leading-relaxed">
              London&apos;s Finest Since 2018
            </p>
            <p className="font-body text-[14px] text-[#5a5a5a] leading-relaxed mt-3">
              Curating luxury fashion from the world&apos;s most prestigious houses, delivered with British elegance.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body font-semibold text-[14px] text-[#191919] uppercase tracking-[0.08em] mb-5">
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
                    className="font-body text-[14px] text-[#4a4a4a] hover:text-[#191919] hover:underline transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold text-[14px] text-[#191919] uppercase tracking-[0.08em] mb-5">
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
                    className="font-body text-[14px] text-[#4a4a4a] hover:text-[#191919] hover:underline transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-[14px] text-[#191919] uppercase tracking-[0.08em] mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[#191919] flex-shrink-0" />
                <a
                  href="mailto:info@maybaylo.uk"
                  className="font-body text-[14px] text-[#4a4a4a] hover:text-[#191919] transition-colors duration-300"
                >
                  info@maybaylo.uk
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[#191919] flex-shrink-0" />
                <a
                  href="https://wa.me/447495775341"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[14px] text-[#4a4a4a] hover:text-[#191919] transition-colors duration-300"
                >
                  +44 7495 775341
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#191919] flex-shrink-0 mt-1" />
                <span className="font-body text-[14px] text-[#4a4a4a]">
                  42 Savile Row,<br />
                  Mayfair, London W1S 3PR
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social + Bottom */}
        <div className="mt-12 pt-8 border-t border-[#d3d3d3]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <a href="#" className="text-[#191919] hover:scale-110 transition-transform duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-[#191919] hover:scale-110 transition-transform duration-300">
                <Facebook size={18} />
              </a>
            </div>
            <p className="font-body text-[13px] text-[#5a5a5a]">
              &copy; 2026 May Bay Lo. All Rights Reserved.
            </p>
            <div className="flex items-center gap-3">
              <img src="/payment-icons.svg" alt="Payment methods" className="h-6 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
