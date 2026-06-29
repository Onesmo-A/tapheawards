<script setup>
import { ref, watch } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    logs: Object,
    filters: Object,
    categories: Array,
    voteAuditWarnings: Object,
    topSuspiciousIps: Array,
});

const search = ref(props.filters.search);
const status = ref(props.filters.status);
const categoryId = ref(props.filters.category_id);
const dateFrom = ref(props.filters.date_from);
const dateTo = ref(props.filters.date_to);

const pruneForm = useForm({
    older_than_days: 30,
});

watch([search, status, categoryId, dateFrom, dateTo], debounce(() => {
    router.get(route('admin.vote-attempt-logs.index'), {
        search: search.value,
        status: status.value,
        category_id: categoryId.value,
        date_from: dateFrom.value,
        date_to: dateTo.value,
    }, { preserveState: true, replace: true });
}, 300));

const pruneLogs = () => {
    if (!confirm(`Una uhakika unataka kufuta vote attempt history older than ${pruneForm.older_than_days} days?`)) {
        return;
    }

    pruneForm.post(route('admin.vote-attempt-logs.prune'), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Vote Attempt Logs" />

    <div class="mb-6 flex items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold text-white">Vote Attempt Logs</h2>
            <p class="mt-1 text-sm text-gray-400">Angalia attempts zilizo-blockiwa, duplicate, na success kwa audit.</p>
        </div>
        <form @submit.prevent="pruneLogs" class="flex items-center gap-3">
            <label class="flex items-center gap-2 text-sm text-gray-300">
                <span>Prune older than</span>
                <input v-model="pruneForm.older_than_days" type="number" min="1" class="w-20 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-white" />
                <span class="text-gray-400">days</span>
            </label>
            <button type="submit" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500" :disabled="pruneForm.processing">
                Prune
            </button>
        </form>
    </div>

    <div class="rounded-2xl border border-white/10 bg-gray-900/70 p-5 mb-6">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-white">Vote Audit Snapshot</h3>
          <p class="text-sm text-gray-400">Chagua card ili utafute vitendo vya kura moja kwa moja.</p>
        </div>
        <Link :href="route('admin.vote-attempt-logs.index')" class="text-sm text-red-300 hover:text-red-200 underline">
          Refresh logs
        </Link>
      </div>

      <div class="grid gap-4 md:grid-cols-5">
        <Link :href="route('admin.vote-attempt-logs.index', { status: 'success' })" class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 transition hover:bg-emerald-500/15">
          <p class="text-xs uppercase tracking-wide text-emerald-200">Success</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ props.voteAuditWarnings.success_attempts || 0 }}</p>
        </Link>
        <Link :href="route('admin.vote-attempt-logs.index', { status: 'blocked' })" class="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 transition hover:bg-amber-500/15">
          <p class="text-xs uppercase tracking-wide text-amber-200">Blocked</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ props.voteAuditWarnings.blocked_attempts || 0 }}</p>
        </Link>
        <Link :href="route('admin.vote-attempt-logs.index', { status: 'duplicate' })" class="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 transition hover:bg-red-500/15">
          <p class="text-xs uppercase tracking-wide text-red-200">Duplicate</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ props.voteAuditWarnings.duplicate_attempts || 0 }}</p>
        </Link>
        <Link :href="route('admin.vote-attempt-logs.index', { search: 'Bot-like' })" class="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 transition hover:bg-orange-500/15">
          <p class="text-xs uppercase tracking-wide text-orange-200">Bot Flags</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ props.voteAuditWarnings.bot_attempts || 0 }}</p>
        </Link>
        <Link :href="route('admin.vote-attempt-logs.index', { search: 'VPN' })" class="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition hover:bg-cyan-500/15">
          <p class="text-xs uppercase tracking-wide text-cyan-200">VPN Flags</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ props.voteAuditWarnings.vpn_attempts || 0 }}</p>
        </Link>
      </div>
    </div>

    <div class="rounded-2xl border border-white/10 bg-gray-900/70 p-5 mb-6">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-white">Suspicious IPs</h3>
          <p class="text-sm text-gray-400">IP hizi zimeonekana kwenye blocked vote attempts.</p>
        </div>
        <Link :href="route('admin.vote-attempt-logs.index', { status: 'blocked' })" class="text-sm text-red-300 hover:text-red-200 underline">
          Open blocked logs
        </Link>
      </div>
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Link
          v-for="item in props.topSuspiciousIps"
          :key="item.ip_address"
          :href="route('admin.vote-attempt-logs.index', { search: item.ip_address, status: 'blocked' })"
          class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
        >
          <p class="text-sm font-semibold text-white">{{ item.ip_address }}</p>
          <p class="text-xs text-gray-400">{{ item.attempts }} blocked attempts</p>
        </Link>
        <div v-if="props.topSuspiciousIps.length === 0" class="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-sm text-gray-400 md:col-span-2 xl:col-span-5">
          No suspicious IPs recorded yet.
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-white/10 bg-gray-900/70 p-5 mb-6">
      <div class="grid gap-3 md:grid-cols-5">
            <input v-model="search" type="text" placeholder="Search reason / IP / fingerprint" class="rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
            <select v-model="status" class="rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="blocked">Blocked</option>
                <option value="duplicate">Duplicate</option>
                <option value="error">Error</option>
            </select>
            <select v-model="categoryId" class="rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <input v-model="dateFrom" type="date" class="rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
            <input v-model="dateTo" type="date" class="rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
        </div>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-white/10 bg-gray-900/70">
        <table class="min-w-full divide-y divide-gray-800">
            <thead class="bg-gray-950">
                <tr>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Time</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Status</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Nominee</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Category</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">IP</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Risk</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Reason</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
                <tr v-for="log in logs.data" :key="log.id" class="hover:bg-white/5">
                    <td class="px-4 py-3 text-sm text-gray-300">{{ new Date(log.attempted_at).toLocaleString() }}</td>
                    <td class="px-4 py-3 text-sm">
                        <span class="rounded-full px-3 py-1 text-xs font-semibold"
                              :class="{
                                'bg-emerald-500/15 text-emerald-300': log.status === 'success',
                                'bg-red-500/15 text-red-300': log.status === 'blocked' || log.status === 'error',
                                'bg-yellow-500/15 text-yellow-300': log.status === 'duplicate',
                              }">
                            {{ log.status }}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-white">{{ log.nominee?.name || 'N/A' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-300">{{ log.category?.name || 'N/A' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-300">{{ log.ip_address }}</td>
                    <td class="px-4 py-3 text-sm text-gray-300">
                        <div class="space-y-1">
                            <div>Score: {{ log.risk_score ?? 'n/a' }}</div>
                            <div v-if="log.subnet" class="text-xs text-gray-500">{{ log.subnet }}</div>
                            <div v-if="log.asn_name" class="text-xs text-gray-500">{{ log.asn_name }}</div>
                            <div v-if="log.rate_limited" class="text-xs text-amber-300">Rate limited</div>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-400">{{ log.reason }}</td>
                </tr>
                <tr v-if="logs.data.length === 0">
                    <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-400">Hakuna log zilizoonekana.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="logs.links.length > 3" class="mt-6">
        <Pagination :links="logs.links" />
    </div>
</template>
