import { defineStore } from 'pinia'
import type { Notification, NotificationType } from '~/types'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    toasts: [] as { id: string; type: NotificationType; title: string; message: string; duration: number }[],
    isOpen: false
  }),

  getters: {
    unreadCount: (state) => {
      return state.notifications.filter(n => !n.read).length
    },

    getUnreadNotifications: (state) => {
      return state.notifications.filter(n => !n.read).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },

    getAllNotifications: (state) => {
      return state.notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },

    getNotificationsByEvent: (state) => (eventId: string) => {
      return state.notifications.filter(n => n.eventId === eventId)
    }
  },

  actions: {
    // Load from localStorage on init
    initializeStore() {
      if (process.client) {
        const saved = localStorage.getItem('ticketing-notifications')
        if (saved) {
          try {
            this.notifications = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse notifications from localStorage')
          }
        }
      }
    },

    // Save to localStorage
    saveToStorage() {
      if (process.client) {
        localStorage.setItem('ticketing-notifications', JSON.stringify(this.notifications))
      }
    },

    generateId(): string {
      return Math.random().toString(36).substring(2, 15)
    },

    addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
      const newNotification: Notification = {
        ...notification,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        read: false
      }

      this.notifications.unshift(newNotification)
      this.saveToStorage()
      
      // Also show as toast
      this.showToast(notification.type, notification.title, notification.message)
      
      return newNotification
    },

    markAsRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        this.saveToStorage()
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => n.read = true)
      this.saveToStorage()
    },

    deleteNotification(notificationId: string) {
      const index = this.notifications.findIndex(n => n.id === notificationId)
      if (index > -1) {
        this.notifications.splice(index, 1)
        this.saveToStorage()
      }
    },

    clearAllNotifications() {
      this.notifications = []
      this.saveToStorage()
    },

    togglePanel() {
      this.isOpen = !this.isOpen
    },

    closePanel() {
      this.isOpen = false
    },

    openPanel() {
      this.isOpen = true
    },

    // Toast notifications
    showToast(type: NotificationType, title: string, message: string, duration: number = 5000) {
      const toast = {
        id: this.generateId(),
        type,
        title,
        message,
        duration
      }
      
      this.toasts.push(toast)
      
      // Auto remove after duration
      setTimeout(() => {
        this.removeToast(toast.id)
      }, duration)
    },

    removeToast(toastId: string) {
      const index = this.toasts.findIndex(t => t.id === toastId)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    // Scheduled notifications
    scheduleEventReminder(eventId: string, eventTitle: string, eventDate: string) {
      const eventTime = new Date(eventDate).getTime()
      const now = Date.now()
      
      // 24 hours before
      const oneDayBefore = eventTime - (24 * 60 * 60 * 1000)
      if (oneDayBefore > now) {
        const delay = oneDayBefore - now
        setTimeout(() => {
          this.addNotification({
            type: 'event_soon',
            title: 'Event Tomorrow!',
            message: `"${eventTitle}" is happening in 24 hours. Get ready!`,
            eventId
          })
        }, Math.min(delay, 2147483647)) // Max setTimeout delay
      }

      // 1 hour before
      const oneHourBefore = eventTime - (60 * 60 * 1000)
      if (oneHourBefore > now) {
        const delay = oneHourBefore - now
        setTimeout(() => {
          this.addNotification({
            type: 'reminder',
            title: 'Event Starting Soon!',
            message: `"${eventTitle}" starts in 1 hour. Don't be late!`,
            eventId
          })
        }, Math.min(delay, 2147483647))
      }
    },

    // Check for upcoming events and create notifications
    checkUpcomingEvents(events: any[], applications: any[]) {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      applications.forEach(app => {
        if (app.status === 'paid') {
          const event = events.find(e => e.id === app.eventId)
          if (event) {
            const eventDate = new Date(event.date)
            
            // Check if event is within 24 hours
            if (eventDate > now && eventDate <= tomorrow) {
              // Check if we already have a notification for this
              const existing = this.notifications.find(n => 
                n.eventId === event.id && n.type === 'event_soon'
              )
              
              if (!existing) {
                this.addNotification({
                  type: 'event_soon',
                  title: 'Event Coming Up!',
                  message: `"${event.title}" is happening within 24 hours!`,
                  eventId: event.id
                })
              }
            }
          }
        }
      })
    }
  }
})
