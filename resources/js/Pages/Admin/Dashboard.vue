<script setup>
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import CategoryIcon from '@/Components/Icons/CategoryIcon.vue';
import NomineeIcon from '@/Components/Icons/NomineeIcon.vue';
import VoteIcon from '@/Components/Icons/VoteIcon.vue';
import CategoryVotesChart from '@/Components/CategoryVotesChart.vue';
import RefreshIcon from '@/Components/Icons/RefreshIcon.vue';
import { useForm } from '@inertiajs/vue3';

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  categoryVotes: {
    type: Array,
    required: true,
  },
  topNominees: {
    type: Array,
    required: true,
  },
});

const page = usePage();
const successMessage = computed(() => page.props.flash.success);

const chartData = computed(() => {
  const labels = props.categoryVotes.map(c => c.name);
  const data = props.categoryVotes.map(c => c.nominees_sum_votes_count);

  return {
    labels,
    datasets: [
      {
        label: 'Total Votes',
        backgroundColor: 'rgba(212, 175, 55, 0.7)', // gold-400 with opacity
        borderColor: 'rgba(212, 175, 55, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(212, 175, 55, 0.9)',
        data,
      },
    ],
  };
});

// Form for resetting votes

const form = useForm({});

const resetVotes = () => {
    // Ujumbe wa uthibitisho
    if (confirm('Una uhakika unataka kufuta kura ZOTE? Kitendo hiki hakiwezi kurudishwa nyuma.')) {
        // Tumia jina jipya la route: 'admin.votes.reset'
        form.post(route('admin.votes.reset'), {
            preserveScroll: true, // Zuia ukurasa usijirefresh kabisa
        });
    }
};
</script>
<template>
  <Head title="Admin Dashboard" />
  <FlashMessage :message="successMessage" />

  <div class="space-y-6">
    <!-- Welcome Message -->
    <div>
      <h2 class="text-2xl font-bold text-gold-gradient">Dashboard</h2>
      <h3 class="text-lg font-medium text-gray-200 mt-4">Welcome to <span class="text-gold-gradient">Business Awards</span> Admin Dashboard!</h3>
      <p class="mt-1 text-sm text-gray-400">
        This is your control center. Use the menu on the left to navigate and manage the system.
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Categories Card -->
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-xl p-6 flex items-center space-x-4 shadow-lg hover:shadow-gold-500/10 transition-shadow duration-300">
        <div class="bg-gold-500/10 p-3 rounded-full">
          <CategoryIcon class="text-gold-400" />
        </div>
        <div>
          <p class="text-sm text-gray-400">Total Categories</p>
          <p class="text-3xl font-bold text-gold-400">{{ stats.categories }}</p>
        </div>
      </div>

      <!-- Nominees Card -->
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-xl p-6 flex items-center space-x-4 shadow-lg hover:shadow-gold-500/10 transition-shadow duration-300">
        <div class="bg-gold-500/10 p-3 rounded-full">
          <NomineeIcon class="text-gold-400" />
        </div>
        <div>
          <p class="text-sm text-gray-400">Total Nominees</p>
          <p class="text-3xl font-bold text-gold-400">{{ stats.nominees }}</p>
        </div>
      </div>

      <!-- Votes Card -->
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-xl p-6 flex items-center space-x-4 shadow-lg hover:shadow-gold-500/10 transition-shadow duration-300">
        <div class="bg-gold-500/10 p-3 rounded-full">
          <VoteIcon class="text-gold-400" />
        </div>
        <div>
          <p class="text-sm text-gray-400">Total Votes Cast</p>
          <p class="text-3xl font-bold text-gold-400">{{ stats.votes }}</p>
        </div>
      </div>
    </div>

    <!-- Charts and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Votes Chart -->
      <div class="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-xl p-4 shadow-lg">
        <div class="h-80">
          <CategoryVotesChart :chart-data="chartData" />
        </div>
      </div>

      <!-- Top Nominees -->
      <div class="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gold-500/20 rounded-xl p-4 shadow-lg">
        <h4 class="text-lg font-semibold text-gold-400 mb-3">Top 5 Nominees</h4>
        <div class="space-y-3">
          <div v-if="topNominees.length === 0" class="text-center text-gray-500 py-8">
            No voting data yet.
          </div>
          <Link
            v-for="nominee in topNominees"
            :key="nominee.id"
            :href="route('admin.nominees.edit', nominee.id)"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <img
              v-if="nominee.image_url"
              :src="nominee.image_url"
              :alt="nominee.name"
              class="h-10 w-10 rounded-full object-cover border-2 border-gray-600"
            />
            <div v-else class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gold-500 font-bold border-2 border-gray-600">
              {{ nominee.name.charAt(0) }}
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-200 truncate">{{ nominee.name }}</p>
              <p class="text-xs text-gray-400">{{ nominee.category.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-gold-400">{{ nominee.votes_count }}</p>
              <p class="text-xs text-gray-500">votes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="mt-8 pt-6 border-t border-gray-700/50">
      <h3 class="text-lg font-semibold text-red-500">Danger Zone</h3>
      <div class="mt-4 bg-gray-800/50 border border-red-500/30 rounded-xl p-6 flex items-center justify-between shadow-lg">
        <div>
          <p class="font-medium text-gray-200">Reset All Votes</p>
          <p class="text-sm text-gray-400 mt-1">
            This will permanently delete all votes and reset the vote count for all nominees to zero. This action cannot be undone.
          </p>
        </div>
        <button @click="resetVotes" class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm shadow-md hover:shadow-red-500/20">
          <RefreshIcon class="mr-2 -ml-1 h-4 w-4" />
          Reset Votes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #D4AF37, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
