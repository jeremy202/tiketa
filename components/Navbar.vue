<template>
  <nav class="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-pink flex items-center justify-center group-hover:shadow-glow transition-shadow">
            <TicketIcon class="w-6 h-6 text-white" />
          </div>
          <span class="text-xl font-bold text-gradient hidden sm:block">Tiketa</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link flex items-center gap-2"
            :class="{ 'active': isActive(item.path) }"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-3">
          <!-- Notification Bell -->
          <NotificationBell />

          <!-- Theme Toggle -->
          <button
            class="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            @click="toggleTheme"
          >
            <SunIcon v-if="isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            @click="toggleMobileMenu"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden glass border-t border-white/5"
      >
        <div class="px-4 py-4 space-y-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            :class="{ 'bg-white/10 text-white': isActive(item.path) }"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  TicketIcon,
  HomeIcon,
  CalendarIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import NotificationBell from './NotificationBell.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const isDark = ref(true) // Default to dark mode

const navItems = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Events', path: '/events', icon: CalendarIcon },
  { name: 'Dashboard', path: '/dashboard', icon: UserIcon }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // In a real app, this would toggle the theme
  // For now, we'll just toggle the icon
}
</script>
