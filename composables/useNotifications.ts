import { ref, computed } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration: number
}

export const useNotifications = () => {
  const toasts = ref<Toast[]>([])

  const activeToasts = computed(() => toasts.value)

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15)
  }

  const showToast = (
    type: Toast['type'],
    title: string,
    message: string,
    duration: number = 5000
  ): string => {
    const id = generateId()
    
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration
    }

    toasts.value.push(toast)

    // Auto remove
    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (title: string, message: string, duration?: number) => {
    return showToast('success', title, message, duration)
  }

  const error = (title: string, message: string, duration?: number) => {
    return showToast('error', title, message, duration)
  }

  const info = (title: string, message: string, duration?: number) => {
    return showToast('info', title, message, duration)
  }

  const warning = (title: string, message: string, duration?: number) => {
    return showToast('warning', title, message, duration)
  }

  const clearAll = () => {
    toasts.value = []
  }

  // Convenience methods for common notifications
  const showPaymentSuccess = (eventTitle: string) => {
    return success(
      'Payment Successful!',
      `Your tickets for "${eventTitle}" have been confirmed.`,
      6000
    )
  }

  const showApplicationSuccess = (eventTitle: string, isFree: boolean) => {
    if (isFree) {
      return success(
        'Application Confirmed!',
        `You're all set for "${eventTitle}". Check your email for details.`,
        6000
      )
    }
    return info(
      'Application Created',
      `Please complete payment to secure your spot at "${eventTitle}".`,
      6000
    )
  }

  const showTicketShared = () => {
    return success(
      'Link Copied!',
      'Ticket link has been copied to clipboard.',
      4000
    )
  }

  const showError = (message: string) => {
    return error('Oops!', message, 5000)
  }

  return {
    toasts: activeToasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clearAll,
    showPaymentSuccess,
    showApplicationSuccess,
    showTicketShared,
    showError
  }
}
