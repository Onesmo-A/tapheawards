<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';


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
    // BORESHO: Ongeza fields za timeline
    timeline_step1_title: props.settings.timeline_step1_title || '',
    timeline_step1_date: props.settings.timeline_step1_date || '',
    timeline_step2_title: props.settings.timeline_step2_title || '',
    timeline_step2_date: props.settings.timeline_step2_date || '',
    timeline_step3_title: props.settings.timeline_step3_title || '',
    timeline_step3_date: props.settings.timeline_step3_date || '',
    timeline_step4_title: props.settings.timeline_step4_title || '',
    timeline_step4_date: props.settings.timeline_step4_date || '',
    timeline_step5_title: props.settings.timeline_step5_title || '',
    timeline_step5_date: props.settings.timeline_step5_date || '',
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

                <!-- BORESHO: Timeline Settings -->
                <h3 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Event Timeline Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Step 1 -->
                    <div>
                        <InputLabel for="timeline_step1_title" value="Timeline Step 1: Title" />
                        <TextInput id="timeline_step1_title" v-model="form.timeline_step1_title" type="text" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.timeline_step1_title" />
                    </div>
                    <div>
                        <InputLabel for="timeline_step1_date" value="Timeline Step 1: Date Range" />
                        <TextInput id="timeline_step1_date" v-model="form.timeline_step1_date" type="text" class="mt-1 block w-full" placeholder="e.g., Aug 30 - Sep 15" />
                        <InputError class="mt-2" :message="form.errors.timeline_step1_date" />
                    </div>
                    <!-- Step 2 -->
                    <div>
                        <InputLabel for="timeline_step2_title" value="Timeline Step 2: Title" />
                        <TextInput id="timeline_step2_title" v-model="form.timeline_step2_title" type="text" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.timeline_step2_title" />
                    </div>
                    <div>
                        <InputLabel for="timeline_step2_date" value="Timeline Step 2: Date Range" />
                        <TextInput id="timeline_step2_date" v-model="form.timeline_step2_date" type="text" class="mt-1 block w-full" placeholder="e.g., Sep 16 - Oct 10" />
                        <InputError class="mt-2" :message="form.errors.timeline_step2_date" />
                    </div>
                    <!-- Step 3 -->
                    <div>
                        <InputLabel for="timeline_step3_title" value="Timeline Step 3: Title" />
                        <TextInput id="timeline_step3_title" v-model="form.timeline_step3_title" type="text" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.timeline_step3_title" />
                    </div>
                    <div>
                        <InputLabel for="timeline_step3_date" value="Timeline Step 3: Date" />
                        <TextInput id="timeline_step3_date" v-model="form.timeline_step3_date" type="text" class="mt-1 block w-full" placeholder="e.g., Oct 25" />
                        <InputError class="mt-2" :message="form.errors.timeline_step3_date" />
                    </div>
                    <!-- Step 4 -->
                    <div>
                        <InputLabel for="timeline_step4_title" value="Timeline Step 4: Title" />
                        <TextInput id="timeline_step4_title" v-model="form.timeline_step4_title" type="text" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.timeline_step4_title" />
                    </div>
                    <div>
                        <InputLabel for="timeline_step4_date" value="Timeline Step 4: Date" />
                        <TextInput id="timeline_step4_date" v-model="form.timeline_step4_date" type="text" class="mt-1 block w-full" placeholder="e.g., Nov 03" />
                        <InputError class="mt-2" :message="form.errors.timeline_step4_date" />
                    </div>
                    <!-- Step 5 -->
                    <div>
                        <InputLabel for="timeline_step5_title" value="Timeline Step 5: Title" />
                        <TextInput id="timeline_step5_title" v-model="form.timeline_step5_title" type="text" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.timeline_step5_title" />
                    </div>
                    <div>
                        <InputLabel for="timeline_step5_date" value="Timeline Step 5: Date" />
                        <TextInput id="timeline_step5_date" v-model="form.timeline_step5_date" type="text" class="mt-1 block w-full" placeholder="e.g., Nov 10" />
                        <InputError class="mt-2" :message="form.errors.timeline_step5_date" />
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
