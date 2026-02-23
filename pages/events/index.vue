<template>
  <div class="min-h-screen bg-grid pt-[250px] pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          All <span class="text-gradient">Events</span>
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Browse through all our upcoming and past events. Find something that
          interests you and book your spot today.
        </p>
      </div>

      <!-- Filters -->
      <div class="glass-card rounded-2xl p-4 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search events..."
              class="w-full pl-12 pr-4 py-3 rounded-xl input-glass"
            />
          </div>

          <!-- Category Filter -->
          <div class="relative">
            <select
              v-model="selectedCategory"
              class="w-full md:w-48 pl-4 pr-10 py-3 rounded-xl input-glass appearance-none"
            >
              <option value="All">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <ChevronDownIcon
              class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
          </div>

          <!-- Price Filter -->
          <div class="relative">
            <select
              v-model="priceFilter"
              class="w-full md:w-40 pl-4 pr-10 py-3 rounded-xl input-glass appearance-none"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <ChevronDownIcon
              class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
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
          <span class="text-sm text-gray-400">Sort:</span>
          <select
            v-model="sortBy"
            class="bg-transparent text-white text-sm focus:outline-none"
          >
            <option value="date">Date</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Events Grid -->
      <div
        v-if="filteredEvents.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          :booked-seats="getBookedSeats(event.id)"
        />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        icon="search"
        title="No events found"
        description="Try adjusting your search or filters to find what you're looking for."
        action-text="Clear Filters"
        variant="purple"
        @action="clearFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { useEventsStore } from "~/stores/events";
import { useApplicationsStore } from "~/stores/applications";
import EventCard from "~/components/EventCard.vue";
import EmptyState from "~/components/EmptyState.vue";

const eventsStore = useEventsStore();
const applicationsStore = useApplicationsStore();

const searchQuery = ref("");
const selectedCategory = ref("All");
const priceFilter = ref("all");
const sortBy = ref("date");

const categories = computed(() =>
  eventsStore.categories.filter((c) => c !== "All")
);

const filteredEvents = computed(() => {
  let events = eventsStore.filterEvents({
    search: searchQuery.value,
    priceType: priceFilter.value,
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
    default:
      events = events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }

  return events;
});

const getBookedSeats = (eventId: string) => {
  return applicationsStore.getTotalBookedSeats(eventId);
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "All";
  priceFilter.value = "all";
};

onMounted(async () => {
  applicationsStore.initializeStore();
  await eventsStore.fetchEvents();
});
</script>
