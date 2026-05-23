/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        gold: '#C9A96E',
        'gold-light': '#E8D5A3',
        cream: '#F5F0EB',
        charcoal: '#1E293B',
        slate: '#64748B',
        'warm-gray': '#9CA3AF',
        'light-border': 'rgba(10, 22, 40, 0.08)',
        'dark-border': 'rgba(255, 255, 255, 0.1)',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(48px, 8vw, 96px)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-lg': ['clamp(40px, 6vw, 72px)', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-md': ['clamp(32px, 4.5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '400' }],
        'display-sm': ['clamp(24px, 3vw, 36px)', { lineHeight: '1.2', letterSpacing: '0em', fontWeight: '500' }],
        'body-lg': ['clamp(18px, 1.5vw, 20px)', { lineHeight: '1.65', letterSpacing: '0em', fontWeight: '400' }],
        'label': ['clamp(11px, 1vw, 12px)', { lineHeight: '1.4', letterSpacing: '0.12em', fontWeight: '500' }],
        'price': ['clamp(20px, 1.8vw, 24px)', { lineHeight: '1.2', letterSpacing: '0em', fontWeight: '600' }],
      },
      maxWidth: {
        'container': '1400px',
        'container-narrow': '1000px',
        'container-wide': '1600px',
      },
      spacing: {
        'section-mobile': '64px',
        'section-desktop': '120px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'card': '0 2px 12px rgba(10, 22, 40, 0.06)',
        'card-hover': '0 8px 30px rgba(10, 22, 40, 0.12)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
