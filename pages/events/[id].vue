<template>
  <div class="min-h-screen bg-grid pt-20 pb-16">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SkeletonLoader type="detail" />
    </div>

    <!-- Event Details -->
    <div v-else-if="event" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button
        class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        @click="router.back()"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        Back to Events
      </button>

      <!-- Hero Image -->
      <div class="relative h-64 sm:h-96 rounded-3xl overflow-hidden mb-8">
        <img
          :src="event.image"
          :alt="event.title"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <!-- Overlays -->
        <div class="absolute top-4 left-4 flex gap-2">
          <span class="px-4 py-2 rounded-full text-sm font-medium bg-primary-500/80 text-white backdrop-blur-sm">
            {{ event.category }}
          </span>
        </div>

        <div class="absolute top-4 right-4">
          <span 
            class="px-4 py-2 rounded-full text-sm font-bold"
            :class="event.price === 0 ? 'bg-green-500/80 text-white' : 'bg-accent-pink/80 text-white'"
          >
            {{ event.price === 0 ? 'FREE' : formatPrice(event.price) }}
          </span>
        </div>

        <!-- Title -->
        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{{ event.title }}</h1>
          <p class="text-gray-300 text-lg">by {{ event.organizer }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Event Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description -->
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-xl font-bold text-white mb-4">About This Event</h2>
            <p class="text-gray-300 leading-relaxed">{{ event.description }}</p>
          </div>

          <!-- Event Details -->
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-xl font-bold text-white mb-4">Event Details</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon class="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p class="text-sm text-gray-400">Date & Time</p>
                  <p class="text-white font-medium">{{ formatDate(event.date) }}</p>
                  <p class="text-gray-400">{{ formatTime(event.date) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon class="w-6 h-6 text-accent-pink" />
                </div>
                <div>
                  <p class="text-sm text-gray-400">Location</p>
                  <p class="text-white font-medium">{{ event.location }}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                  <UserGroupIcon class="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <p class="text-sm text-gray-400">Capacity</p>
                  <p class="text-white font-medium">{{ event.seats }} seats</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <TicketIcon class="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p class="text-sm text-gray-400">Price</p>
                  <p class="text-white font-medium">
                    {{ event.price === 0 ? 'Free' : formatPrice(event.price) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Seat Availability -->
          <div class="glass-card rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-white">Seat Availability</h2>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="availabilityStatus.class"
              >
                {{ availabilityStatus.text }}
              </span>
            </div>
            
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-400">{{ seatsLeft }} seats left</span>
                <span class="text-gray-400">of {{ event.seats }}</span>
              </div>
              <div class="h-4 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="availabilityBarColor"
                  :style="{ width: `${availabilityPercentage}%` }"
                />
              </div>
            </div>

            <div v-if="isLowAvailability" class="flex items-center gap-2 text-orange-400">
              <FireIcon class="w-5 h-5" />
              <span class="text-sm font-medium">Selling fast! Book now to secure your spot.</span>
            </div>
          </div>
        </div>

        <!-- Right Column - Application Form -->
        <div class="lg:col-span-1">
          <div class="glass-card rounded-2xl p-6 sticky top-24">
            <h2 class="text-xl font-bold text-white mb-6">
              {{ event.price === 0 ? 'Register Now' : 'Get Your Tickets' }}
            </h2>

            <form @submit.prevent="handleSubmit">
              <!-- Full Name -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  v-model="form.userName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  class="input-glass"
                >
              </div>

              <!-- Email -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  class="input-glass"
                >
              </div>

              <!-- Phone -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  class="input-glass"
                >
              </div>

              <!-- Quantity -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">Number of Tickets</label>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                    :disabled="form.quantity <= 1"
                    @click="decrementQuantity"
                  >
                    <MinusIcon class="w-5 h-5" />
                  </button>
                  <span class="text-xl font-bold text-white w-12 text-center">{{ form.quantity }}</span>
                  <button
                    type="button"
                    class="w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                    :disabled="form.quantity >= Math.min(10, seatsLeft)"
                    @click="incrementQuantity"
                  >
                    <PlusIcon class="w-5 h-5" />
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">Maximum {{ Math.min(10, seatsLeft) }} tickets per order</p>
              </div>

              <!-- Price Summary -->
              <div v-if="event.price > 0" class="mb-6 p-4 rounded-xl bg-white/5">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400">Price per ticket</span>
                  <span class="text-white">{{ formatPrice(event.price) }}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400">Quantity</span>
                  <span class="text-white">× {{ form.quantity }}</span>
                </div>
                <div class="border-t border-white/10 pt-2 mt-2">
                  <div class="flex items-center justify-between">
                    <span class="text-white font-semibold">Total</span>
                    <span class="text-2xl font-bold text-gradient">{{ formatPrice(totalPrice) }}</span>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <AnimatedButton
                type="submit"
                :variant="event.price === 0 ? 'primary' : 'accent'"
                size="lg"
                class="w-full"
                :loading="submitting"
                :loading-text="event.price === 0 ? 'Registering...' : 'Processing...'"
                :disabled="seatsLeft === 0"
              >
                <template v-if="seatsLeft === 0">
                  Sold Out
                </template>
                <template v-else-if="event.price === 0">
                  <CheckCircleIcon class="w-5 h-5" />
                  Register for Free
                </template>
                <template v-else>
                  <CreditCardIcon class="w-5 h-5" />
                  Proceed to Payment
                </template>
              </AnimatedButton>
            </form>

            <!-- Trust Badges -->
            <div class="mt-6 flex items-center justify-center gap-4 text-gray-500">
              <div class="flex items-center gap-1">
                <ShieldCheckIcon class="w-4 h-4" />
                <span class="text-xs">Secure</span>
              </div>
              <div class="flex items-center gap-1">
                <LockClosedIcon class="w-4 h-4" />
                <span class="text-xs">Encrypted</span>
              </div>
              <div class="flex items-center gap-1">
                <StarIcon class="w-4 h-4" />
                <span class="text-xs">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
      <EmptyState
        icon="search"
        title="Event not found"
        description="The event you're looking for doesn't exist or has been removed."
        action-text="Browse Events"
        variant="purple"
        @action="router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  TicketIcon,
  FireIcon,
  MinusIcon,
  PlusIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { useEventsStore } from '~/stores/events'
import { useApplicationsStore } from '~/stores/applications'
import { useNotificationsStore } from '~/stores/notifications'
import { useNotifications } from '~/composables/useNotifications'
import AnimatedButton from '~/components/AnimatedButton.vue'
import SkeletonLoader from '~/components/SkeletonLoader.vue'
import EmptyState from '~/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const applicationsStore = useApplicationsStore()
const notificationsStore = useNotificationsStore()
const { showApplicationSuccess, showError } = useNotifications()

const loading = ref(true)
const submitting = ref(false)

const event = computed(() => {
  return eventsStore.getEventById(route.params.id as string)
})

const seatsLeft = computed(() => {
  if (!event.value) return 0
  const booked = applicationsStore.getTotalBookedSeats(event.value.id)
  return Math.max(0, event.value.seats - booked)
})

const availabilityPercentage = computed(() => {
  if (!event.value) return 0
  return (seatsLeft.value / event.value.seats) * 100
})

const isLowAvailability = computed(() => {
  return availabilityPercentage.value < 20 && seatsLeft.value > 0
})

const availabilityStatus = computed(() => {
  if (seatsLeft.value === 0) {
    return { text: 'Sold Out', class: 'bg-red-500/20 text-red-400 border border-red-500/30' }
  }
  if (availabilityPercentage.value < 20) {
    return { text: 'Almost Full', class: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' }
  }
  if (availabilityPercentage.value < 50) {
    return { text: 'Filling Fast', class: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' }
  }
  return { text: 'Available', class: 'bg-green-500/20 text-green-400 border border-green-500/30' }
})

const availabilityBarColor = computed(() => {
  if (seatsLeft.value === 0) return 'bg-gray-500'
  if (availabilityPercentage.value < 20) return 'bg-gradient-to-r from-orange-500 to-red-500'
  if (availabilityPercentage.value < 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-green-500 to-emerald-500'
})

const totalPrice = computed(() => {
  if (!event.value) return 0
  return event.value.price * form.value.quantity
})

// Form
const form = ref({
  userName: '',
  email: '',
  phone: '',
  quantity: 1
})

const incrementQuantity = () => {
  if (form.value.quantity < Math.min(10, seatsLeft.value)) {
    form.value.quantity++
  }
}

const decrementQuantity = () => {
  if (form.value.quantity > 1) {
    form.value.quantity--
  }
}

const handleSubmit = async () => {
  if (!event.value || seatsLeft.value === 0) return

  submitting.value = true

  try {
    // Create application
    const application = applicationsStore.createApplication(
      event.value.id,
      {
        userName: form.value.userName,
        email: form.value.email,
        phone: form.value.phone,
        quantity: form.value.quantity
      }
    )

    // Show success notification
    showApplicationSuccess(event.value.title, event.value.price === 0)

    // Schedule event reminders
    notificationsStore.scheduleEventReminder(
      event.value.id,
      event.value.title,
      event.value.date
    )

    if (event.value.price === 0) {
      // Free event - auto confirm
      applicationsStore.completePayment(application.id)
      
      // Add notification
      notificationsStore.addNotification({
        type: 'payment_success',
        title: 'Registration Confirmed!',
        message: `You're registered for "${event.value.title}"`,
        eventId: event.value.id
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      // Paid event - redirect to checkout
      router.push(`/checkout/${event.value.id}?application=${application.id}`)
    }

  } catch (error) {
    showError('Something went wrong. Please try again.')
  } finally {
    submitting.value = false
  }
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-NG', {
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
