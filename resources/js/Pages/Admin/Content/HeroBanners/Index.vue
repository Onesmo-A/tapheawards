<script setup>
import { computed, ref } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import Textarea from '@/Components/Textarea.vue';

const props = defineProps({
    heroBanners: Array,
});

const selectedBannerId = ref(null);

const form = useForm({
    eyebrow: '',
    badge: '',
    title: '',
    description: '',
    image: null,
    primary_button_text: '',
    primary_button_url: '',
    secondary_button_text: '',
    secondary_button_url: '',
    sort_order: 0,
    is_active: true,
});

const totalBanners = computed(() => props.heroBanners.length);
const activeBanners = computed(() => props.heroBanners.filter((banner) => banner.is_active).length);

const resetForm = () => {
    selectedBannerId.value = null;
    form.reset();
    form.is_active = true;
    form.sort_order = props.heroBanners.length + 1;
    form.clearErrors();
};

const editBanner = (banner) => {
    selectedBannerId.value = banner.id;
    form.eyebrow = banner.eyebrow || '';
    form.badge = banner.badge || '';
    form.title = banner.title || '';
    form.description = banner.description || '';
    form.image = null;
    form.primary_button_text = banner.primary_button_text || '';
    form.primary_button_url = banner.primary_button_url || '';
    form.secondary_button_text = banner.secondary_button_text || '';
    form.secondary_button_url = banner.secondary_button_url || '';
    form.sort_order = banner.sort_order ?? 0;
    form.is_active = !!banner.is_active;
    form.clearErrors();
};

const submit = () => {
    const options = {
        preserveScroll: true,
        onSuccess: () => resetForm(),
    };

    if (selectedBannerId.value) {
        form.put(route('admin.hero-banners.update', selectedBannerId.value), options);
        return;
    }

    form.post(route('admin.hero-banners.store'), options);
};

const removeBanner = (banner) => {
    if (!confirm(`Unataka kufuta banner "${banner.title}"?`)) {
        return;
    }

    router.delete(route('admin.hero-banners.destroy', banner.id), {
        preserveScroll: true,
    });
};

const previewUrl = (banner) => banner.image_url || '/images/placeholder.png';

resetForm();
</script>

<template>
    <AdminLayout>
        <Head title="Hero Banners" />

        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-white">Hero Banners</h2>
                <p class="mt-1 text-sm text-gray-400">Simamia slides za homepage hero kutoka hapa. Zote zinahifadhiwa kwenye database.</p>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:w-auto">
                <div class="rounded-2xl border border-white/10 bg-gray-800/70 px-4 py-3">
                    <p class="text-xs uppercase tracking-wide text-gray-400">Total</p>
                    <p class="text-xl font-semibold text-white">{{ totalBanners }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-gray-800/70 px-4 py-3">
                    <p class="text-xs uppercase tracking-wide text-gray-400">Active</p>
                    <p class="text-xl font-semibold text-emerald-400">{{ activeBanners }}</p>
                </div>
            </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div class="rounded-3xl border border-white/10 bg-gray-900/70 p-6 shadow-2xl">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-semibold text-white">
                            {{ selectedBannerId ? 'Edit Hero Banner' : 'Create Hero Banner' }}
                        </h3>
                        <p class="text-sm text-gray-400">Ongeza title, image, buttons na order ya kuonekana.</p>
                    </div>
                    <button
                        v-if="selectedBannerId"
                        type="button"
                        class="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
                        @click="resetForm"
                    >
                        Cancel edit
                    </button>
                </div>

                <form class="space-y-5" @submit.prevent="submit">
                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <InputLabel for="eyebrow" value="Eyebrow" class="text-gray-300" />
                            <TextInput id="eyebrow" v-model="form.eyebrow" type="text" class="mt-1 block w-full" placeholder="Official TAPHE Awards" />
                            <InputError class="mt-2" :message="form.errors.eyebrow" />
                        </div>
                        <div>
                            <InputLabel for="badge" value="Badge" class="text-gray-300" />
                            <TextInput id="badge" v-model="form.badge" type="text" class="mt-1 block w-full" placeholder="Slide 01" />
                            <InputError class="mt-2" :message="form.errors.badge" />
                        </div>
                    </div>

                    <div>
                        <InputLabel for="title" value="Title" class="text-gray-300" />
                        <TextInput id="title" v-model="form.title" type="text" class="mt-1 block w-full" placeholder="Hero title" />
                        <InputError class="mt-2" :message="form.errors.title" />
                    </div>

                    <div>
                        <InputLabel for="description" value="Description" class="text-gray-300" />
                        <Textarea id="description" v-model="form.description" class="mt-1 block w-full" rows="4" placeholder="Short supporting description" />
                        <InputError class="mt-2" :message="form.errors.description" />
                    </div>

                    <div>
                        <InputLabel for="image" value="Hero Image" class="text-gray-300" />
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            class="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-500"
                            @change="form.image = $event.target.files[0] || null"
                        >
                        <InputError class="mt-2" :message="form.errors.image" />
                    </div>

                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <InputLabel for="primary_button_text" value="Primary Button Text" class="text-gray-300" />
                            <TextInput id="primary_button_text" v-model="form.primary_button_text" type="text" class="mt-1 block w-full" placeholder="Vote Now" />
                            <InputError class="mt-2" :message="form.errors.primary_button_text" />
                        </div>
                        <div>
                            <InputLabel for="primary_button_url" value="Primary Button URL" class="text-gray-300" />
                            <TextInput id="primary_button_url" v-model="form.primary_button_url" type="text" class="mt-1 block w-full" placeholder="/categories" />
                            <InputError class="mt-2" :message="form.errors.primary_button_url" />
                        </div>
                        <div>
                            <InputLabel for="secondary_button_text" value="Secondary Button Text" class="text-gray-300" />
                            <TextInput id="secondary_button_text" v-model="form.secondary_button_text" type="text" class="mt-1 block w-full" placeholder="View Winners" />
                            <InputError class="mt-2" :message="form.errors.secondary_button_text" />
                        </div>
                        <div>
                            <InputLabel for="secondary_button_url" value="Secondary Button URL" class="text-gray-300" />
                            <TextInput id="secondary_button_url" v-model="form.secondary_button_url" type="text" class="mt-1 block w-full" placeholder="/awards" />
                            <InputError class="mt-2" :message="form.errors.secondary_button_url" />
                        </div>
                    </div>

                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <InputLabel for="sort_order" value="Sort Order" class="text-gray-300" />
                            <TextInput id="sort_order" v-model="form.sort_order" type="number" min="0" class="mt-1 block w-full" />
                            <InputError class="mt-2" :message="form.errors.sort_order" />
                        </div>
                        <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <div>
                                <p class="font-medium text-white">Active</p>
                                <p class="text-xs text-gray-400">Banner itaonekana kwenye homepage.</p>
                            </div>
                            <label class="relative inline-flex cursor-pointer items-center">
                                <input v-model="form.is_active" type="checkbox" class="peer sr-only">
                                <div class="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-red-600 peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button
                            v-if="selectedBannerId"
                            type="button"
                            class="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
                            @click="resetForm"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            class="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500"
                            :disabled="form.processing"
                        >
                            {{ selectedBannerId ? 'Update Banner' : 'Save Banner' }}
                        </button>
                    </div>
                </form>
            </div>

            <div class="space-y-4">
                <div class="rounded-3xl border border-white/10 bg-gray-900/70 p-6 shadow-2xl">
                    <div class="mb-4 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-white">Current Slides</h3>
                            <p class="text-sm text-gray-400">Drag-sort inaweza kuongezwa baadaye; kwa sasa tumia sort order.</p>
                        </div>
                        <Link href="#top" class="text-sm text-red-300 hover:text-red-200">Go top</Link>
                    </div>

                    <div class="space-y-4">
                        <article
                            v-for="banner in heroBanners"
                            :key="banner.id"
                            class="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                        >
                            <img :src="previewUrl(banner)" :alt="banner.title" class="h-44 w-full object-cover">
                            <div class="space-y-3 p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-xs uppercase tracking-[0.2em] text-gray-400">
                                            {{ banner.badge || `Slide ${banner.sort_order}` }}
                                        </p>
                                        <h4 class="text-base font-semibold text-white">{{ banner.title }}</h4>
                                    </div>
                                    <span :class="banner.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-500/15 text-gray-300'" class="rounded-full px-3 py-1 text-xs font-semibold">
                                        {{ banner.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>

                                <p v-if="banner.description" class="text-sm leading-6 text-gray-300">
                                    {{ banner.description }}
                                </p>

                                <div class="flex flex-wrap gap-2 text-xs text-gray-300">
                                    <span class="rounded-full border border-white/10 px-3 py-1">Order {{ banner.sort_order }}</span>
                                    <span v-if="banner.primary_button_text" class="rounded-full border border-white/10 px-3 py-1">Primary: {{ banner.primary_button_text }}</span>
                                    <span v-if="banner.secondary_button_text" class="rounded-full border border-white/10 px-3 py-1">Secondary: {{ banner.secondary_button_text }}</span>
                                </div>

                                <div class="flex flex-wrap gap-3 pt-1">
                                    <button
                                        type="button"
                                        class="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
                                        @click="editBanner(banner)"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        class="rounded-full bg-red-600/15 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-600/25"
                                        @click="removeBanner(banner)"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>

                        <div v-if="heroBanners.length === 0" class="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-gray-400">
                            Hakuna hero banners bado. Anza kwa kuunda ya kwanza.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
