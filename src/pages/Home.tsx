import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Truck, Shield, Clock } from 'lucide-react'
import { getFeaturedProducts, getNewArrivals, products } from '@/data/products'
import ProductCard from '@/components/ProductCard'

// ──────────────────────────────────────
// Hero Carousel Data
// ──────────────────────────────────────
const heroSlides = [
  {
    image: '/hero-men.jpg',
    label: "MEN'S COLLECTION",
    headline: 'Timeless British Elegance',
    subtext: 'Premium apparel curated for the modern gentleman',
    cta: '/shop/men',
  },
  {
    image: '/hero-women.jpg',
    label: "WOMEN'S COLLECTION",
    headline: 'Effortless Sophistication',
    subtext: 'Designer pieces that define contemporary grace',
    cta: '/shop/women',
  },
  {
    image: '/hero-children.jpg',
    label: "CHILDREN'S WEAR",
    headline: 'Refined Style for the Young',
    subtext: 'Quality clothing for every young adventurer',
    cta: '/shop/children',
  },
  {
    image: '/hero-accessories.jpg',
    label: 'LUXURY ACCESSORIES',
    headline: 'The Finishing Touch',
    subtext: "Handpicked accessories from the world's finest houses",
    cta: '/shop/accessories',
  },
]

// ──────────────────────────────────────
// Testimonials Data
// ──────────────────────────────────────
const testimonials = [
  {
    quote: "The quality exceeded my expectations. Every piece feels like it was made just for me. The delivery was seamless and the packaging was exquisite.",
    name: 'James Whitfield',
    location: 'London, UK',
  },
  {
    quote: "I've been searching for a reliable source of luxury fashion for my boutique. May Bay Lo delivers consistency and elegance with every order.",
    name: 'Sarah Chen',
    location: 'Manchester, UK',
  },
  {
    quote: 'From the curated selection to the impeccable customer service, this is how luxury e-commerce should be done. Highly recommended.',
    name: 'Oliver Hartwell',
    location: 'Edinburgh, UK',
  },
]

// ──────────────────────────────────────
// Category Data
// ──────────────────────────────────────
const categories = [
  { name: 'MEN', image: '/category-men.jpg', cta: '/shop/men' },
  { name: 'WOMEN', image: '/category-women.jpg', cta: '/shop/women' },
  { name: 'CHILDREN', image: '/category-children.jpg', cta: '/shop/children' },
  { name: 'ACCESSORIES', image: '/category-accessories.jpg', cta: '/shop/accessories' },
]

// ──────────────────────────────────────
// Easing token
// ──────────────────────────────────────
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ──────────────────────────────────────
// Section Label Component
// ──────────────────────────────────────
function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center font-accent italic text-[14px] tracking-[0.1em] uppercase ${light ? 'text-gold' : 'text-gold'}`}>
      <span className="inline-block w-[40px] h-[1px] bg-gold opacity-50 mr-3" />
      {text}
    </span>
  )
}

// ──────────────────────────────────────
// Scroll Reveal Hook
// ──────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// ──────────────────────────────────────
// Hero Section
// ──────────────────────────────────────
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
  }, [])

  useEffect(() => {
    startAutoAdvance()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startAutoAdvance])

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx)
    startAutoAdvance()
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 overlay-dark" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-container mx-auto px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[700px]"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: easeOutExpo }}
                className="block font-accent italic text-[14px] text-gold tracking-[0.1em] uppercase mb-5"
              >
                {slide.label}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: easeOutExpo }}
                className="font-display text-display-xl text-white mb-5 max-w-[700px]"
              >
                {slide.headline}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8, ease: easeOutExpo }}
                className="font-body text-body-lg text-white/80 max-w-[500px] mb-8"
              >
                {slide.subtext}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: easeOutExpo }}
              >
                <Link
                  to={slide.cta}
                  className="inline-block bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-gold-light transition-all duration-300 hover:scale-[1.02]"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-gold scale-110' : 'bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
        <span className="ml-8 font-body text-[13px] text-white/60">
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Brand Promise Bar
// ──────────────────────────────────────
function BrandPromiseBar() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className="bg-gold">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="max-w-container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16"
      >
        {[
          { icon: Truck, text: 'Worldwide Free Shipping' },
          { icon: Shield, text: 'Authentic Quality Guarantee' },
          { icon: Clock, text: 'Express Delivery Available' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3">
            <item.icon size={20} className="text-navy" />
            <span className="font-body font-medium text-[14px] text-navy tracking-[0.04em]">
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ──────────────────────────────────────
// Featured Products Section
// ──────────────────────────────────────
function FeaturedProducts() {
  const { ref, isVisible } = useScrollReveal()
  const featuredProducts = getFeaturedProducts()

  return (
    <section ref={ref} className="bg-cream py-section-desktop md:py-section-desktop">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel text="CURATED SELECTION" />
            <h2 className="font-display text-display-md text-navy mt-3">This Season&apos;s Essentials</h2>
          </div>
          <Link
            to="/shop/men"
            className="hidden md:flex items-center gap-1 font-body font-medium text-[14px] text-gold hover:underline transition-all"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: easeOutExpo }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Category Showcase
// ──────────────────────────────────────
function CategoryShowcase() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-navy py-section-desktop md:py-section-desktop">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel text="SHOP BY CATEGORY" light />
          <h2 className="font-display text-display-md text-white mt-3">
            Collections for Every Discerning Taste
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7, ease: easeOutExpo }}
            >
              <Link to={cat.cta} className="group block relative aspect-square md:aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/60 transition-all duration-400" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="font-display text-display-lg text-white transition-transform duration-400 group-hover:-translate-y-2">
                    {cat.name}
                  </h3>
                  <motion.span
                    className="mt-3 font-body font-semibold text-[14px] uppercase tracking-[0.08em] text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 inline-flex items-center gap-1"
                  >
                    Shop Now <ChevronRight size={14} />
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Editorial Banner
// ──────────────────────────────────────
function EditorialBanner() {
  const { ref, isVisible } = useScrollReveal(0.2)

  return (
    <section
      ref={ref}
      className="relative h-[400px] md:h-[500px] overflow-hidden bg-fixed"
      style={{
        backgroundImage: 'url(/hero-accessories.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <SectionLabel text="THE MAY BAY LO DIFFERENCE" light />
            <h2 className="font-display text-display-md text-white mt-4 mb-5">
              Heritage Craftsmanship Meets Modern Convenience
            </h2>
            <p className="font-body text-body-lg text-white/80 mb-8 max-w-[600px] mx-auto">
              We curate the finest pieces from the world&apos;s most respected houses, delivering them directly to your door with the care and attention that true luxury demands.
            </p>
            <Link
              to="/about"
              className="inline-block border border-gold text-gold font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-gold hover:text-navy transition-all duration-300"
            >
              Discover Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// New Arrivals
// ──────────────────────────────────────
function NewArrivals() {
  const { ref, isVisible } = useScrollReveal()
  const newArrivals = getNewArrivals()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // If fewer than 6 new arrivals, use the first 6 products
  const displayProducts = newArrivals.length >= 4 ? newArrivals : products.slice(0, 6)

  return (
    <section ref={ref} className="bg-cream py-section-desktop md:py-section-desktop">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel text="JUST ARRIVED" />
            <h2 className="font-display text-display-md text-navy mt-3">The Latest Additions</h2>
          </div>
          <Link
            to="/shop/men"
            className="hidden md:flex items-center gap-1 font-body font-medium text-[14px] text-gold hover:underline transition-all"
          >
            View All New Arrivals <ChevronRight size={16} />
          </Link>
        </div>

        {/* Horizontal Scroll Row */}
        <div
          className="relative"
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          {/* Scroll arrows (desktop only) */}
          <AnimatePresence>
            {showArrows && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll('left')}
                  className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-navy text-white rounded-full items-center justify-center hover:bg-charcoal transition-colors shadow-lg"
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll('right')}
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-navy text-white rounded-full items-center justify-center hover:bg-charcoal transition-colors shadow-lg"
                >
                  <ChevronRight size={18} />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
          >
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: easeOutExpo }}
                className="flex-shrink-0 w-[260px] md:w-[280px] snap-start"
              >
                <ProductCard product={product} narrow />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Testimonials
// ──────────────────────────────────────
function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-navy py-section-desktop md:py-section-desktop">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel text="CLIENTELE" light />
          <h2 className="font-display text-display-md text-white mt-3">
            Words from Our Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6, ease: easeOutExpo }}
              className="relative bg-charcoal p-10 rounded-sm border-t-2 border-gold/30"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 0.3 } : {}}
                transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                className="absolute top-6 left-6 font-display text-[72px] text-gold leading-none select-none"
              >
                &ldquo;
              </motion.span>
              <p className="font-accent italic text-[18px] md:text-[20px] text-white/90 leading-[1.7] mb-6 relative z-10 pt-8">
                {t.quote}
              </p>
              <p className="font-body font-semibold text-[16px] text-gold">{t.name}</p>
              <p className="font-body text-[14px] text-white/60">{t.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Newsletter CTA
// ──────────────────────────────────────
function NewsletterCTA() {
  const { ref, isVisible } = useScrollReveal()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <section ref={ref} className="bg-cream py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="max-w-[700px] mx-auto px-6 text-center"
      >
        <h2 className="font-display text-display-sm text-navy mb-4">Join the Inner Circle</h2>
        <p className="font-body text-body text-slate mb-8">
          Be the first to discover new arrivals, exclusive offers, and stories from the world of British luxury fashion.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-navy"
          >
            <p className="font-body text-[16px] text-gold">Welcome to the Inner Circle!</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 mb-4">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-[48px] px-4 bg-transparent border-b-2 border-navy text-navy font-body text-[16px] focus:border-gold focus:outline-none transition-colors placeholder:text-slate/50"
            />
            <button
              type="submit"
              className="h-[48px] bg-gold text-navy font-body font-semibold text-[14px] uppercase tracking-[0.08em] px-8 hover:bg-gold-light transition-colors duration-300 mt-4 sm:mt-0"
            >
              Subscribe
            </button>
          </form>
        )}
        <p className="font-body text-[12px] text-warm-gray">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    </section>
  )
}

// ──────────────────────────────────────
// Trending Products (UK Hot Sellers)
// ──────────────────────────────────────
function TrendingProducts() {
  const { ref, isVisible } = useScrollReveal()
  
  // Select 4 new hot-selling products for the UK market
  const trendingList = [
    products.find((p) => p.id === 'MBL-D001')!,
    products.find((p) => p.id === 'MBL-L001')!,
    products.find((p) => p.id === 'MBL-ACT002')!,
    products.find((p) => p.id === 'MBL-F002')!,
  ].filter(Boolean)

  if (trendingList.length === 0) return null

  return (
    <section ref={ref} className="bg-white py-section-desktop border-t border-light-border">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel text="TRENDING IN THE UK" />
            <h2 className="font-display text-display-md text-navy mt-3">UK Best Sellers & Hot Items</h2>
            <p className="font-body text-slate mt-2 max-w-lg">
              The most searched designer products in the UK fashion market. High demand and styling classics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingList.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: easeOutExpo }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Shop By Style Data & Component
// ──────────────────────────────────────
const stylesData = [
  {
    name: 'Denim Collection',
    tagline: 'UK No.1 Search Volume',
    image: '/products/denim_collection.png',
    path: '/shop/women',
    state: { subCategory: 'Denim' },
  },
  {
    name: 'Loungewear & Pyjamas',
    tagline: 'Cozy Luxury Lounge',
    image: '/products/loungewear.jpg',
    path: '/shop/women',
    state: { subCategory: 'Loungewear' },
  },
  {
    name: 'Athleisure & Activewear',
    tagline: 'Trending High-Performance',
    image: '/products/activewear.jpg',
    path: '/shop/women',
    state: { subCategory: 'Activewear' },
  },
  {
    name: 'Formalwear & Tailoring',
    tagline: 'Classic Sophistication',
    image: '/products/formalwear.jpg',
    path: '/shop/men',
    state: { subCategory: 'Formalwear' },
  },
]

function ShopByStyle() {
  const { ref, isVisible } = useScrollReveal()
  const navigate = useNavigate()

  return (
    <section ref={ref} className="bg-cream py-section-desktop border-t border-light-border">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel text="SHOP BY STYLE" />
          <h2 className="font-display text-display-md text-navy mt-3">Curated UK Wardrobes</h2>
          <p className="font-body text-slate mt-2 max-w-xl mx-auto">
            Discover collections tailored for the most popular UK search patterns and contemporary streetwear.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylesData.map((style, i) => (
            <motion.div
              key={style.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: easeOutExpo }}
              onClick={() => navigate(style.path, { state: style.state })}
              className="group cursor-pointer relative aspect-[3/4] overflow-hidden bg-navy rounded-sm border border-light-border"
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg'
                }}
              />
              <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/60 transition-all duration-300" />
              
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-left">
                <span className="font-body text-[11px] font-bold uppercase tracking-wider text-gold mb-1.5 block">
                  {style.tagline}
                </span>
                <h3 className="font-display text-[22px] leading-tight text-white mb-2 group-hover:text-gold transition-colors">
                  {style.name}
                </h3>
                <span className="font-body text-[12px] font-semibold text-white/70 uppercase tracking-wider group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                  View Collection <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────
// Home Page
// ──────────────────────────────────────
export default function Home() {
  return (
    <>
      {/* Section 2: Hero Carousel */}
      <HeroSection />

      {/* Section 3: Brand Promise Bar */}
      <BrandPromiseBar />

      {/* Section 4: Featured Products */}
      <FeaturedProducts />

      {/* Section 4.5: Trending Products */}
      <TrendingProducts />

      {/* Section 5: Category Showcase */}
      <CategoryShowcase />

      {/* Section 5.5: Shop By Style */}
      <ShopByStyle />

      {/* Section 6: Editorial Banner */}
      <EditorialBanner />

      {/* Section 7: New Arrivals */}
      <NewArrivals />

      {/* Section 8: Testimonials */}
      <TestimonialsSection />

      {/* Section 9: Newsletter CTA + Footer */}
      <NewsletterCTA />
    </>
  )
}
