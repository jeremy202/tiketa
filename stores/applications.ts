import { defineStore } from 'pinia'
import type { Application, Ticket } from '~/types'

export const useApplicationsStore = defineStore('applications', {
  state: () => ({
    applications: [] as Application[],
    loading: false,
    currentApplication: null as Application | null
  }),

  getters: {
    getApplicationsByEventId: (state) => (eventId: string) => {
      return state.applications.filter(app => app.eventId === eventId)
    },

    getTotalBookedSeats: (state) => (eventId: string) => {
      return state.applications
        .filter(app => app.eventId === eventId && app.status === 'paid')
        .reduce((sum, app) => sum + app.quantity, 0)
    },

    getPaidApplications: (state) => {
      return state.applications.filter(app => app.status === 'paid')
    },

    getPendingApplications: (state) => {
      return state.applications.filter(app => app.status === 'pending')
    },

    getApplicationById: (state) => (id: string) => {
      return state.applications.find(app => app.id === id) || null
    },

    getTicketById: (state) => (ticketId: string) => {
      for (const app of state.applications) {
        const ticket = app.tickets.find(t => t.id === ticketId)
        if (ticket) return { ticket, application: app }
      }
      return null
    }
  },

  actions: {
    // Load from localStorage on init
    initializeStore() {
      if (process.client) {
        const saved = localStorage.getItem('ticketing-applications')
        if (saved) {
          try {
            this.applications = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse applications from localStorage')
          }
        }
      }
    },

    // Save to localStorage
    saveToStorage() {
      if (process.client) {
        localStorage.setItem('ticketing-applications', JSON.stringify(this.applications))
      }
    },

    generateId(): string {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },

    generateTicketId(): string {
      return 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    },

    generateQRCode(ticketId: string): string {
      // Generate a mock QR code data URL (in real app, this would be an actual QR code)
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}`
    },

    createApplication(eventId: string, userData: {
      userName: string
      email: string
      phone: string
      quantity: number
    }): Application {
      const application: Application = {
        id: this.generateId(),
        eventId,
        userName: userData.userName,
        email: userData.email,
        phone: userData.phone,
        quantity: userData.quantity,
        status: 'pending',
        tickets: [],
        appliedAt: new Date().toISOString()
      }

      this.applications.push(application)
      this.saveToStorage()
      return application
    },

    generateTickets(applicationId: string): Ticket[] {
      const application = this.getApplicationById(applicationId)
      if (!application) return []

      const tickets: Ticket[] = []
      for (let i = 0; i < application.quantity; i++) {
        const ticketId = this.generateTicketId()
        tickets.push({
          id: ticketId,
          applicationId,
          holderName: i === 0 ? application.userName : `${application.userName} (Guest ${i})`,
          qrCode: this.generateQRCode(ticketId),
          isUsed: false
        })
      }

      application.tickets = tickets
      this.saveToStorage()
      return tickets
    },

    completePayment(applicationId: string): boolean {
      const application = this.getApplicationById(applicationId)
      if (!application) return false

      application.status = 'paid'
      application.paidAt = new Date().toISOString()
      
      // Generate tickets on payment completion
      this.generateTickets(applicationId)
      
      this.saveToStorage()
      return true
    },

    updateTicketHolderName(ticketId: string, newName: string): boolean {
      for (const app of this.applications) {
        const ticket = app.tickets.find(t => t.id === ticketId)
        if (ticket) {
          ticket.holderName = newName
          this.saveToStorage()
          return true
        }
      }
      return false
    },

    markTicketAsUsed(ticketId: string): boolean {
      for (const app of this.applications) {
        const ticket = app.tickets.find(t => t.id === ticketId)
        if (ticket) {
          ticket.isUsed = true
          this.saveToStorage()
          return true
        }
      }
      return false
    },

    deleteApplication(applicationId: string): boolean {
      const index = this.applications.findIndex(app => app.id === applicationId)
      if (index > -1) {
        this.applications.splice(index, 1)
        this.saveToStorage()
        return true
      }
      return false
    },

    clearAllApplications() {
      this.applications = []
      this.saveToStorage()
    },

    setCurrentApplication(application: Application | null) {
      this.currentApplication = application
    }
  }
})
