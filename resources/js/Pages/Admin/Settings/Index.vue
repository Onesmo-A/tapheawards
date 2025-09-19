<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';

const props = defineProps({
    settings: Object,
});

const toast = useToast();

const form = useForm({
    voting_active: Boolean(Number(props.settings.voting_active)),
    voting_deadline: props.settings.voting_deadline || '',
    show_winners: Boolean(Number(props.settings.show_winners)),
    marathon_fee: props.settings.marathon_fee || '0',
    nomination_open_title: props.settings.nomination_open_title || '',
    nomination_open_dates: props.settings.nomination_open_dates || '',
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

</script>

<template>
    <AdminLayout>
        <Head title="Application Settings" />
        
        <!-- Header Section -->
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-white">Application Settings</h2>
            <p class="mt-1 text-sm text-gray-400">Manage general, voting, and marathon settings for the application.</p>
        </div>

        <!-- Form Section -->
        <div class="max-w-4xl mx-auto bg-gray-800/50 border border-gold-500/10 shadow-2xl overflow-hidden sm:rounded-2xl p-6">
            <form @submit.prevent="updateSettings">
                <!-- Winners Section -->
                <h3 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Winners Settings</h3>
                
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

                <div class="border-t dark:border-gray-700 my-6"></div>

                <!-- Voting Section -->
                <h3 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Voting Settings</h3>
                <div class="space-y-6">
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
                
                <div class="border-t dark:border-gray-700 my-6"></div>

                <!-- Nomination Section Settings -->
                <h3 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Nomination Section Settings</h3>
                <div class="space-y-6">
                    <div>
                        <InputLabel for="nomination_open_title" value="Nomination Open Title" class="dark:text-gray-300" />
                        <input type="text" id="nomination_open_title" v-model="form.nomination_open_title" class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-input focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" placeholder="e.g., Nomination Is Now Open">
                        <InputError :message="form.errors.nomination_open_title" class="mt-2" />
                    </div>
                    <div>
                        <InputLabel for="nomination_open_dates" value="Nomination Open Dates" class="dark:text-gray-300" />
                        <input type="text" id="nomination_open_dates" v-model="form.nomination_open_dates" class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-input focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" placeholder="e.g., 15th July - 30th August 2024">
                        <InputError :message="form.errors.nomination_open_dates" class="mt-2" />
                    </div>
                </div>

                <div class="border-t dark:border-gray-700 my-6"></div>

                <!-- Marathon Section -->
                <h3 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Marathon Settings</h3>
                <div class="space-y-6">
                    <!-- Marathon Fee -->
                    <div>
                        <label for="marathon_fee" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Marathon Registration Fee (TZS)</label>
                        <input type="number" id="marathon_fee" v-model="form.marathon_fee" class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-input focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" placeholder="e.g., 35000">
                        <p class="text-xs mt-1 text-gray-600 dark:text-gray-400">Set the fee for marathon registration. Do not include commas.</p>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="mt-8 pt-6 border-t border-gray-700 flex justify-end">
                    <button 
                        type="submit" 
                        :disabled="form.processing"
                        class="btn-primary"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>
