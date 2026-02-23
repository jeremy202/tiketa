<template>
  <div class="min-h-screen bg-grid pt-20 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">My Dashboard</h1>
          <p class="text-gray-400">Manage your events and tickets</p>
        </div>
        <NuxtLink
          to="/"
          class="btn-primary flex items-center justify-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Browse Events
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="glass-card rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <TicketIcon class="w-5 h-5 text-primary-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.totalApplications }}</p>
          <p class="text-sm text-gray-400">Total Applications</p>
        </div>

        <div class="glass-card rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircleIcon class="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.paidApplications }}</p>
          <p class="text-sm text-gray-400">Confirmed</p>
        </div>

        <div class="glass-card rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <ClockIcon class="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.pendingApplications }}</p>
          <p class="text-sm text-gray-400">Pending Payment</p>
        </div>

        <div class="glass-card rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center">
              <CalendarIcon class="w-5 h-5 text-accent-blue" />
            </div>
          </div>
          <p class="text-2xl font-bold text-white">{{ stats.upcomingEvents }}</p>
          <p class="text-sm text-gray-400">Upcoming Events</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-2 mb-6 p-1 rounded-xl bg-white/5 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.value 
            ? 'bg-primary-500 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span 
            v-if="tab.count > 0"
            class="ml-2 px-2 py-0.5 rounded-full text-xs"
            :class="activeTab === tab.value ? 'bg-white/20' : 'bg-white/10'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Applications List -->
      <div v-if="filteredApplications.length > 0" class="space-y-4">
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <TicketCard
            v-for="application in filteredApplications"
            :key="application.id"
            :application="application"
            :event="getEvent(application.eventId)"
          />
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        :icon="emptyStateConfig.icon"
        :title="emptyStateConfig.title"
        :description="emptyStateConfig.description"
        :action-text="emptyStateConfig.actionText"
        :variant="emptyStateConfig.variant"
        @action="router.push('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { useEventsStore } from '~/stores/events'
import { useApplicationsStore } from '~/stores/applications'
import { useNotificationsStore } from '~/stores/notifications'
import TicketCard from '~/components/TicketCard.vue'
import EmptyState from '~/components/EmptyState.vue'

const router = useRouter()
const eventsStore = useEventsStore()
const applicationsStore = useApplicationsStore()
const notificationsStore = useNotificationsStore()

const activeTab = ref('all')
const loading = ref(true)

const tabs = computed(() => [
  { label: 'All', value: 'all', count: applicationsStore.applications.length },
  { label: 'Confirmed', value: 'paid', count: applicationsStore.getPaidApplications.length },
  { label: 'Pending', value: 'pending', count: applicationsStore.getPendingApplications.length }
])

const filteredApplications = computed(() => {
  let apps = [...applicationsStore.applications]
  
  // Filter by tab
  if (activeTab.value !== 'all') {
    apps = apps.filter(app => app.status === activeTab.value)
  }
  
  // Sort by date (newest first)
  apps.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  
  return apps
})

const stats = computed(() => ({
  totalApplications: applicationsStore.applications.length,
  paidApplications: applicationsStore.getPaidApplications.length,
  pendingApplications: applicationsStore.getPendingApplications.length,
  upcomingEvents: applicationsStore.applications.filter(app => {
    const event = getEvent(app.eventId)
    return event && new Date(event.date) > new Date()
  }).length
}))

const emptyStateConfig = computed(() => {
  if (activeTab.value === 'pending') {
    return {
      icon: 'credit-card' as const,
      title: 'No pending payments',
      description: 'You have no pending payments. All your applications are confirmed!',
      actionText: 'Browse Events',
      variant: 'green' as const
    }
  }
  if (activeTab.value === 'paid') {
    return {
      icon: 'ticket' as const,
      title: 'No confirmed tickets yet',
      description: 'Complete payment for your applications to see your tickets here.',
      actionText: 'Browse Events',
      variant: 'purple' as const
    }
  }
  return {
    icon: 'calendar' as const,
    title: 'No applications yet',
    description: 'Start exploring events and apply to see them here.',
    actionText: 'Browse Events',
    variant: 'purple' as const
  }
})

const getEvent = (eventId: string) => {
  return eventsStore.getEventById(eventId)
}

// Initialize
onMounted(async () => {
  applicationsStore.initializeStore()
  notificationsStore.initializeStore()
  await eventsStore.fetchEvents()
  
  // Check for upcoming events and create notifications
  notificationsStore.checkUpcomingEvents(eventsStore.events, applicationsStore.applications)
  
  loading.value = false
})
</script>
