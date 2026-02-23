<template>
  <div class="min-h-screen bg-grid pt-20 pb-16">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-md mx-auto px-4">
      <SkeletonLoader type="ticket" />
    </div>

    <!-- Ticket Content -->
    <div
      v-else-if="ticket && event && application"
      class="max-w-md mx-auto px-4"
    >
      <!-- Back Button -->
      <button
        class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        @click="router.back()"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        Back
      </button>

      <!-- Ticket Card -->
      <div class="ticket relative overflow-hidden">
        <!-- Header -->
        <div
          class="relative bg-gradient-to-br from-primary-500 to-accent-pink p-6 text-center"
        >
          <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"
          />

          <div class="relative">
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
            >
              <TicketIcon class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-xl font-bold text-white mb-1">Event Ticket</h1>
            <p class="text-white/80 text-sm">{{ event.title }}</p>
          </div>

          <!-- Decorative circles -->
          <div
            class="absolute -bottom-3 left-0 w-6 h-6 bg-[#0f0f23] rounded-full"
          />
          <div
            class="absolute -bottom-3 right-0 w-6 h-6 bg-[#0f0f23] rounded-full"
          />
        </div>

        <!-- Ticket Body -->
        <div class="p-6 bg-[#1a1a2e]">
          <!-- QR Code -->
          <div class="text-center mb-6">
            <div class="inline-block p-4 bg-white rounded-2xl shadow-lg">
              <img
                :src="ticket.qrCode"
                :alt="`QR Code for ticket ${ticket.id}`"
                class="w-48 h-48"
              />
            </div>
            <p class="text-gray-500 text-xs mt-3">Scan at the entrance</p>
          </div>

          <!-- Ticket Info -->
          <div class="space-y-4 mb-6">
            <div
              class="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span class="text-gray-400 text-sm">Ticket ID</span>
              <span class="text-white font-mono text-sm">{{ ticket.id }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span class="text-gray-400 text-sm">Holder</span>
              <span class="text-white text-sm">{{ ticket.holderName }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span class="text-gray-400 text-sm">Date</span>
              <span class="text-white text-sm">{{
                formatDate(event.date)
              }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span class="text-gray-400 text-sm">Time</span>
              <span class="text-white text-sm">{{
                formatTime(event.date)
              }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span class="text-gray-400 text-sm">Location</span>
              <span class="text-white text-sm text-right">{{
                event.location
              }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-white/5"
            >
              <span class="text-gray-400 text-sm">Category</span>
              <span class="text-white text-sm">{{ event.category }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-400 text-sm">Status</span>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="
                  ticket.isUsed
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-green-500/20 text-green-400'
                "
              >
                {{ ticket.isUsed ? "Used" : "Valid" }}
              </span>
            </div>
          </div>

          <!-- Edit Name (if not used) -->
          <div v-if="!ticket.isUsed && isPrimaryTicket" class="mb-6">
            <label class="block text-sm text-gray-400 mb-2"
              >Transfer to (optional)</label
            >
            <div class="flex gap-2">
              <input
                v-model="newHolderName"
                type="text"
                placeholder="Enter new holder name"
                class="flex-1 input-glass text-sm"
              />
              <button
                class="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                :disabled="!newHolderName.trim() || updating"
                @click="updateHolderName"
              >
                <span v-if="updating">...</span>
                <span v-else>Update</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              You can transfer this ticket to someone else by changing the
              holder name.
            </p>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              class="w-full py-3 px-4 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              @click="copyLink"
            >
              <LinkIcon class="w-5 h-5" />
              Copy Shareable Link
            </button>

            <button
              class="w-full py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              :disabled="isGenerating"
              @click="downloadPDF"
            >
              <DocumentArrowDownIcon class="w-5 h-5" />
              <span v-if="isGenerating">Generating...</span>
              <span v-else>Download PDF</span>
            </button>

            <button
              class="w-full py-3 px-4 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              @click="shareTicketNative"
            >
              <ShareIcon class="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div
          class="absolute top-1/2 -left-3 w-6 h-6 bg-[#0f0f23] rounded-full"
        />
        <div
          class="absolute top-1/2 -right-3 w-6 h-6 bg-[#0f0f23] rounded-full"
        />
      </div>

      <!-- Other Tickets -->
      <div v-if="otherTickets.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold text-white mb-4">
          Other Tickets in This Order
        </h3>
        <div class="space-y-3">
          <div
            v-for="otherTicket in otherTickets"
            :key="otherTicket.id"
            class="glass-card rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
            @click="router.push(`/ticket/${otherTicket.id}`)"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center"
              >
                <TicketIcon class="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p class="text-white font-medium">
                  {{ otherTicket.holderName }}
                </p>
                <p class="text-sm text-gray-400">{{ otherTicket.id }}</p>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Event Info -->
      <div class="mt-8 glass-card rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">About the Event</h3>
        <p class="text-gray-400 text-sm mb-4">{{ event.description }}</p>
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <BuildingOfficeIcon class="w-4 h-4" />
          <span>Organized by {{ event.organizer }}</span>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="max-w-md mx-auto px-4 text-center py-16">
      <EmptyState
        icon="ticket"
        title="Ticket not found"
        description="The ticket you're looking for doesn't exist or has been removed."
        action-text="Go to Dashboard"
        variant="purple"
        @action="router.push('/dashboard')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeftIcon,
  TicketIcon,
  LinkIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
} from "@heroicons/vue/24/outline";
import { useEventsStore } from "~/stores/events";
import { useApplicationsStore } from "~/stores/applications";
import { useTicketGenerator } from "~/composables/useTicketGenerator";
import { useNotifications } from "~/composables/useNotifications";
import SkeletonLoader from "~/components/SkeletonLoader.vue";
import EmptyState from "~/components/EmptyState.vue";

const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();
const applicationsStore = useApplicationsStore();
const { generateTicketPDF, isGenerating, copyTicketLink, shareTicket } =
  useTicketGenerator();
const { showTicketShared, showError, success } = useNotifications();

const loading = ref(true);
const updating = ref(false);
const newHolderName = ref("");

const ticketData = computed(() => {
  const ticketId = route.params.ticketId as string;
  return applicationsStore.getTicketById(ticketId);
});

const ticket = computed(() => ticketData.value?.ticket || null);
const application = computed(() => {
  if (!ticketData.value) return null;
  return applicationsStore.getApplicationById(
    ticket.value?.applicationId || ""
  );
});
const event = computed(() => {
  if (!application.value) return null;
  return eventsStore.getEventById(application.value.eventId);
});

const isPrimaryTicket = computed(() => {
  if (!ticket.value || !application.value) return false;
  return application.value.tickets[0]?.id === ticket.value.id;
});

const otherTickets = computed(() => {
  if (!application.value || !ticket.value) return [];
  return application.value.tickets.filter((t) => t.id !== ticket.value?.id);
});

const updateHolderName = async () => {
  if (!ticket.value || !newHolderName.value.trim()) return;

  updating.value = true;

  try {
    const updateSuccess = applicationsStore.updateTicketHolderName(
      ticket.value.id,
      newHolderName.value.trim()
    );

    if (updateSuccess) {
      success(
        "Name Updated",
        "Ticket holder name has been updated successfully."
      );
      newHolderName.value = "";
    } else {
      showError("Failed to update name. Please try again.");
    }
  } finally {
    updating.value = false;
  }
};

const copyLink = async () => {
  if (!ticket.value) return;

  const success = await copyTicketLink(ticket.value.id);
  if (success) {
    showTicketShared();
  } else {
    showError("Failed to copy link");
  }
};

const downloadPDF = async () => {
  if (!ticket.value || !event.value || !application.value) return;

  try {
    await generateTicketPDF({
      ticket: ticket.value,
      event: event.value,
      application: application.value,
    });
  } catch (error) {
    showError("Failed to generate PDF");
  }
};

const shareTicketNative = async () => {
  if (!ticket.value || !event.value || !application.value) return;

  const success = await shareTicket({
    ticket: ticket.value,
    event: event.value,
    application: application.value,
  });

  if (!success) {
    showError("Failed to share ticket");
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Initialize
onMounted(async () => {
  applicationsStore.initializeStore();
  await eventsStore.fetchEvents();
  loading.value = false;
});
</script>
