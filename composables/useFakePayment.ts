import { ref } from 'vue'

export interface PaymentState {
  isProcessing: boolean
  isSuccess: boolean
  error: string | null
}

export const useFakePayment = () => {
  const state = ref<PaymentState>({
    isProcessing: false,
    isSuccess: false,
    error: null
  })

  const processPayment = async (amount: number, cardDetails: {
    cardNumber: string
    expiry: string
    cvv: string
    name: string
  }): Promise<boolean> => {
    state.value.isProcessing = true
    state.value.error = null

    try {
      // Validate card details
      if (!validateCardNumber(cardDetails.cardNumber)) {
        throw new Error('Invalid card number')
      }

      if (!validateExpiry(cardDetails.expiry)) {
        throw new Error('Invalid expiry date')
      }

      if (!validateCVV(cardDetails.cvv)) {
        throw new Error('Invalid CVV')
      }

      if (cardDetails.name.trim().length < 3) {
        throw new Error('Please enter cardholder name')
      }

      // Simulate API delay (2-3 seconds)
      const delay = 2000 + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))

      // 95% success rate for demo
      const isSuccess = Math.random() > 0.05

      if (!isSuccess) {
        throw new Error('Payment declined. Please try again.')
      }

      state.value.isSuccess = true
      return true

    } catch (error: any) {
      state.value.error = error.message || 'Payment failed'
      return false

    } finally {
      state.value.isProcessing = false
    }
  }

  const validateCardNumber = (cardNumber: string): boolean => {
    // Remove spaces and dashes
    const clean = cardNumber.replace(/[\s-]/g, '')
    // Check if it's 13-19 digits
    return /^\d{13,19}$/.test(clean)
  }

  const validateExpiry = (expiry: string): boolean => {
    // Format: MM/YY
    const match = expiry.match(/^(\d{2})\/(\d{2})$/)
    if (!match) return false

    const month = parseInt(match[1])
    const year = parseInt(match[2]) + 2000

    if (month < 1 || month > 12) return false

    const now = new Date()
    const expiryDate = new Date(year, month - 1)
    
    return expiryDate >= new Date(now.getFullYear(), now.getMonth())
  }

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
  }

  const formatCardNumber = (value: string): string => {
    const clean = value.replace(/\D/g, '')
    const parts = []
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.substring(i, i + 4))
    }
    return parts.join(' ')
  }

  const formatExpiry = (value: string): string => {
    const clean = value.replace(/\D/g, '')
    if (clean.length >= 2) {
      return clean.substring(0, 2) + '/' + clean.substring(2, 4)
    }
    return clean
  }

  const resetState = () => {
    state.value = {
      isProcessing: false,
      isSuccess: false,
      error: null
    }
  }

  return {
    state,
    processPayment,
    formatCardNumber,
    formatExpiry,
    resetState
  }
}
