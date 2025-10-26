<template>
	<div v-if="isLoading" class="p-6 text-center text-gray-500">
		Loading dashboard...
	</div>

	<div v-else class="space-y-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="sm:text-3xl text-[1.2rem] font-bold text-checkerr-green">
					Welcome, {{ user?.name || "User" }}!
				</h1>
				<p class="mt-1 text-gray-600">Here's a summary of your tickets.</p>
			</div>
			<RouterLink
				to="/tickets"
				class="px-5 py-2 font-medium text-white bg-checkerr-orange rounded-lg shadow-md hover:bg-opacity-80 transition-colors"
				aria-label="Create New Ticket">
				<span class="sm:inline hidden">Create New Ticket</span>
				<span class="sm:hidden inline">
					<v-icon name="hi-plus" />
				</span>
			</RouterLink>
		</div>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard title="Total Tickets" :value="stats.total" color="blue">
				<v-icon name="hi-ticket" scale="1.75" class="w-8 h-8 text-blue-500" />
			</StatCard>

			<StatCard title="Open Tickets" :value="stats.open" color="green">
				<v-icon name="hi-fire" scale="1.75" class="w-8 h-8 text-green-500" />
			</StatCard>

			<StatCard title="In Progress" :value="stats.inProgress" color="yellow">
				<v-icon
					name="hi-sparkles"
					scale="1.75"
					class="w-8 h-8 text-yellow-500" />
			</StatCard>

			<StatCard title="Tickets Closed" :value="stats.closed" color="gray">
				<v-icon
					name="hi-check-circle"
					scale="1.75"
					class="w-8 h-8 text-gray-500" />
			</StatCard>
		</div>

		<div class="p-6 bg-white rounded-lg shadow">
			<h2 class="text-xl font-semibold text-checkerr-green mb-4">
				Status Breakdown
			</h2>
			<div class="flex items-end h-40 space-x-4">
				<Bar
					:value="stats.open"
					:total="stats.total"
					label="Open"
					color="bg-green-500" />
				<Bar
					:value="stats.inProgress"
					:total="stats.total"
					label="In Progress"
					color="bg-yellow-500" />
				<Bar
					:value="stats.closed"
					:total="stats.total"
					label="Closed"
					color="bg-gray-500" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue"; // Keep onMounted if store watcher isn't used
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useTicketsStore } from "@/stores/ticketsStore";
import StatCard from "@/components/StatCard.vue";
import Bar from "@/components/Bar.vue";

const authStore = useAuthStore();
const ticketsStore = useTicketsStore();

// Use storeToRefs for reactive state access
const { user } = storeToRefs(authStore);
const { tickets, isLoading } = storeToRefs(ticketsStore);

// --- Calculate Stats ---
// computed() is Vue's useMemo()
const stats = computed(() => {
	// Safely access tickets.value, default to empty array if null/undefined
	const currentTickets = tickets.value || [];
	const total = currentTickets.length;
	const open = currentTickets.filter((t) => t?.status === "open").length;
	const inProgress = currentTickets.filter(
		(t) => t?.status === "in_progress"
	).length;
	const closed = currentTickets.filter((t) => t?.status === "closed").length;
	return { total, open, inProgress, closed };
});

// Optional: Keep onMounted if you want explicit loading trigger here
// onMounted(() => {
//   // Check if tickets need loading (e.g., if navigating directly here)
//   if (isLoading.value || tickets.value.length === 0) {
//      ticketsStore.loadAndSetUserTickets();
//   }
// });
</script>
