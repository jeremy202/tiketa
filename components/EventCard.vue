<template>
  <div 
    class="glass-card rounded-2xl overflow-hidden card-glow group cursor-pointer"
    @click="navigateToEvent"
  >
    <!-- Image Container -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="event.image" 
        :alt="event.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      <!-- Price Badge -->
      <div class="absolute top-4 right-4">
        <span 
          :class="[
            'px-3 py-1 rounded-full text-sm font-bold',
            isFree ? 'bg-green-500/80 text-white' : 'bg-primary-500/80 text-white'
          ]"
        >
          {{ isFree ? 'FREE' : formatPrice(event.price) }}
        </span>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
          {{ event.category }}
        </span>
      </div>

      <!-- Seats Left Indicator -->
      <div class="absolute bottom-4 left-4 right-4">
        <div class="flex items-center justify-between text-white text-sm">
          <span class="flex items-center gap-1">
            <UserGroupIcon class="w-4 h-4" />
            {{ seatsLeft }} seats left
          </span>
          <span v-if="isLowAvailability" class="text-orange-400 font-medium animate-pulse">
            Selling fast!
          </span>
        </div>
        <div class="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="availabilityColor"
            :style="{ width: `${availabilityPercentage}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h3 class="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
        {{ event.title }}
      </h3>
      
      <p class="text-gray-400 text-sm mb-4 line-clamp-2">
        {{ event.description }}
      </p>

      <!-- Event Details -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-300">
          <CalendarIcon class="w-4 h-4 text-primary-400" />
          <span>{{ formatDate(event.date) }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-300">
          <MapPinIcon class="w-4 h-4 text-accent-pink" />
          <span class="line-clamp-1">{{ event.location }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-300">
          <BuildingOfficeIcon class="w-4 h-4 text-accent-blue" />
          <span>{{ event.organizer }}</span>
        </div>
      </div>

      <!-- Apply Button -->
      <button 
        class="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
        :class="[
          isFree 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-glow' 
            : 'bg-gradient-to-r from-primary-500 to-accent-pink hover:shadow-glow-pink',
          { 'opacity-50 cursor-not-allowed': seatsLeft === 0 }
        ]"
        :disabled="seatsLeft === 0"
        @click.stop="handleApply"
      >
        <span v-if="seatsLeft === 0">Sold Out</span>
        <span v-else-if="isFree">Register Now</span>
        <span v-else>Get Tickets</span>
        <ArrowRightIcon v-if="seatsLeft > 0" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import type { Event } from '~/types'

interface Props {
  event: Event
  bookedSeats?: number
}

const props = withDefaults(defineProps<Props>(), {
  bookedSeats: 0
})

const router = useRouter()

const isFree = computed(() => props.event.price === 0)

const seatsLeft = computed(() => {
  return Math.max(0, props.event.seats - props.bookedSeats)
})

const availabilityPercentage = computed(() => {
  return (seatsLeft.value / props.event.seats) * 100
})

const isLowAvailability = computed(() => {
  return availabilityPercentage.value < 20 && seatsLeft.value > 0
})

const availabilityColor = computed(() => {
  if (seatsLeft.value === 0) return 'bg-gray-500'
  if (availabilityPercentage.value < 20) return 'bg-gradient-to-r from-orange-500 to-red-500'
  if (availabilityPercentage.value < 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-green-500 to-emerald-500'
})

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

const navigateToEvent = () => {
  router.push(`/events/${props.event.id}`)
}

const handleApply = () => {
  if (seatsLeft.value > 0) {
    router.push(`/events/${props.event.id}`)
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
