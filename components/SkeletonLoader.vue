<template>
  <div class="animate-pulse">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="glass-card rounded-2xl overflow-hidden">
      <div class="h-48 bg-white/5" />
      <div class="p-5 space-y-4">
        <div class="h-6 bg-white/10 rounded-lg w-3/4" />
        <div class="space-y-2">
          <div class="h-4 bg-white/5 rounded w-full" />
          <div class="h-4 bg-white/5 rounded w-5/6" />
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-white/5 rounded w-1/2" />
          <div class="h-3 bg-white/5 rounded w-2/3" />
        </div>
        <div class="h-12 bg-white/10 rounded-xl" />
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="space-y-4">
      <div v-for="i in count" :key="i" class="glass-card rounded-xl p-4 flex items-center gap-4">
        <div class="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-5 bg-white/10 rounded w-1/3" />
          <div class="h-3 bg-white/5 rounded w-1/2" />
        </div>
        <div class="w-20 h-8 bg-white/10 rounded-lg" />
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-3">
      <div v-for="i in count" :key="i" class="h-4 bg-white/10 rounded" :class="`w-${width}`" />
    </div>

    <!-- Detail Skeleton -->
    <div v-else-if="type === 'detail'" class="space-y-6">
      <div class="h-64 bg-white/5 rounded-2xl" />
      <div class="space-y-4">
        <div class="h-8 bg-white/10 rounded-lg w-2/3" />
        <div class="flex gap-4">
          <div class="h-6 bg-white/5 rounded w-32" />
          <div class="h-6 bg-white/5 rounded w-32" />
        </div>
        <div class="space-y-2">
          <div class="h-4 bg-white/5 rounded w-full" />
          <div class="h-4 bg-white/5 rounded w-full" />
          <div class="h-4 bg-white/5 rounded w-3/4" />
        </div>
      </div>
    </div>

    <!-- Ticket Skeleton -->
    <div v-else-if="type === 'ticket'" class="ticket p-6">
      <div class="space-y-4">
        <div class="flex justify-between">
          <div class="h-6 bg-white/10 rounded w-1/2" />
          <div class="h-6 bg-white/10 rounded w-16" />
        </div>
        <div class="space-y-2">
          <div class="h-4 bg-white/5 rounded w-3/4" />
          <div class="h-4 bg-white/5 rounded w-1/2" />
        </div>
        <div class="h-32 bg-white/5 rounded-xl" />
        <div class="h-10 bg-white/10 rounded-xl" />
      </div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else class="glass-card rounded-2xl p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'list' | 'text' | 'detail' | 'ticket' | 'custom'
  count?: number
  width?: string
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  count: 3,
  width: 'full'
})
</script>
