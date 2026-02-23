<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <!-- Icon -->
    <div
      class="w-24 h-24 mb-6 rounded-full flex items-center justify-center"
      :class="iconBgClass"
    >
      <component :is="icon" class="w-12 h-12" :class="iconClass" />
    </div>

    <!-- Title -->
    <h3 class="text-xl font-bold text-white mb-2">{{ title }}</h3>

    <!-- Description -->
    <p class="text-gray-400 max-w-md mb-6">{{ description }}</p>

    <!-- Action Button -->
    <button
      v-if="actionText"
      class="btn-primary flex items-center gap-2"
      @click="handleAction"
    >
      <component v-if="actionIcon" :is="actionIcon" class="w-5 h-5" />
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CalendarIcon,
  TicketIcon,
  BellIcon,
  CreditCardIcon,
  InboxIcon,
  PlusIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";

interface Props {
  icon:
    | "calendar"
    | "ticket"
    | "bell"
    | "search"
    | "credit-card"
    | "inbox"
    | "plus";
  title: string;
  description: string;
  actionText?: string;
  actionIcon?: "arrow-right" | "plus";
  variant?: "default" | "purple" | "blue" | "green" | "orange";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  actionIcon: "arrow-right",
});

const emit = defineEmits<{
  action: [];
}>();

const iconMap = {
  calendar: CalendarIcon,
  ticket: TicketIcon,
  bell: BellIcon,
  "credit-card": CreditCardIcon,
  inbox: InboxIcon,
  plus: PlusIcon,
};

const actionIconMap = {
  "arrow-right": ArrowRightIcon,
  plus: PlusIcon,
};

const icon = computed(() => iconMap[props.icon]);
const actionIcon = computed(() =>
  props.actionIcon ? actionIconMap[props.actionIcon] : null
);

const iconBgClass = computed(() => {
  switch (props.variant) {
    case "purple":
      return "bg-primary-500/20";
    case "blue":
      return "bg-blue-500/20";
    case "green":
      return "bg-green-500/20";
    case "orange":
      return "bg-orange-500/20";
    default:
      return "bg-white/5";
  }
});

const iconClass = computed(() => {
  switch (props.variant) {
    case "purple":
      return "text-primary-400";
    case "blue":
      return "text-blue-400";
    case "green":
      return "text-green-400";
    case "orange":
      return "text-orange-400";
    default:
      return "text-gray-500";
  }
});

const handleAction = () => {
  emit("action");
};
</script>
