<template>
  <div class="min-h-screen bg-[#0f0f23]">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main>
      <NuxtPage />
    </main>

    <!-- Toast Container -->
    <ToastContainer />

    <!-- Background Effects -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <!-- Gradient Orbs -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px]" />
      <div class="absolute top-1/3 -right-40 w-96 h-96 bg-accent-pink/20 rounded-full blur-[128px]" />
      <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-accent-blue/20 rounded-full blur-[128px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '~/components/Navbar.vue'
import ToastContainer from '~/components/ToastContainer.vue'
import { useApplicationsStore } from '~/stores/applications'
import { useNotificationsStore } from '~/stores/notifications'

// Initialize stores on app mount
onMounted(() => {
  const applicationsStore = useApplicationsStore()
  const notificationsStore = useNotificationsStore()
  
  applicationsStore.initializeStore()
  notificationsStore.initializeStore()
})
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
