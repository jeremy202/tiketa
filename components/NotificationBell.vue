<template>
  <div class="relative" ref="bellRef">
    <!-- Bell Button -->
    <button
      class="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
      :class="{ 'bg-white/10': isOpen }"
      @click="togglePanel"
    >
      <BellIcon class="w-6 h-6" />
      
      <!-- Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-accent-pink to-red-500 text-white text-xs font-bold flex items-center justify-center animate-bounce"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>

      <!-- Pulse Animation for new notifications -->
      <span
        v-if="unreadCount > 0"
        class="absolute inset-0 rounded-xl bg-accent-pink/30 animate-ping"
      />
    </button>

    <!-- Notification Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] glass-card rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <h3 class="text-lg font-semibold text-white">Notifications</h3>
          <div class="flex items-center gap-2">
            <button
              v-if="unreadCount > 0"
              class="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              @click="markAllAsRead"
            >
              Mark all read
            </button>
            <button
              class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              @click="closePanel"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <BellSlashIcon class="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <p class="text-gray-400">No notifications yet</p>
          </div>

          <div v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              :class="{ 'bg-white/5': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <component
                    :is="getNotificationIcon(notification.type)"
                    class="w-5 h-5"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white mb-1">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-400 line-clamp-2">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ formatTime(notification.createdAt) }}
                  </p>
                </div>

                <!-- Unread Indicator -->
                <div
                  v-if="!notification.read"
                  class="w-2 h-2 rounded-full bg-accent-pink flex-shrink-0 mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-white/10 bg-white/5">
          <button
            class="w-full py-2 text-sm text-center text-primary-400 hover:text-primary-300 transition-colors"
            @click="clearAll"
          >
            Clear all notifications
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        @click="closePanel"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellIcon,
  XMarkIcon,
  BellSlashIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useNotificationsStore } from '~/stores/notifications'
import type { Notification, NotificationType } from '~/types'

const router = useRouter()
const notificationsStore = useNotificationsStore()

const bellRef = ref<HTMLElement | null>(null)
const isOpen = computed(() => notificationsStore.isOpen)

const unreadCount = computed(() => notificationsStore.unreadCount)
const notifications = computed(() => notificationsStore.getAllNotifications)

const togglePanel = () => {
  notificationsStore.togglePanel()
}

const closePanel = () => {
  notificationsStore.closePanel()
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const clearAll = () => {
  notificationsStore.clearAllNotifications()
}

const handleNotificationClick = (notification: Notification) => {
  notificationsStore.markAsRead(notification.id)
  
  if (notification.eventId) {
    router.push(`/events/${notification.eventId}`)
  }
  
  closePanel()
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'reminder':
      return ClockIcon
    case 'payment_success':
      return CheckCircleIcon
    case 'event_soon':
      return CalendarIcon
    case 'info':
      return InformationCircleIcon
    default:
      return InformationCircleIcon
  }
}

const getNotificationIconClass = (type: NotificationType) => {
  switch (type) {
    case 'reminder':
      return 'bg-blue-500/20 text-blue-400'
    case 'payment_success':
      return 'bg-green-500/20 text-green-400'
    case 'event_soon':
      return 'bg-orange-500/20 text-orange-400'
    case 'info':
      return 'bg-purple-500/20 text-purple-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric'
  })
}

// Close on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (bellRef.value && !bellRef.value.contains(event.target as Node)) {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
