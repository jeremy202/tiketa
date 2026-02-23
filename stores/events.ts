import { defineStore } from 'pinia'
import type { Event } from '~/types'

// Mock Events Data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Afrobeats Summer Festival 2024',
    description: 'Experience the biggest Afrobeats celebration with top artists from across Africa. Live performances, food vendors, and an unforgettable night of music and culture.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    location: 'Eko Atlantic City, Lagos',
    date: '2024-12-15T18:00:00',
    price: 15000,
    seats: 5000,
    category: 'Music',
    organizer: 'Afrobeats Nation'
  },
  {
    id: '2',
    title: 'Tech Summit Nigeria 2024',
    description: 'Join industry leaders, innovators, and tech enthusiasts for a day of insightful talks, networking, and exploring the future of technology in Africa.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    location: 'Landmark Centre, Victoria Island',
    date: '2024-11-20T09:00:00',
    price: 25000,
    seats: 800,
    category: 'Technology',
    organizer: 'TechHub Africa'
  },
  {
    id: '3',
    title: 'Lagos Food & Wine Festival',
    description: 'A culinary journey featuring the finest chefs, wineries, and food artisans. Taste exquisite dishes and discover new flavors.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    location: 'Muri Okunola Park, VI',
    date: '2024-10-30T14:00:00',
    price: 10000,
    seats: 1200,
    category: 'Food & Drink',
    organizer: 'Culinary Arts NG'
  },
  {
    id: '4',
    title: 'Free Coding Workshop for Beginners',
    description: 'Learn the basics of web development in this free workshop. No experience required. Laptops will be provided.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    location: 'Andela Nigeria Office, Lagos',
    date: '2024-11-05T10:00:00',
    price: 0,
    seats: 100,
    category: 'Education',
    organizer: 'Code Lagos'
  },
  {
    id: '5',
    title: 'Nollywood Movie Premiere: Echoes',
    description: 'Be the first to watch the most anticipated Nollywood film of the year. Red carpet event with cast and crew.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    location: 'Filmhouse Cinemas, IMAX Lekki',
    date: '2024-12-01T19:00:00',
    price: 8000,
    seats: 300,
    category: 'Entertainment',
    organizer: 'FilmOne Distribution'
  },
  {
    id: '6',
    title: 'Yoga & Wellness Retreat',
    description: 'A day of relaxation, meditation, and self-care. Includes yoga sessions, spa treatments, and healthy meals.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    location: 'Epe Resort & Spa',
    date: '2024-11-25T08:00:00',
    price: 35000,
    seats: 50,
    category: 'Health & Wellness',
    organizer: 'Zen Life Nigeria'
  },
  {
    id: '7',
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch for funding. Network with investors and entrepreneurs. Free entry!',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    location: 'Co-Creation Hub, Yaba',
    date: '2024-10-28T14:00:00',
    price: 0,
    seats: 200,
    category: 'Business',
    organizer: 'Ventures Platform'
  },
  {
    id: '8',
    title: 'Contemporary Art Exhibition',
    description: 'Explore works by emerging Nigerian artists. Opening night with artist talks and cocktails.',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80',
    location: 'Nike Art Gallery, Lekki',
    date: '2024-11-10T16:00:00',
    price: 5000,
    seats: 150,
    category: 'Art & Culture',
    organizer: 'ArtX Lagos'
  },
  {
    id: '9',
    title: 'Comedy Night: Laugh Fest',
    description: 'An evening of non-stop laughter with Nigeria\'s finest comedians. Special guest performances.',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    location: 'Muson Centre, Onikan',
    date: '2024-12-08T19:30:00',
    price: 12000,
    seats: 600,
    category: 'Entertainment',
    organizer: 'Funnybone Productions'
  },
  {
    id: '10',
    title: 'Marathon: Run Lagos 2024',
    description: 'Join thousands of runners in the biggest marathon in West Africa. 5K, 10K, and full marathon options.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    location: 'TBS, Lagos Island',
    date: '2024-11-12T06:00:00',
    price: 8000,
    seats: 5000,
    category: 'Sports',
    organizer: 'Lagos State Sports Commission'
  },
  {
    id: '11',
    title: 'Fashion Week Lagos',
    description: 'The ultimate fashion experience showcasing top African designers. Runway shows and after-parties.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    location: 'Federal Palace Hotel, VI',
    date: '2024-10-25T18:00:00',
    price: 20000,
    seats: 400,
    category: 'Fashion',
    organizer: 'Style House Files'
  },
  {
    id: '12',
    title: 'Free Financial Literacy Seminar',
    description: 'Learn about investing, savings, and building wealth. Expert speakers from leading banks.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    location: 'Stanbic IBTC Tower, Marina',
    date: '2024-11-18T11:00:00',
    price: 0,
    seats: 250,
    category: 'Education',
    organizer: 'Financial Literacy NG'
  }
]

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: mockEvents,
    loading: false,
    selectedEvent: null as Event | null,
    categories: ['All', 'Music', 'Technology', 'Food & Drink', 'Education', 'Entertainment', 'Health & Wellness', 'Business', 'Art & Culture', 'Sports', 'Fashion']
  }),

  getters: {
    getEventById: (state) => (id: string) => {
      return state.events.find(event => event.id === id) || null
    },

    getUpcomingEvents: (state) => {
      const now = new Date()
      return state.events.filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    getPastEvents: (state) => {
      const now = new Date()
      return state.events.filter(event => new Date(event.date) <= now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },

    getFreeEvents: (state) => {
      return state.events.filter(event => event.price === 0)
    },

    getPaidEvents: (state) => {
      return state.events.filter(event => event.price > 0)
    },

    getEventsByCategory: (state) => (category: string) => {
      if (category === 'All') return state.events
      return state.events.filter(event => event.category === category)
    },

    getAvailableSeats: (state) => (eventId: string, applications: any[]) => {
      const event = state.events.find(e => e.id === eventId)
      if (!event) return 0
      
      const bookedSeats = applications
        .filter(app => app.eventId === eventId && app.status === 'paid')
        .reduce((sum, app) => sum + app.quantity, 0)
      
      return Math.max(0, event.seats - bookedSeats)
    }
  },

  actions: {
    async fetchEvents() {
      this.loading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      this.loading = false
      return this.events
    },

    selectEvent(event: Event | null) {
      this.selectedEvent = event
    },

    filterEvents(filters: { search?: string; priceType?: string; dateType?: string; category?: string }) {
      let filtered = [...this.events]
      const now = new Date()

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.category.toLowerCase().includes(searchLower)
        )
      }

      // Price filter
      if (filters.priceType === 'free') {
        filtered = filtered.filter(event => event.price === 0)
      } else if (filters.priceType === 'paid') {
        filtered = filtered.filter(event => event.price > 0)
      }

      // Date filter
      if (filters.dateType === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.date) > now)
      } else if (filters.dateType === 'past') {
        filtered = filtered.filter(event => new Date(event.date) <= now)
      }

      // Category filter
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(event => event.category === filters.category)
      }

      return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
  }
})
