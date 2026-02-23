<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-full scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto min-w-[320px] max-w-md glass-card rounded-xl p-4 shadow-2xl border-l-4"
        :class="getToastBorderClass(toast.type)"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="getToastIconClass(toast.type)"
          >
            <component :is="getToastIcon(toast.type)" class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-white mb-1">{{ toast.title }}</h4>
            <p class="text-sm text-gray-300">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button
            class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            @click="removeToast(toast.id)"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-100 ease-linear"
            :class="getProgressClass(toast.type)"
            :style="{ width: `${getProgressWidth(toast)}%` }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'
import { useNotifications } from '~/composables/useNotifications'
import type { Toast } from '~/composables/useNotifications'

const { toasts, removeToast } = useNotifications()

// Track progress for each toast
const toastProgress = ref<Map<string, number>>(new Map())
const progressIntervals = ref<Map<string, NodeJS.Timeout>>(new Map())

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
}

const getToastIconClass = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-500/20 text-green-400'
    case 'error':
      return 'bg-red-500/20 text-red-400'
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'info':
    default:
      return 'bg-blue-500/20 text-blue-400'
  }
}

const getToastBorderClass = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500'
    case 'error':
      return 'border-l-red-500'
    case 'warning':
      return 'border-l-yellow-500'
    case 'info':
    default:
      return 'border-l-blue-500'
  }
}

const getProgressClass = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
    default:
      return 'bg-blue-500'
  }
}

const getProgressWidth = (toast: Toast): number => {
  return toastProgress.value.get(toast.id) ?? 100
}

// Initialize progress tracking for new toasts
const initializeToastProgress = () => {
  toasts.value.forEach(toast => {
    if (!toastProgress.value.has(toast.id)) {
      toastProgress.value.set(toast.id, 100)
      
      const updateInterval = 50 // Update every 50ms
      const decrementAmount = (100 / toast.duration) * updateInterval
      
      const interval = setInterval(() => {
        const currentProgress = toastProgress.value.get(toast.id) ?? 100
        const newProgress = Math.max(0, currentProgress - decrementAmount)
        toastProgress.value.set(toast.id, newProgress)
        
        if (newProgress <= 0) {
          clearInterval(interval)
          progressIntervals.value.delete(toast.id)
        }
      }, updateInterval)
      
      progressIntervals.value.set(toast.id, interval)
    }
  })
}

// Watch for toast changes
let watchInterval: NodeJS.Timeout | null = null

onMounted(() => {
  watchInterval = setInterval(initializeToastProgress, 100)
})

onUnmounted(() => {
  if (watchInterval) {
    clearInterval(watchInterval)
  }
  progressIntervals.value.forEach(interval => clearInterval(interval))
})
</script>
