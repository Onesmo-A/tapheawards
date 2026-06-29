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
    sponsors: Array,
});

const selectedSponsorId = ref(null);

const form = useForm({
    name: '',
    tier: '',
    description: '',
    logo: null,
    website_url: '',
    is_active: true,
    sort_order: 0,
});

const totalSponsors = computed(() => props.sponsors.length);
const activeSponsors = computed(() => props.sponsors.filter((sponsor) => sponsor.is_active).length);

const resetForm = () => {
    selectedSponsorId.value = null;
    form.reset();
    form.is_active = true;
    form.sort_order = props.sponsors.length + 1;
    form.clearErrors();
};

const editSponsor = (sponsor) => {
    selectedSponsorId.value = sponsor.id;
    form.name = sponsor.name || '';
    form.tier = sponsor.tier || '';
    form.description = sponsor.description || '';
    form.logo = null;
    form.website_url = sponsor.website_url || '';
    form.is_active = !!sponsor.is_active;
    form.sort_order = sponsor.sort_order ?? 0;
    form.clearErrors();
};

const submit = () => {
    const options = { preserveScroll: true, forceFormData: true, onSuccess: () => resetForm() };

    if (selectedSponsorId.value) {
        form.put(route('admin.sponsors.update', selectedSponsorId.value), options);
        return;
    }

    form.post(route('admin.sponsors.store'), options);
};

const removeSponsor = (sponsor) => {
    if (!confirm(`Unataka kufuta sponsor "${sponsor.name}"?`)) return;
    router.delete(route('admin.sponsors.destroy', sponsor.id), { preserveScroll: true });
};

resetForm();
</script>

<template>
    <Head title="Sponsors" />

    <div class="space-y-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
                <p class="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Brand Partners</p>
                <h2 class="mt-2 text-3xl font-bold text-white">Sponsors</h2>
                <p class="mt-2 text-sm leading-6 text-gray-400">
                    Ongeza, hariri, panga, na ficha sponsor cards kwa layout mpya iliyo safi na rahisi kusoma.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
                <div class="rounded-2xl border border-white/10 bg-gray-800/70 px-4 py-3">
                    <p class="text-xs uppercase tracking-wide text-gray-400">Total Sponsors</p>
                    <p class="text-2xl font-semibold text-white">{{ totalSponsors }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-gray-800/70 px-4 py-3">
                    <p class="text-xs uppercase tracking-wide text-gray-400">Active Sponsors</p>
                    <p class="text-2xl font-semibold text-emerald-400">{{ activeSponsors }}</p>
                </div>
            </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section class="rounded-3xl border border-white/10 bg-gray-900/70 p-6 shadow-2xl shadow-black/20">
                <div class="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-white">{{ selectedSponsorId ? 'Edit Sponsor' : 'Create Sponsor' }}</h3>
                        <p class="text-sm text-gray-400">Logo mpya itaifadhiwa kwenye public storage mpya.</p>
                    </div>
                    <button
                        v-if="selectedSponsorId"
                        type="button"
                        class="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
                        @click="resetForm"
                    >
                        Cancel
                    </button>
                </div>

                <form class="space-y-5" @submit.prevent="submit">
                    <div>
                        <InputLabel for="name" value="Sponsor Name" class="text-gray-300" />
                        <TextInput id="name" v-model="form.name" type="text" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.name" />
                    </div>

                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <InputLabel for="tier" value="Tier" class="text-gray-300" />
                            <TextInput id="tier" v-model="form.tier" type="text" class="mt-1 block w-full" placeholder="Title Sponsor" />
                            <InputError class="mt-2" :message="form.errors.tier" />
                        </div>
                        <div>
                            <InputLabel for="sort_order" value="Sort Order" class="text-gray-300" />
                            <TextInput id="sort_order" v-model="form.sort_order" type="number" min="0" class="mt-1 block w-full" />
                            <InputError class="mt-2" :message="form.errors.sort_order" />
                        </div>
                    </div>

                    <div>
                        <InputLabel for="description" value="Description" class="text-gray-300" />
                        <Textarea id="description" v-model="form.description" class="mt-1 block w-full" rows="4" />
                        <InputError class="mt-2" :message="form.errors.description" />
                    </div>

                    <div>
                        <InputLabel for="logo" value="Logo" class="text-gray-300" />
                        <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            class="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-500"
                            @change="form.logo = $event.target.files[0] || null"
                        >
                        <InputError class="mt-2" :message="form.errors.logo" />
                    </div>

                    <div>
                        <InputLabel for="website_url" value="Website URL" class="text-gray-300" />
                        <TextInput id="website_url" v-model="form.website_url" type="url" class="mt-1 block w-full" placeholder="https://..." />
                        <InputError class="mt-2" :message="form.errors.website_url" />
                    </div>

                    <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div>
                            <p class="font-medium text-white">Active</p>
                            <p class="text-xs text-gray-400">Sponsor ataonekana kwenye frontend.</p>
                        </div>
                        <input v-model="form.is_active" type="checkbox" class="h-5 w-5 rounded border-gray-500 bg-gray-900 text-red-600">
                    </div>

                    <div class="flex justify-end gap-3">
                        <button
                            v-if="selectedSponsorId"
                            type="button"
                            class="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
                            @click="resetForm"
                        >
                            Reset
                        </button>
                        <button type="submit" class="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500" :disabled="form.processing">
                            {{ selectedSponsorId ? 'Update Sponsor' : 'Save Sponsor' }}
                        </button>
                    </div>
                </form>
            </section>

            <section class="space-y-4">
                <article v-for="sponsor in sponsors" :key="sponsor.id" class="overflow-hidden rounded-3xl border border-white/10 bg-gray-900/70 shadow-2xl shadow-black/20">
                    <div class="grid gap-0 md:grid-cols-[160px_1fr]">
                        <div class="flex items-center justify-center bg-white/5 p-6">
                            <img v-if="sponsor.logo_url" :src="sponsor.logo_url" :alt="sponsor.name" class="max-h-28 max-w-full object-contain">
                            <div v-else class="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-gray-500">
                                No logo
                            </div>
                        </div>

                        <div class="p-5">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p class="text-xs uppercase tracking-[0.2em] text-gray-400">{{ sponsor.tier || 'Sponsor' }}</p>
                                    <h4 class="mt-1 text-2xl font-bold text-white">{{ sponsor.name }}</h4>
                                </div>
                                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="sponsor.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-500/15 text-gray-300'">
                                    {{ sponsor.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </div>

                            <p v-if="sponsor.description" class="mt-3 text-sm leading-6 text-gray-400">
                                {{ sponsor.description }}
                            </p>

                            <div class="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
                                <span class="rounded-full border border-white/10 px-3 py-1">Order {{ sponsor.sort_order }}</span>
                                <span v-if="sponsor.website_url" class="rounded-full border border-white/10 px-3 py-1">{{ sponsor.website_url }}</span>
                            </div>

                            <div class="mt-5 flex flex-wrap gap-3">
                                <button type="button" class="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15" @click="editSponsor(sponsor)">Edit</button>
                                <button type="button" class="rounded-full bg-red-600/15 px-4 py-2 text-sm text-red-300 hover:bg-red-600/25" @click="removeSponsor(sponsor)">Delete</button>
                            </div>
                        </div>
                    </div>
                </article>

                <div v-if="sponsors.length === 0" class="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-gray-400">
                    Hakuna sponsor bado. Ongeza wa kwanza.
                </div>
            </section>
        </div>
    </div>
</template>
