import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  size: string
  quantity: number
}

interface CartItemInput {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  size: string
  quantity?: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItemInput) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  emptyCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get()
        const qty = item.quantity ?? 1
        const existingIndex = items.findIndex(
          (i) => i.id === item.id && i.size === item.size
        )
        if (existingIndex >= 0) {
          const updated = [...items]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          }
          set({ items: updated })
        } else {
          set({ items: [...items, { ...item, quantity: qty }] })
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter((i) => !(i.id === id && i.size === size)),
        })
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          ),
        })
      },

      emptyCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'may-bay-lo-cart',
    }
  )
)
