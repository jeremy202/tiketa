<template>
  <div class="ticket p-6 relative overflow-hidden">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-pink/10" />
    
    <!-- Content -->
    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <span 
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
            :class="statusClass"
          >
            {{ statusText }}
          </span>
          <h3 class="text-xl font-bold text-white">{{ event?.title }}</h3>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-gradient">{{ application.quantity }}</p>
          <p class="text-sm text-gray-400">ticket{{ application.quantity > 1 ? 's' : '' }}</p>
        </div>
      </div>

      <!-- Event Details -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center gap-3 text-gray-300">
          <CalendarIcon class="w-5 h-5 text-primary-400" />
          <span>{{ formatDate(event?.date) }}</span>
        </div>
        <div class="flex items-center gap-3 text-gray-300">
          <MapPinIcon class="w-5 h-5 text-accent-pink" />
          <span>{{ event?.location }}</span>
        </div>
        <div class="flex items-center gap-3 text-gray-300">
          <ClockIcon class="w-5 h-5 text-accent-blue" />
          <CountdownTimer :target-date="event?.date" />
        </div>
      </div>

      <!-- Countdown -->
      <div v-if="event && isUpcoming" class="mb-6 p-4 rounded-xl bg-white/5">
        <p class="text-sm text-gray-400 mb-2">Event starts in:</p>
        <div class="flex items-center gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-gradient">{{ countdown.days }}</p>
            <p class="text-xs text-gray-500">DAYS</p>
          </div>
          <span class="text-2xl font-bold text-gray-600">:</span>
          <div class="text-center">
            <p class="text-2xl font-bold text-gradient">{{ countdown.hours }}</p>
            <p class="text-xs text-gray-500">HRS</p>
          </div>
          <span class="text-2xl font-bold text-gray-600">:</span>
          <div class="text-center">
            <p class="text-2xl font-bold text-gradient">{{ countdown.minutes }}</p>
            <p class="text-xs text-gray-500">MIN</p>
          </div>
          <span class="text-2xl font-bold text-gray-600">:</span>
          <div class="text-center">
            <p class="text-2xl font-bold text-gradient">{{ countdown.seconds }}</p>
            <p class="text-xs text-gray-500">SEC</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3">
        <button
          v-if="application.status === 'paid'"
          class="flex-1 py-2.5 px-4 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors flex items-center justify-center gap-2"
          @click="viewTickets"
        >
          <TicketIcon class="w-4 h-4" />
          View Tickets
        </button>
        
        <button
          v-else
          class="flex-1 py-2.5 px-4 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-2"
          @click="completePayment"
        >
          <CreditCardIcon class="w-4 h-4" />
          Complete Payment
        </button>

        <button
          class="py-2.5 px-4 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          @click="shareApplication"
        >
          <ShareIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
    <div class="absolute -top-10 -left-10 w-40 h-40 bg-accent-pink/10 rounded-full blur-3xl" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TicketIcon,
  CreditCardIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'
import type { Application, Event } from '~/types'
import { useNotifications } from '~/composables/useNotifications'

interface Props {
  application: Application
  event: Event | undefined
}

const props = defineProps<Props>()
const router = useRouter()
const { showTicketShared, showError } = useNotifications()

const statusText = computed(() => {
  return props.application.status === 'paid' ? 'Paid & Confirmed' : 'Payment Pending'
})

const statusClass = computed(() => {
  return props.application.status === 'paid'
    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
})

const isUpcoming = computed(() => {
  if (!props.event) return false
  return new Date(props.event.date) > new Date()
})

// Countdown
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownInterval: NodeJS.Timeout | null = null

const updateCountdown = () => {
  if (!props.event) return
  
  const eventDate = new Date(props.event.date)
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  
  if (diff <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  
  countdown.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'TBD'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewTickets = () => {
  if (props.application.tickets.length > 0) {
    router.push(`/ticket/${props.application.tickets[0].id}`)
  }
}

const completePayment = () => {
  router.push(`/checkout/${props.application.eventId}?application=${props.application.id}`)
}

const shareApplication = async () => {
  try {
    if (props.application.tickets.length > 0) {
      const link = `${window.location.origin}/ticket/${props.application.tickets[0].id}`
      await navigator.clipboard.writeText(link)
      showTicketShared()
    } else {
      showError('No tickets available to share')
    }
  } catch (error) {
    showError('Failed to copy link')
  }
}
</script>
