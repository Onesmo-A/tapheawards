<template>
    <AdminLayout title="Voting Settings">
        <div class="bg-white rounded-md shadow p-6 max-w-3xl mx-auto">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">Simamia Upigaji Kura</h2>

            <div v-if="$page.props.flash.success"
                class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                <p>{{ $page.props.flash.success }}</p>
            </div>

            <form @submit.prevent="submit">
                <!-- Voting Active Toggle -->
                <div class="flex items-center justify-between mb-6 border-b pb-6">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900">Ruhusu Upigaji Kura</h3>
                        <p class="text-sm text-gray-500">
                            Washa ili kuruhusu watumiaji kupiga kura. Zima ili kusitisha upigaji kura wote mara moja.
                        </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="form.voting_active" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                        </div>
                    </label>
                </div>

                <!-- Voting Deadline -->
                <div class="mb-6">
                    <label for="voting_deadline" class="block text-lg font-medium text-gray-900">Muda wa Mwisho wa Kura</label>
                    <p class="text-sm text-gray-500 mb-2">
                        Weka tarehe na saa ya kusitisha upigaji kura kiotomatiki. Acha wazi kama hakuna muda maalum.
                    </p>
                    <input id="voting_deadline" type="datetime-local" v-model="form.voting_deadline"
                        class="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    <div v-if="form.errors.voting_deadline" class="text-red-500 text-sm mt-1">{{ form.errors.voting_deadline }}</div>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end">
                    <button type="submit" :disabled="form.processing"
                        class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition">
                        Hifadhi Mipangilio
                    </button>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { useForm } from '@inertiajs/vue3';
import { onMounted } from 'vue';

const props = defineProps({
    settings: Object,
});

const form = useForm({
    voting_active: true,
    voting_deadline: null,
});

// Weka data ya awali kutoka server kwenye fomu
onMounted(() => {
    form.voting_active = props.settings.voting_active == '1';
    if (props.settings.voting_deadline) {
        const date = new Date(props.settings.voting_deadline);
        // Rekebisha kwa timezone ili kuonyesha muda sahihi wa mtumiaji
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - timezoneOffset);
        form.voting_deadline = localDate.toISOString().slice(0, 16);
    }
});

const submit = () => {
    form.post(route('admin.settings.update'), {
        preserveScroll: true,
    });
};
</script>