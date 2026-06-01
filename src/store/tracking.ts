import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered'

export interface TimelineEvent {
  stage: OrderStatus
  label: string
  date: string
  time: string
  completed: boolean
}

export interface OrderItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  size: string
  image: string
}

export interface Order {
  orderNumber: string
  items: OrderItem[]
  total: number
  currency: string
  date: string
  status: OrderStatus
  trackingNumber: string
  estimatedDelivery: string
  timeline: TimelineEvent[]
}

const generateOrderNumber = (): string => {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `MB-${random}`
}

const generateTimeline = (status: OrderStatus, orderDate: string): TimelineEvent[] => {
  const stages: { stage: OrderStatus; label: string }[] = [
    { stage: 'placed', label: 'Order Placed' },
    { stage: 'confirmed', label: 'Confirmed' },
    { stage: 'processing', label: 'Processing' },
    { stage: 'shipped', label: 'Shipped' },
    { stage: 'delivered', label: 'Delivered' },
  ]

  const statusIndex = stages.findIndex((s) => s.stage === status)

  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr)
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  const dayOffsets = [0, 0.5, 2, 3, 7]

  return stages.map((s, i) => ({
    ...s,
    date: addDays(orderDate, dayOffsets[i]),
    time: i === 0 ? '14:30' : i === 1 ? '16:45' : i === 2 ? '09:15' : i === 3 ? '11:00' : '13:20',
    completed: i <= statusIndex,
  }))
}

const mockItems: OrderItem[] = [
  {
    id: 'mock-1',
    name: 'Classic Oxford Shirt',
    brand: 'May Bay Lo',
    price: 185,
    quantity: 1,
    size: 'M',
    image: '/product-1.webp',
  },
  {
    id: 'mock-2',
    name: 'Merino Wool Sweater',
    brand: 'May Bay Lo',
    price: 245,
    quantity: 2,
    size: 'L',
    image: '/product-2.webp',
  },
  {
    id: 'mock-3',
    name: 'Silk Evening Dress',
    brand: 'May Bay Lo',
    price: 890,
    quantity: 1,
    size: 'S',
    image: '/product-3.webp',
  },
  {
    id: 'mock-4',
    name: 'Cashmere Scarf',
    brand: 'May Bay Lo',
    price: 165,
    quantity: 1,
    size: 'One Size',
    image: '/product-4.webp',
  },
]

const createMockOrder = (num: number): Order => {
  const statuses: OrderStatus[] = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']
  const status = statuses[(num - 1) % statuses.length]
  const orderDate = new Date()
  orderDate.setDate(orderDate.getDate() - (num * 2))
  const dateStr = orderDate.toISOString().split('T')[0]

  const items = [mockItems[num % mockItems.length], mockItems[(num + 1) % mockItems.length]]
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    orderNumber: `MB-${String(num).padStart(6, '0')}`,
    items,
    total,
    currency: 'USD',
    date: dateStr,
    status,
    trackingNumber: `MBTK${String(num).padStart(8, '0')}`,
    estimatedDelivery: generateTimeline(status, dateStr)[4]?.date || dateStr,
    timeline: generateTimeline(status, dateStr),
  }
}

const generateMockOrders = (): Record<string, Order> => {
  const orders: Record<string, Order> = {}
  for (let i = 1; i <= 10; i++) {
    const order = createMockOrder(i)
    orders[order.orderNumber] = order
  }
  return orders
}

interface TrackingStore {
  orders: Record<string, Order>
  addOrder: (orderData: Omit<Order, 'orderNumber' | 'timeline' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Order
  getOrder: (orderNumber: string) => Order | undefined
  getAllOrders: () => Order[]
}

export const useTrackingStore = create<TrackingStore>()(
  persist(
    (set, get) => ({
      orders: generateMockOrders(),

      addOrder: (orderData) => {
        const orderNumber = generateOrderNumber()
        const dateStr = new Date().toISOString().split('T')[0]
        const status: OrderStatus = 'placed'
        const timeline = generateTimeline(status, dateStr)

        const order: Order = {
          ...orderData,
          orderNumber,
          date: dateStr,
          status,
          trackingNumber: `MBTK${Math.floor(10000000 + Math.random() * 90000000)}`,
          estimatedDelivery: timeline[4]?.date || dateStr,
          timeline,
        }

        set((state) => ({
          orders: { ...state.orders, [orderNumber]: order },
        }))

        return order
      },

      getOrder: (orderNumber) => {
        return get().orders[orderNumber]
      },

      getAllOrders: () => {
        return Object.values(get().orders)
      },
    }),
    {
      name: 'may-bay-lo-tracking',
    }
  )
)
