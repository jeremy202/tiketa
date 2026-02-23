<template>
  <div class="min-h-screen bg-grid">
    <!-- Hero Section -->
    <section class="relative pt-[250px] pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span class="text-gradient">Discover</span>
            <span class="text-white"> Amazing </span>
            <span class="text-gradient-blue">Events</span>
          </h1>
          <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Find and book tickets for the best concerts, conferences, workshops,
            and more happening near you.
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto relative">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search events, locations, categories..."
                class="w-full pl-12 pr-4 py-4 rounded-2xl input-glass text-lg"
              />
              <button
                v-if="searchQuery"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                @click="searchQuery = ''"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
          <!-- Price Filter -->
          <div class="flex items-center gap-2 p-1 rounded-xl bg-white/5">
            <button
              v-for="option in priceOptions"
              :key="option.value"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              :class="
                priceFilter === option.value
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              "
              @click="priceFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>

          <!-- Date Filter -->
          <div class="flex items-center gap-2 p-1 rounded-xl bg-white/5">
            <button
              v-for="option in dateOptions"
              :key="option.value"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              :class="
                dateFilter === option.value
                  ? 'bg-accent-pink text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              "
              @click="dateFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            v-for="category in categories"
            :key="category"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all border"
            :class="
              selectedCategory === category
                ? 'bg-white/10 border-primary-500/50 text-white'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <!-- Results Count -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-400">
            Showing
            <span class="text-white font-semibold">{{
              filteredEvents.length
            }}</span>
            events
          </p>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">Sort by:</span>
            <select
              v-model="sortBy"
              class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500"
            >
              <option value="date">Date</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <SkeletonLoader v-for="i in 8" :key="i" type="card" />
        </div>

        <!-- Events Grid -->
        <div
          v-else-if="filteredEvents.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <TransitionGroup
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <EventCard
              v-for="event in filteredEvents"
              :key="event.id"
              :event="event"
              :booked-seats="getBookedSeats(event.id)"
            />
          </TransitionGroup>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          icon="search"
          title="No events found"
          description="Try adjusting your filters or search for something different."
          action-text="Clear Filters"
          variant="purple"
          @action="clearFilters"
        />
      </div>
    </section>

    <!-- Featured Section -->
    <section
      v-if="
        !searchQuery &&
        priceFilter === 'all' &&
        dateFilter === 'all' &&
        selectedCategory === 'All'
      "
      class="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5"
    >
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">Featured Events</h2>
            <p class="text-gray-400">
              Handpicked events you don't want to miss
            </p>
          </div>
          <NuxtLink
            to="/events"
            class="text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            View all
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="event in featuredEvents"
            :key="event.id"
            class="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:shadow-glow transition-all"
            @click="navigateToEvent(event.id)"
          >
            <div class="relative h-56 overflow-hidden">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              />
              <div class="absolute bottom-4 left-4 right-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/80 text-white mb-2 inline-block"
                >
                  {{ event.category }}
                </span>
                <h3 class="text-xl font-bold text-white">{{ event.title }}</h3>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-gray-300 text-sm">
                  <CalendarIcon class="w-4 h-4" />
                  {{ formatShortDate(event.date) }}
                </div>
                <span class="text-primary-400 font-semibold">
                  {{ event.price === 0 ? "FREE" : formatPrice(event.price) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <p class="text-4xl font-bold text-gradient mb-2">
              {{ stats.totalEvents }}
            </p>
            <p class="text-gray-400">Total Events</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-gradient-blue mb-2">
              {{ stats.upcomingEvents }}
            </p>
            <p class="text-gray-400">Upcoming</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-gradient mb-2">
              {{ stats.freeEvents }}
            </p>
            <p class="text-gray-400">Free Events</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-gradient-blue mb-2">
              {{ stats.categories }}
            </p>
            <p class="text-gray-400">Categories</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/vue/24/outline";
import { useEventsStore } from "~/stores/events";
import { useApplicationsStore } from "~/stores/applications";
import EventCard from "~/components/EventCard.vue";
import SkeletonLoader from "~/components/SkeletonLoader.vue";
import EmptyState from "~/components/EmptyState.vue";

const router = useRouter();
const eventsStore = useEventsStore();
const applicationsStore = useApplicationsStore();

// State
const loading = ref(true);
const searchQuery = ref("");
const priceFilter = ref("all");
const dateFilter = ref("all");
const selectedCategory = ref("All");
const sortBy = ref("date");

// Options
const priceOptions = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const dateOptions = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

const categories = computed(() => eventsStore.categories);

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null;

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // Search is handled by computed property
  }, 300);
});

// Filtered events
const filteredEvents = computed(() => {
  let events = eventsStore.filterEvents({
    search: searchQuery.value,
    priceType: priceFilter.value,
    dateType: dateFilter.value,
    category: selectedCategory.value,
  });

  // Sort
  switch (sortBy.value) {
    case "price-low":
      events = events.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      events = events.sort((a, b) => b.price - a.price);
      break;
    case "name":
      events = events.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      events = events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }

  return events;
});

// Featured events (first 3 upcoming)
const featuredEvents = computed(() => {
  return eventsStore.getUpcomingEvents.slice(0, 3);
});

// Stats
const stats = computed(() => ({
  totalEvents: eventsStore.events.length,
  upcomingEvents: eventsStore.getUpcomingEvents.length,
  freeEvents: eventsStore.getFreeEvents.length,
  categories: eventsStore.categories.length - 1, // Exclude 'All'
}));

const getBookedSeats = (eventId: string) => {
  return applicationsStore.getTotalBookedSeats(eventId);
};

const clearFilters = () => {
  searchQuery.value = "";
  priceFilter.value = "all";
  dateFilter.value = "all";
  selectedCategory.value = "All";
};

const navigateToEvent = (eventId: string) => {
  router.push(`/events/${eventId}`);
};

const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

// Initialize
onMounted(async () => {
  applicationsStore.initializeStore();
  await eventsStore.fetchEvents();
  loading.value = false;
});
</script>
