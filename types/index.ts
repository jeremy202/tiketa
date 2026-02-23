// Event Types
export interface Event {
  id: string
  title: string
  description: string
  image: string
  location: string
  date: string
  price: number
  seats: number
  category: string
  organizer: string
}

// Ticket Types
export interface Ticket {
  id: string
  applicationId: string
  holderName: string
  qrCode: string
  isUsed: boolean
}

// Application Types
export interface Application {
  id: string
  eventId: string
  userName: string
  email: string
  phone: string
  quantity: number
  status: 'pending' | 'paid'
  tickets: Ticket[]
  appliedAt: string
  paidAt?: string
}

// Notification Types
export type NotificationType = 'reminder' | 'payment_success' | 'event_soon' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  eventId?: string
}

// Filter Types
export interface EventFilters {
  search: string
  priceType: 'all' | 'free' | 'paid'
  dateType: 'all' | 'upcoming' | 'past'
  category: string
}

// Payment Types
export interface PaymentDetails {
  cardNumber: string
  expiry: string
  cvv: string
  name: string
}

// User Types
export interface User {
  name: string
  email: string
  phone: string
}

// Checkout Data
export interface CheckoutData {
  event: Event
  application: Application
  quantity: number
  totalAmount: number
}

// Toast Notification
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

// Category
export interface Category {
  id: string
  name: string
  icon: string
  count: number
}
