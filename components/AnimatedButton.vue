<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="relative overflow-hidden rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
    :class="[
      sizeClasses,
      variantClasses,
      { 
        'opacity-50 cursor-not-allowed': disabled || loading,
        'transform active:scale-95': !disabled && !loading,
        'hover:shadow-glow': variant === 'primary' && !disabled,
        'hover:shadow-glow-pink': variant === 'accent' && !disabled,
      }
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <template v-if="loading">
      <svg 
        class="animate-spin h-5 w-5" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          class="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          stroke-width="4"
        />
        <path 
          class="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>{{ loadingText }}</span>
    </template>

    <!-- Success State -->
    <template v-else-if="success">
      <CheckCircleIcon class="w-5 h-5" />
      <span>{{ successText }}</span>
    </template>

    <!-- Default Content -->
    <template v-else>
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </template>

    <!-- Ripple Effect -->
    <span 
      v-if="showRipple" 
      class="absolute inset-0 bg-white/20 animate-ping rounded-xl"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  success?: boolean
  successText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  loadingText: 'Loading...',
  success: false,
  successText: 'Success!'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const showRipple = ref(false)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-4 py-2 text-sm'
    case 'lg':
      return 'px-8 py-4 text-lg'
    default:
      return 'px-6 py-3 text-base'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
    case 'secondary':
      return 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
    case 'accent':
      return 'bg-gradient-to-r from-accent-pink to-purple-500 text-white hover:from-accent-pink/90 hover:to-purple-500/90'
    case 'outline':
      return 'bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50'
    case 'ghost':
      return 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5'
    default:
      return ''
  }
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    showRipple.value = true
    setTimeout(() => {
      showRipple.value = false
    }, 300)
    emit('click', event)
  }
}
</script>
