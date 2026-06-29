<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputLabel from '@/Components/InputLabel.vue';

defineOptions({ layout: AdminLayout });

defineProps({
    archives: Array,
    seasons: Array,
});

const form = useForm({
    season_award_id: '',
    notes: '',
});

const snapshot = () => {
    form.post(route('admin.vote-archives.snapshot'), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Vote Archives" />

    <div class="mb-6">
        <h2 class="text-2xl font-bold text-white">Vote Archives</h2>
        <p class="mt-1 text-sm text-gray-400">Ongeza snapshot ya kura kwa season au angalia historical totals kwa category.</p>
    </div>

    <div class="mb-6 rounded-2xl border border-white/10 bg-gray-900/70 p-5">
        <div class="grid gap-4 md:grid-cols-3">
            <div>
                <InputLabel value="Season" class="text-gray-300" />
                <select v-model="form.season_award_id" class="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
                    <option value="">No season</option>
                    <option v-for="season in seasons" :key="season.id" :value="season.id">{{ season.year }} - {{ season.theme || 'Untitled' }}</option>
                </select>
            </div>
            <div class="md:col-span-2">
                <InputLabel value="Notes" class="text-gray-300" />
                <input v-model="form.notes" type="text" class="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-white">
            </div>
        </div>
        <div class="mt-4">
            <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500" @click="snapshot" :disabled="form.processing">
                Create Snapshot
            </button>
        </div>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-white/10 bg-gray-900/70">
        <table class="min-w-full divide-y divide-gray-800">
            <thead class="bg-gray-950">
                <tr>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Year</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Category</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Nominee</th>
                    <th class="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Votes</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
                <tr v-for="row in archives" :key="row.id" class="hover:bg-white/5">
                    <td class="px-4 py-3 text-sm text-white">{{ row.season_award?.year || row.archived_at?.slice(0, 10) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-300">{{ row.category?.name || 'N/A' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-300">{{ row.nominee?.name || 'N/A' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-300">{{ row.votes_count }}</td>
                </tr>
                <tr v-if="archives.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-400">Hakuna archives bado.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
