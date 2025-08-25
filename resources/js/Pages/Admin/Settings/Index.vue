<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';

const props = defineProps({
    settings: Object,
});

const toast = useToast();

const form = useForm({
    voting_active: Boolean(Number(props.settings.voting_active)),
    voting_deadline: props.settings.voting_deadline || '',
    show_winners: Boolean(Number(props.settings.show_winners)),
});

const updateSettings = () => {
    form.put(route('admin.settings.update'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.success('Settings updated successfully!');
        },
        onError: (errors) => {
            toast.error('Failed to update settings. Please check the form.');
            console.error(errors);
        }
    });
};

// Helper function to create a toggle switch
const ToggleSwitch = ({ modelValue, 'onUpdate:modelValue': onUpdate }, { slots }) => (
    h('label', { class: 'flex items-center cursor-pointer' }, [
        h('div', { class: 'relative' }, [
            h('input', {
                type: 'checkbox',
                class: 'sr-only',
                checked: modelValue,
                onChange: e => onUpdate(e.target.checked)
            }),
            h('div', { class: 'block bg-gray-600 w-14 h-8 rounded-full' }),
            h('div', {
                class: [
                    'dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform',
                    { 'transform translate-x-full bg-purple-400': modelValue }
                ]
            })
        ]),
        h('div', { class: 'ml-3 text-gray-700 dark:text-gray-200 font-medium' }, slots.default())
    ])
);

</script>

<template>
    <Head title="Application Settings" />

    <AdminLayout>
        <div class="container px-6 mx-auto grid">
            <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Application Settings
            </h2>

            <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <form @submit.prevent="updateSettings">
                    <div class="space-y-6">
                        <!-- Show Winners Toggle -->
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-semibold text-gray-700 dark:text-gray-200">Show Winners Page</p>
                                <p class="text-xs text-gray-600 dark:text-gray-400">
                                    Enable this to make the winners page visible to the public.
                                </p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.show_winners" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <!-- Voting Active Toggle -->
                        <div class="flex items-center justify-between">
                             <div>
                                <p class="font-semibold text-gray-700 dark:text-gray-200">Activate Voting</p>
                                <p class="text-xs text-gray-600 dark:text-gray-400">
                                    Allow users to cast votes.
                                </p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.voting_active" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <!-- Voting Deadline -->
                        <div>
                            <label for="voting_deadline" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Voting Deadline</label>
                            <input type="datetime-local" id="voting_deadline" v-model="form.voting_deadline" class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-input focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                        </div>
                    </div>

                    <div class="mt-6">
                        <button type="submit" :disabled="form.processing"
                            class="px-5 py-3 font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple disabled:opacity-50">
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
</template>
