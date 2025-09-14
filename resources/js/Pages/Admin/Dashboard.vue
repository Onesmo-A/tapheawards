<script setup>
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { computed, defineAsyncComponent } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import StatCard from '@/Components/StatCard.vue';

// Custom Icons (zilizo local)
import CategoryIcon from '@/Components/Icons/CategoryIcon.vue';
import NomineeIcon from '@/Components/Icons/NomineeIcon.vue';
import VoteIcon from '@/Components/Icons/VoteIcon.vue';
import ApplicationIcon from '@/Components/Icons/ApplicationIcon.vue';

// Heroicons
import { 
  UserIcon, 
  CurrencyDollarIcon as TransactionIcon, 
  LightBulbIcon as SuggestionIcon, 
  TicketIcon,
  CheckCircleIcon,
  XCircleIcon, 
  NewspaperIcon,
  ArrowPathIcon as RefreshIcon 
} from '@heroicons/vue/24/outline'

import { useForm } from '@inertiajs/vue3';

const BarChart = defineAsyncComponent(() => import('@/Components/BarChart.vue'));
const DoughnutChart = defineAsyncComponent(() => import('@/Components/DoughnutChart.vue'));

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  stats: { type: Object, required: true },
  categoryVotes: { type: Array, required: true },
  dailyApplications: { type: Array, required: true },
  dailyVotes: { type: Array, required: true },
  topNominees: { type: Array, required: true },
});

const page = usePage();
const successMessage = computed(() => page.props.flash.success);

// Chart Data
const votesChartData = computed(() => ({
  labels: props.categoryVotes.map(c => c.name),
  datasets: [{
    label: 'Total Votes',
    backgroundColor: 'rgba(239, 68, 68, 0.7)',
    borderColor: 'rgba(239, 68, 68, 1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(239, 68, 68, 0.9)',
    data: props.categoryVotes.map(c => c.nominees_sum_votes_count),
  }]
}));

const applicationsChartData = computed(() => ({
  labels: props.dailyApplications.map(item => item.label),
  datasets: [{
    label: 'New Applications',
    backgroundColor: 'rgba(79, 70, 229, 0.7)',
    borderColor: 'rgba(79, 70, 229, 1)',
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    data: props.dailyApplications.map(item => item.count),
  }]
}));

const dailyVotesChartData = computed(() => ({
  labels: props.dailyVotes.map(item => item.label),
  datasets: [{
    label: 'Daily Votes',
    backgroundColor: 'rgba(34, 197, 94, 0.7)',
    borderColor: 'rgba(34, 197, 94, 1)',
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    data: props.dailyVotes.map(item => item.count),
  }]
}));

const topNomineesChartData = computed(() => ({
  labels: ['Nominees', 'Votes', 'Users'],
  datasets: [{
    label: 'Overall Stats',
    backgroundColor: ['#4f46e5', '#ef4444', '#ec4899'],
    hoverOffset: 4,
    data: [props.stats.nominees, props.stats.votes, props.stats.users],
  }]
}));

// Form for resetting votes
const form = useForm({});

const resetVotes = () => {
  if (confirm('Una uhakika unataka kufuta kura ZOTE? Kitendo hiki hakiwezi kurudishwa nyuma.')) {
    form.post(route('admin.votes.reset'), { preserveScroll: true });
  }
};

const refreshData = () => {
  router.reload({ preserveScroll: true });
};
</script>

<template>
  <Head title="Admin Dashboard" />
  <FlashMessage :message="successMessage" />

  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h2 class="text-2xl font-bold text-white">Dashboard</h2>
        <p class="mt-1 text-sm text-red-100">Your control center for the Taphe Awards.</p>
      </div>
      <button @click="refreshData" class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition text-sm shadow-md">
        <RefreshIcon class="mr-2 -ml-1 h-4 w-4" />
        Refresh Data
      </button>
    </div>

    <!-- Welcome Message -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-800 text-white p-6 rounded-xl shadow-lg">
      <h3 class="text-lg font-medium">
        Welcome to <span class="text-purple-300 font-semibold">Taphe Awards</span> Admin Dashboard!
      </h3>
      <p class="mt-1 text-sm text-purple-200">
        This is your control center. Use the menu on the left to navigate and manage the system.
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8 gap-6">
      <!-- BORESHO: Link sasa inapeleka kwenye maombi yote bila kuchuja kwa status -->
      <StatCard 
        title="Pending Applications" 
        :value="stats.pending_applications" 
        :href="route('admin.applications.index')" color="yellow">
        <ApplicationIcon />
      </StatCard>

      <StatCard title="New Suggestions" :value="stats.suggestions" :href="route('admin.suggestions.index')" color="blue">
        <SuggestionIcon class="h-6 w-6" />
      </StatCard>

      <!-- BORESHO: Ongeza kadi za maombi yaliyokubaliwa na kukataliwa -->
      <StatCard title="Approved Applications" :value="stats.approved_applications" :href="route('admin.applications.index', { status: 'approved' })" color="cyan">
        <CheckCircleIcon class="h-6 w-6" />
      </StatCard>

      <StatCard title="Rejected Applications" :value="stats.rejected_applications" :href="route('admin.applications.index', { status: 'rejected' })" color="rose">
        <XCircleIcon class="h-6 w-6" />
      </StatCard>
      <!-- Mwisho wa Boresho -->
      
      <StatCard title="Total Posts" :value="stats.posts" :href="route('admin.posts.index')" color="orange">
        <NewspaperIcon class="h-6 w-6" />
      </StatCard>

      <StatCard title="Total Transactions" :value="stats.transactions" :href="route('admin.transactions.index')" color="green">
        <TransactionIcon class="h-6 w-6" />
      </StatCard>

      <StatCard title="Total Categories" :value="stats.categories" :href="route('admin.categories.index')" color="purple">
        <CategoryIcon />
      </StatCard>

      <StatCard title="Total Nominees" :value="stats.nominees" :href="route('admin.nominees.index')" color="indigo">
        <NomineeIcon />
      </StatCard>

      <StatCard title="Total Votes Cast" :value="stats.votes" :href="route('admin.votes.index')" color="red">
        <VoteIcon />
      </StatCard>

      <StatCard title="Total Users" :value="stats.users" :href="route('admin.dashboard')" color="pink">
        <UserIcon class="h-6 w-6" />
      </StatCard>

      <StatCard title="Tickets Sold" :value="stats.tickets_sold" :href="route('admin.dashboard')" color="teal">
        <TicketIcon class="h-6 w-6" />
      </StatCard>
    </div>

    <!-- Charts & Top Nominees -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-3 bg-gray-800/50 border border-gold-500/10 rounded-xl p-4 shadow-md">
        <h4 class="text-lg font-semibold text-gray-200 mb-3">Votes per Category</h4>
        <div class="h-80 relative">
          <BarChart :chart-data="votesChartData" />
        </div>
      </div>

      <div class="lg:col-span-2 bg-gray-800/50 border border-gold-500/10 rounded-xl p-4 shadow-md">
        <h4 class="text-lg font-semibold text-gray-200 mb-3">Daily Applications (Last 30 Days)</h4>
        <div class="h-80 relative">
          <BarChart :chart-data="applicationsChartData" chart-type="line" />
        </div>
      </div>

      <div class="lg:col-span-3 bg-gray-800/50 border border-gold-500/10 rounded-xl p-4 shadow-md">
        <h4 class="text-lg font-semibold text-gray-200 mb-3">Daily Votes (Last 30 Days)</h4>
        <div class="h-80 relative">
          <BarChart :chart-data="dailyVotesChartData" chart-type="line" />
        </div>
      </div>

      <div class="lg:col-span-2 bg-gray-800/50 border border-gold-500/10 rounded-xl p-4 shadow-md">
        <h4 class="text-lg font-semibold text-gray-200 mb-3">Overall Stats Breakdown</h4>
        <div class="h-80 relative">
          <DoughnutChart :chart-data="topNomineesChartData" />
        </div>
      </div>

      <!-- Top 10 Nominees -->
      <div class="lg:col-span-5 bg-gray-800/50 border border-gold-500/10 rounded-xl p-4 shadow-md">
        <h4 class="text-lg font-semibold text-gray-200 mb-3">Top 10 Nominees</h4>
        <div class="space-y-3">
          <div v-if="topNominees.length === 0" class="text-center text-gray-400 py-8">
            No voting data yet.
          </div>
          <Link
            v-for="nominee in topNominees"
            :key="nominee.id"
            :href="route('admin.nominees.edit', nominee.id)"
            class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <img v-if="nominee.image_url" :src="nominee.image_url" :alt="nominee.name" class="h-10 w-10 rounded-full object-cover border-2 border-gold-500/50" />
            <div v-else class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gold-400 font-bold border-2 border-gold-500/50">
              {{ nominee.name.charAt(0) }}
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-200 truncate">{{ nominee.name }}</p>
              <p class="text-xs text-gray-400">{{ nominee.category.name }}</p>
            </div>
            <p class="text-lg font-bold text-gold-400">{{ nominee.votes_count.toLocaleString() }} votes</p>
          </Link>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="mt-8 pt-6 border-t border-gold-500/20">
      <h3 class="text-lg font-semibold text-red-500">Danger Zone</h3>
      <div class="mt-4 bg-gray-800/50 border border-red-500/30 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-md">
        <div>
          <p class="font-medium text-red-600">Reset All Votes</p>
          <p class="text-sm text-gray-400 mt-1 max-w-lg">
            This will permanently delete all votes and reset the vote count for all nominees to zero. This action cannot be undone.
          </p>
        </div>
        <button @click="resetVotes" class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm shadow-md">
          <RefreshIcon class="mr-2 -ml-1 h-4 w-4" />
          Reset Votes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #f59e0b, #fcd34d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
