<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import Textarea from '@/Components/Textarea.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    invitation: Object,
});

const form = useForm({
    _method: 'PUT',
    guest_name: props.invitation.guest_name,
    guest_title: props.invitation.guest_title,
    event_name: props.invitation.event_name,
    event_description: props.invitation.event_description,
    event_date: props.invitation.event_date,
    event_time: props.invitation.event_time,
    event_venue: props.invitation.event_venue,
    dress_code: props.invitation.dress_code,
});

const submit = () => {
    form.put(route('admin.invitations.update', props.invitation.id));
};
</script>

<template>
    <Head title="Edit Invitation" />

    <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div class="sm:flex sm:items-center mb-6">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-bold text-white">Edit Invitation</h1>
                <p class="mt-2 text-sm text-gray-300">
                    Update the details for {{ invitation.guest_name }}.
                </p>
            </div>
        </div>

        <form @submit.prevent="submit">
            <div class="shadow sm:overflow-hidden sm:rounded-md">
                <div class="space-y-6 bg-gray-800/50 px-4 py-5 sm:p-6">
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <InputLabel for="guest_name" value="Guest Full Name" />
                            <TextInput id="guest_name" v-model="form.guest_name" type="text" class="mt-1 block w-full" required autofocus />
                            <InputError class="mt-2" :message="form.errors.guest_name" />
                        </div>

                        <div>
                            <InputLabel for="guest_title" value="Guest Title (e.g., CEO, Minister)" />
                            <TextInput id="guest_title" v-model="form.guest_title" type="text" class="mt-1 block w-full" />
                            <InputError class="mt-2" :message="form.errors.guest_title" />
                        </div>

                        <div class="col-span-1 sm:col-span-2 border-t border-gray-700 pt-6">
                            <h4 class="text-base font-medium text-gray-200">Event Details</h4>
                            <p class="text-sm text-gray-400">Edit the event details for this specific invitation.</p>
                        </div>

                        <div class="col-span-1 sm:col-span-2">
                            <InputLabel for="event_name" value="Event Name" />
                            <TextInput id="event_name" v-model="form.event_name" type="text" class="mt-1 block w-full" required />
                            <InputError class="mt-2" :message="form.errors.event_name" />
                        </div>

                        <div class="col-span-1 sm:col-span-2">
                            <InputLabel for="event_description" value="Event Description" />
                            <Textarea id="event_description" v-model="form.event_description" rows="4" class="mt-1 block w-full" />
                            <InputError class="mt-2" :message="form.errors.event_description" />
                        </div>

                        <div>
                            <InputLabel for="event_date" value="Event Date" />
                            <TextInput id="event_date" v-model="form.event_date" type="text" class="mt-1 block w-full" required />
                            <InputError class="mt-2" :message="form.errors.event_date" />
                        </div>

                        <div>
                            <InputLabel for="event_time" value="Event Time" />
                            <TextInput id="event_time" v-model="form.event_time" type="text" class="mt-1 block w-full" required />
                            <InputError class="mt-2" :message="form.errors.event_time" />
                        </div>

                        <div>
                            <InputLabel for="event_venue" value="Event Venue" />
                            <TextInput id="event_venue" v-model="form.event_venue" type="text" class="mt-1 block w-full" required />
                            <InputError class="mt-2" :message="form.errors.event_venue" />
                        </div>

                        <div>
                            <InputLabel for="dress_code" value="Dress Code" />
                            <TextInput id="dress_code" v-model="form.dress_code" type="text" class="mt-1 block w-full" required />
                            <InputError class="mt-2" :message="form.errors.dress_code" />
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-4 bg-gray-900/50 px-4 py-3 text-right sm:px-6">
                    <Link :href="route('admin.invitations.index')" class="text-gray-400 hover:text-white">Cancel</Link>
                    <PrimaryButton :disabled="form.processing">Save Changes</PrimaryButton>
                </div>
            </div>
        </form>
    </div>
</template>
