<script setup>
import { computed, ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import Textarea from '@/Components/Textarea.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    seasons: Array,
});

const selectedSeasonId = ref(null);
const currentYear = new Date().getFullYear();
const yearOptions = computed(() => {
    const values = new Set(props.seasons.map((season) => Number(season.year)).filter(Boolean));

    for (let year = currentYear - 1; year <= currentYear + 5; year += 1) {
        values.add(year);
    }

    return Array.from(values).sort((a, b) => b - a);
});

const form = useForm({
    year: currentYear,
    theme: '',
    description: '',
    event_date: '',
    event_location_name: '',
    event_location_address: '',
    event_location_map_url: '',
    cover_image: null,
});

const totalSeasons = computed(() => props.seasons.length);

const resetForm = () => {
    selectedSeasonId.value = null;
    form.reset();
    form.year = currentYear;
    form.clearErrors();
};

const editSeason = (season) => {
    selectedSeasonId.value = season.id;
    form.year = season.year || currentYear;
    form.theme = season.theme || '';
    form.description = season.description || '';
    form.event_date = season.event_date || '';
    form.event_location_name = season.event_location_name || '';
    form.event_location_address = season.event_location_address || '';
    form.event_location_map_url = season.event_location_map_url || '';
    form.cover_image = null;
    form.clearErrors();
};

const submit = () => {
    const options = { preserveScroll: true, forceFormData: true, onSuccess: () => resetForm() };
    if (selectedSeasonId.value) {
        form.put(route('admin.season-awards.update', selectedSeasonId.value), options);
        return;
    }
    form.post(route('admin.season-awards.store'), options);
};

const removeSeason = (season) => {
    if (!confirm(`Unataka kufuta season ya mwaka ${season.year}?`)) return;
    router.delete(route('admin.season-awards.destroy', season.id), { preserveScroll: true });
};

resetForm();
</script>

<template>
    <Head title="Award Seasons" />

    <div class="space-y-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
                <p class="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Awards Management</p>
                <h2 class="mt-2 text-3xl font-bold text-white">Award Seasons</h2>
                <p class="mt-2 text-sm leading-6 text-gray-400">
                    Badilisha misimu ya awards, cover image, event location, na taarifa za archive kwa mtiririko safi.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
                <div class="rounded-2xl border border-white/10 bg-gray-800/70 px-4 py-3">
                    <p class="text-xs uppercase tracking-wide text-gray-400">Total Seasons</p>
                    <p class="text-2xl font-semibold text-white">{{ totalSeasons }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-gray-800/70 px-4 py-3">
                    <p class="text-xs uppercase tracking-wide text-gray-400">Mode</p>
                    <p class="text-2xl font-semibold text-emerald-400">{{ selectedSeasonId ? 'Editing' : 'Creating' }}</p>
                </div>
            </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section class="rounded-3xl border border-white/10 bg-gray-900/70 p-6 shadow-2xl shadow-black/20">
                <div class="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-white">{{ selectedSeasonId ? 'Edit Season' : 'Create Season' }}</h3>
                        <p class="text-sm text-gray-400">Hapa ndipo chanzo cha public awards archive pages.</p>
                    </div>
                    <button v-if="selectedSeasonId" type="button" class="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5" @click="resetForm">Cancel</button>
                </div>

                <form class="space-y-5" @submit.prevent="submit">
                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <InputLabel for="year" value="Year" class="text-gray-300" />
                            <select id="year" v-model="form.year" class="mt-1 block w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-white shadow-sm focus:border-red-500 focus:ring-red-500">
                                <option v-for="year in yearOptions" :key="year" :value="year">
                                    {{ year }}
                                </option>
                            </select>
                            <InputError class="mt-2" :message="form.errors.year" />
                        </div>
                        <div>
                            <InputLabel for="event_date" value="Event Date" class="text-gray-300" />
                            <TextInput id="event_date" v-model="form.event_date" type="date" class="mt-1 block w-full" />
                            <InputError class="mt-2" :message="form.errors.event_date" />
                        </div>
                    </div>

                    <div>
                        <InputLabel for="theme" value="Theme" class="text-gray-300" />
                        <TextInput id="theme" v-model="form.theme" type="text" class="mt-1 block w-full" placeholder="Awards theme" />
                        <InputError class="mt-2" :message="form.errors.theme" />
                    </div>

                    <div>
                        <InputLabel for="description" value="Description" class="text-gray-300" />
                        <Textarea id="description" v-model="form.description" class="mt-1 block w-full" rows="4" placeholder="Short description for the season" />
                        <InputError class="mt-2" :message="form.errors.description" />
                    </div>

                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <InputLabel for="event_location_name" value="Event Location Name" class="text-gray-300" />
                            <TextInput id="event_location_name" v-model="form.event_location_name" type="text" class="mt-1 block w-full" />
                            <InputError class="mt-2" :message="form.errors.event_location_name" />
                        </div>
                        <div>
                            <InputLabel for="event_location_map_url" value="Map URL" class="text-gray-300" />
                            <TextInput id="event_location_map_url" v-model="form.event_location_map_url" type="url" class="mt-1 block w-full" placeholder="https://maps.google.com/..." />
                            <InputError class="mt-2" :message="form.errors.event_location_map_url" />
                        </div>
                    </div>

                    <div>
                        <InputLabel for="event_location_address" value="Event Location Address" class="text-gray-300" />
                        <Textarea id="event_location_address" v-model="form.event_location_address" class="mt-1 block w-full" rows="3" placeholder="Venue address" />
                        <InputError class="mt-2" :message="form.errors.event_location_address" />
                    </div>

                    <div>
                        <InputLabel for="cover_image" value="Cover Image" class="text-gray-300" />
                        <input
                            id="cover_image"
                            type="file"
                            accept="image/*"
                            class="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-500"
                            @change="form.cover_image = $event.target.files[0] || null"
                        >
                        <InputError class="mt-2" :message="form.errors.cover_image" />
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button v-if="selectedSeasonId" type="button" class="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5" @click="resetForm">Reset</button>
                        <button type="submit" class="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-500" :disabled="form.processing">
                            {{ selectedSeasonId ? 'Update Season' : 'Save Season' }}
                        </button>
                    </div>
                </form>
            </section>

            <section class="rounded-3xl border border-white/10 bg-gray-900/70 p-6 shadow-2xl shadow-black/20">
                <div class="mb-5 flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-white">Season List</h3>
                        <p class="text-sm text-gray-400">Hariri au futa season iliyo tayari.</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <article v-for="season in seasons" :key="season.id" class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <div class="grid gap-0 md:grid-cols-[160px_1fr]">
                            <div class="h-44 md:h-full">
                                <img
                                    v-if="season.cover_image_url"
                                    :src="season.cover_image_url"
                                    :alt="season.theme || season.year"
                                    class="h-full w-full object-cover"
                                >
                                <div v-else class="flex h-full items-center justify-center bg-gray-800 text-gray-500">
                                    No cover
                                </div>
                            </div>

                            <div class="p-5">
                                <div class="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Season</p>
                                        <h4 class="mt-1 text-2xl font-bold text-white">{{ season.year }}</h4>
                                    </div>
                                    <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-300">
                                        {{ season.event_date || 'No date' }}
                                    </span>
                                </div>

                                <p v-if="season.theme" class="mt-2 text-sm text-gray-300">{{ season.theme }}</p>
                                <p v-if="season.event_location_name" class="mt-3 text-sm text-gray-400">{{ season.event_location_name }}</p>
                                <p v-if="season.event_location_address" class="mt-1 text-sm leading-6 text-gray-500">{{ season.event_location_address }}</p>

                                <div class="mt-5 flex flex-wrap gap-3">
                                    <button type="button" class="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15" @click="editSeason(season)">Edit</button>
                                    <button type="button" class="rounded-full bg-red-600/15 px-4 py-2 text-sm text-red-300 hover:bg-red-600/25" @click="removeSeason(season)">Delete</button>
                                </div>
                            </div>
                        </div>
                    </article>

                    <div v-if="seasons.length === 0" class="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-gray-400">
                        Hakuna season bado.
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
