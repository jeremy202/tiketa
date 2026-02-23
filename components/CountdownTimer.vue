<template>
  <span :class="textClass">
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  targetDate: string | undefined
  format?: 'full' | 'compact' | 'minimal'
  showLabels?: boolean
  expiredText?: string
}

const props = withDefaults(defineProps<Props>(), {
  format: 'compact',
  showLabels: false,
  expiredText: 'Event has started'
})

const now = ref(new Date())
let interval: NodeJS.Timeout | null = null

const targetTime = computed(() => {
  if (!props.targetDate) return null
  return new Date(props.targetDate)
})

const timeDiff = computed(() => {
  if (!targetTime.value) return 0
  return targetTime.value.getTime() - now.value.getTime()
})

const isExpired = computed(() => timeDiff.value <= 0)

const countdown = computed(() => {
  const diff = timeDiff.value
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
})

const displayText = computed(() => {
  if (isExpired.value) return props.expiredText
  
  const { days, hours, minutes, seconds } = countdown.value
  
  switch (props.format) {
    case 'full':
      if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`
      }
      if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`
      }
      return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''}`
    
    case 'compact':
      if (days > 0) return `${days}d ${hours}h`
      if (hours > 0) return `${hours}h ${minutes}m`
      if (minutes > 0) return `${minutes}m ${seconds}s`
      return `${seconds}s`
    
    case 'minimal':
      if (days > 0) return `${days}d`
      if (hours > 0) return `${hours}h`
      if (minutes > 0) return `${minutes}m`
      return `${seconds}s`
    
    default:
      return ''
  }
})

const textClass = computed(() => {
  if (isExpired.value) return 'text-gray-500'
  
  const { days, hours } = countdown.value
  
  if (days === 0 && hours < 1) {
    return 'text-orange-400 animate-pulse font-semibold'
  }
  if (days === 0 && hours < 24) {
    return 'text-yellow-400'
  }
  return 'text-gray-300'
})

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
