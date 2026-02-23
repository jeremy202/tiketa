<template>
  <div class="min-h-screen bg-grid pt-20 pb-16">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SkeletonLoader type="custom" :count="1">
        <div class="h-8 bg-white/10 rounded w-1/3 mb-6" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="h-48 bg-white/5 rounded-2xl" />
            <div class="h-32 bg-white/5 rounded-2xl" />
          </div>
          <div class="h-96 bg-white/5 rounded-2xl" />
        </div>
      </SkeletonLoader>
    </div>

    <!-- Checkout Content -->
    <div v-else-if="event && application" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button
        class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        @click="router.back()"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        Back to Event
      </button>

      <h1 class="text-3xl font-bold text-white mb-8">Complete Your Purchase</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Payment Form -->
        <div class="space-y-6">
          <!-- Credit Card -->
          <div class="credit-card h-56 p-6 relative overflow-hidden">
            <div class="absolute top-4 right-4">
              <div class="flex gap-2">
                <div class="w-12 h-8 bg-white/20 rounded" />
                <div class="w-12 h-8 bg-white/20 rounded" />
              </div>
            </div>
            
            <div class="absolute bottom-6 left-6 right-6">
              <div class="mb-4">
                <p class="text-white/60 text-xs mb-1">Card Number</p>
                <p class="text-white text-xl font-mono tracking-wider">
                  {{ cardNumber || '•••• •••• •••• ••••' }}
                </p>
              </div>
              <div class="flex justify-between">
                <div>
                  <p class="text-white/60 text-xs mb-1">Cardholder</p>
                  <p class="text-white font-medium">{{ cardName || 'YOUR NAME' }}</p>
                </div>
                <div>
                  <p class="text-white/60 text-xs mb-1">Expires</p>
                  <p class="text-white font-medium">{{ cardExpiry || 'MM/YY' }}</p>
                </div>
              </div>
            </div>

            <!-- Card Shine Effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </div>

          <!-- Payment Form -->
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Payment Details</h2>
            
            <form @submit.prevent="processPayment">
              <!-- Card Number -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <div class="relative">
                  <CreditCardIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="cardNumber"
                    type="text"
                    maxlength="19"
                    placeholder="1234 5678 9012 3456"
                    class="input-glass pl-12"
                    @input="formatCardNumber"
                  >
                </div>
              </div>

              <!-- Cardholder Name -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                <input
                  v-model="cardName"
                  type="text"
                  placeholder="Name on card"
                  class="input-glass"
                >
              </div>

              <div class="grid grid-cols-2 gap-4 mb-6">
                <!-- Expiry -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                  <input
                    v-model="cardExpiry"
                    type="text"
                    maxlength="5"
                    placeholder="MM/YY"
                    class="input-glass"
                    @input="formatExpiry"
                  >
                </div>

                <!-- CVV -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                  <div class="relative">
                    <LockClosedIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      v-model="cardCvv"
                      type="password"
                      maxlength="4"
                      placeholder="123"
                      class="input-glass pl-12"
                    >
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <AnimatedButton
                type="submit"
                variant="accent"
                size="lg"
                class="w-full"
                :loading="paymentState.isProcessing"
                :loading-text="'Processing Payment...'"
                :success="paymentState.isSuccess"
                :success-text="'Payment Successful!'"
              >
                <LockClosedIcon class="w-5 h-5" />
                Pay {{ formatPrice(totalAmount) }}
              </AnimatedButton>
            </form>

            <!-- Security Note -->
            <div class="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <ShieldCheckIcon class="w-4 h-4" />
              <span>Secure 256-bit SSL encrypted payment</span>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div>
          <div class="glass-card rounded-2xl p-6 sticky top-24">
            <h2 class="text-lg font-semibold text-white mb-4">Order Summary</h2>

            <!-- Event Info -->
            <div class="flex gap-4 mb-6">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-20 h-20 rounded-xl object-cover"
              >
              <div>
                <h3 class="font-semibold text-white mb-1">{{ event.title }}</h3>
                <p class="text-sm text-gray-400">{{ formatDate(event.date) }}</p>
                <p class="text-sm text-gray-400">{{ event.location }}</p>
              </div>
            </div>

            <!-- Ticket Details -->
            <div class="space-y-3 mb-6 pb-6 border-b border-white/10">
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Ticket Price</span>
                <span class="text-white">{{ formatPrice(event.price) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Quantity</span>
                <span class="text-white">× {{ application.quantity }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Booking Fee</span>
                <span class="text-white">{{ formatPrice(bookingFee) }}</span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex items-center justify-between mb-6">
              <span class="text-lg font-semibold text-white">Total</span>
              <span class="text-2xl font-bold text-gradient">{{ formatPrice(totalAmount) }}</span>
            </div>

            <!-- Applied By -->
            <div class="p-4 rounded-xl bg-white/5">
              <p class="text-sm text-gray-400 mb-1">Applied by</p>
              <p class="text-white font-medium">{{ application.userName }}</p>
              <p class="text-sm text-gray-400">{{ application.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
      <EmptyState
        icon="credit-card"
        title="Checkout unavailable"
        description="We couldn't find your application or the event. Please try again."
        action-text="Back to Events"
        variant="purple"
        @action="router.push('/')"
      />
    </div>

    <!-- Success Modal with Confetti -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeSuccessModal" />
        
        <div class="relative glass-card rounded-3xl p-8 max-w-md w-full text-center">
          <!-- Success Animation -->
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircleIcon class="w-12 h-12 text-green-400 animate-bounce" />
          </div>

          <h2 class="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p class="text-gray-400 mb-6">
            Your tickets for "{{ event?.title }}" have been confirmed.
          </p>

          <div class="p-4 rounded-xl bg-white/5 mb-6">
            <p class="text-sm text-gray-400 mb-1">Order ID</p>
            <p class="text-white font-mono">{{ application?.id.toUpperCase() }}</p>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 py-3 px-4 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
              @click="viewTickets"
            >
              View Tickets
            </button>
            <button
              class="flex-1 py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
              @click="goToDashboard"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confetti Canvas -->
    <canvas
      v-if="showConfetti"
      ref="confettiCanvas"
      class="confetti-canvas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  CreditCardIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { useEventsStore } from '~/stores/events'
import { useApplicationsStore } from '~/stores/applications'
import { useNotificationsStore } from '~/stores/notifications'
import { useFakePayment } from '~/composables/useFakePayment'
import { useNotifications } from '~/composables/useNotifications'
import AnimatedButton from '~/components/AnimatedButton.vue'
import SkeletonLoader from '~/components/SkeletonLoader.vue'
import EmptyState from '~/components/EmptyState.vue'

// @ts-ignore
import confetti from 'canvas-confetti'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const applicationsStore = useApplicationsStore()
const notificationsStore = useNotificationsStore()
const { state: paymentState, processPayment: processFakePayment, resetState } = useFakePayment()
const { showPaymentSuccess, showError } = useNotifications()

const loading = ref(true)
const showSuccessModal = ref(false)
const showConfetti = ref(false)
const confettiCanvas = ref<HTMLCanvasElement | null>(null)

// Card inputs
const cardNumber = ref('')
const cardName = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const event = computed(() => {
  return eventsStore.getEventById(route.params.id as string)
})

const application = computed(() => {
  const appId = route.query.application as string
  if (!appId) return null
  return applicationsStore.getApplicationById(appId)
})

const bookingFee = computed(() => {
  // 2.5% booking fee
  if (!event.value || !application.value) return 0
  return Math.round(event.value.price * application.value.quantity * 0.025)
})

const totalAmount = computed(() => {
  if (!event.value || !application.value) return 0
  return (event.value.price * application.value.quantity) + bookingFee.value
})

const formatCardNumber = () => {
  // Remove non-digits
  let value = cardNumber.value.replace(/\D/g, '')
  // Add space every 4 digits
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
  // Limit to 19 characters (16 digits + 3 spaces)
  cardNumber.value = value.slice(0, 19)
}

const formatExpiry = () => {
  // Remove non-digits
  let value = cardExpiry.value.replace(/\D/g, '')
  // Add slash after 2 digits
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  cardExpiry.value = value
}

const processPayment = async () => {
  if (!event.value || !application.value) return

  const success = await processFakePayment(totalAmount.value, {
    cardNumber: cardNumber.value,
    expiry: cardExpiry.value,
    cvv: cardCvv.value,
    name: cardName.value
  })

  if (success) {
    // Complete the application
    applicationsStore.completePayment(application.value.id)
    
    // Add notification
    notificationsStore.addNotification({
      type: 'payment_success',
      title: 'Payment Successful!',
      message: `Your tickets for "${event.value.title}" are confirmed.`,
      eventId: event.value.id
    })

    // Show success modal and confetti
    showSuccessModal.value = true
    showConfetti.value = true
    
    // Trigger confetti
    nextTick(() => {
      triggerConfetti()
    })

    // Show toast
    showPaymentSuccess(event.value.title)
  } else {
    showError(paymentState.error || 'Payment failed. Please try again.')
  }
}

const triggerConfetti = () => {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8b5cf6', '#ec4899', '#3b82f6']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#8b5cf6', '#ec4899', '#3b82f6']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

const viewTickets = () => {
  if (application.value?.tickets.length) {
    router.push(`/ticket/${application.value.tickets[0].id}`)
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize
onMounted(async () => {
  applicationsStore.initializeStore()
  notificationsStore.initializeStore()
  await eventsStore.fetchEvents()
  loading.value = false
})
</script>
