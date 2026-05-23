import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'TRY' | 'AED' | 'SAR'

export interface Currency {
  code: CurrencyCode
  symbol: string
  name: string
}

export const currencies: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
  TRY: { code: 'TRY', symbol: '\u20BA', name: 'Turkish Lira' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
}

export const defaultRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 32.5,
  AED: 3.67,
  SAR: 3.75,
}

interface CurrencyStoreState {
  currency: CurrencyCode
  rates: Record<CurrencyCode, number>
}

interface CurrencyStore extends CurrencyStoreState {
  setCurrency: (code: CurrencyCode) => void
  setRates: (rates: Record<CurrencyCode, number>) => void
  updateRate: (code: CurrencyCode, rate: number) => void
  convertPrice: (usdPrice: number) => number
  formatPrice: (usdPrice: number) => string
}

export const useCurrency = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      rates: { ...defaultRates },

      setCurrency: (code) => set({ currency: code }),

      setRates: (rates) => set({ rates }),

      updateRate: (code, rate) =>
        set((state) => ({
          rates: { ...state.rates, [code]: rate },
        })),

      convertPrice: (usdPrice) => {
        const { currency, rates } = get()
        if (currency === 'USD') return usdPrice
        return usdPrice * (rates[currency] || 1)
      },

      formatPrice: (usdPrice) => {
        const { currency, rates } = get()
        const curr = currencies[currency]
        const converted = currency === 'USD' ? usdPrice : usdPrice * (rates[currency] || 1)
        const decimals = currency === 'TRY' ? 0 : 2
        return `${curr.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
      },
    }),
    {
      name: 'may-bay-lo-currency',
      partialize: (state) => ({
        currency: state.currency,
        rates: state.rates,
      }),
    }
  )
)
