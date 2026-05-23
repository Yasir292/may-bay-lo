import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img src="/about-heritage.jpg" alt="British Heritage" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="section-label text-gold mb-4">Our Story</span>
          <h1 className="font-display text-display-md text-white mb-4">May Bay Lo</h1>
          <p className="font-accent italic text-[18px] text-white/80">
            London&apos;s Finest Since 2018
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-container-narrow mx-auto px-6 py-section-desktop">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h2 className="font-display text-display-sm text-navy mb-6">Heritage & Craftsmanship</h2>
          <p className="font-body text-body-lg text-slate leading-relaxed mb-6">
            Founded in 2018 on London&apos;s iconic Savile Row, May Bay Lo was born from a passion
            for exceptional fashion and a belief that luxury should be accessible. We curate the finest
            pieces from the world&apos;s most prestigious fashion houses, bringing them directly to your door.
          </p>
          <p className="font-body text-body-lg text-slate leading-relaxed mb-6">
            Our team of expert buyers scours the globe to discover collections that embody the perfect
            balance of timeless elegance and contemporary style. From the ateliers of Paris to the mills
            of Milan, every piece in our collection is chosen with meticulous care.
          </p>
          <p className="font-body text-body-lg text-slate leading-relaxed">
            We believe that true luxury lies not just in the label, but in the craftsmanship, the materials,
            and the story behind each garment. That&apos;s why we partner exclusively with houses that share
            our commitment to quality, authenticity, and sustainable practices.
          </p>
        </motion.div>

        {/* Craftsmanship Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mt-16"
        >
          <div className="aspect-[3/2] overflow-hidden rounded-sm">
            <img src="/about-craftsmanship.jpg" alt="Craftsmanship" className="w-full h-full object-cover" />
          </div>
          <p className="font-body text-[14px] text-slate text-center mt-4 italic">
            Every stitch tells a story of dedication and mastery
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-20"
        >
          <h2 className="font-display text-display-sm text-navy text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Authenticity',
                desc: 'Every item we sell is guaranteed authentic, sourced directly from brand-authorised distributors and boutiques.',
              },
              {
                title: 'Quality',
                desc: 'We never compromise on quality. Each piece is inspected to ensure it meets our exacting standards.',
              },
              {
                title: 'Service',
                desc: 'From personal styling advice to seamless delivery, we provide a white-glove shopping experience.',
              },
            ].map((val) => (
              <div key={val.title} className="text-center">
                <h3 className="font-display text-[24px] text-navy mb-4">{val.title}</h3>
                <p className="font-body text-[15px] text-slate leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
