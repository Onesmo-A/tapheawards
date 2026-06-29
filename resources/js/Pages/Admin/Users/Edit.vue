<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    user: Object,
});

const form = useForm({
    name: props.user.name || '',
    email: props.user.email || '',
    phone: props.user.phone || '',
    is_admin: !!props.user.is_admin,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.put(route('admin.users.update', props.user.id), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head :title="`Edit ${user.name}`" />

    <div class="mb-6">
        <h2 class="text-2xl font-bold text-white">Edit User</h2>
        <p class="mt-1 text-sm text-gray-400">Badilisha credentials na role ya user huyu.</p>
    </div>

    <div class="max-w-3xl rounded-3xl border border-white/10 bg-gray-900/70 p-6">
        <form class="space-y-5" @submit.prevent="submit">
            <div class="grid gap-5 md:grid-cols-2">
                <div>
                    <InputLabel for="name" value="Name" class="text-gray-300" />
                    <TextInput id="name" v-model="form.name" type="text" class="mt-1 block w-full" />
                    <InputError class="mt-2" :message="form.errors.name" />
                </div>
                <div>
                    <InputLabel for="email" value="Email" class="text-gray-300" />
                    <TextInput id="email" v-model="form.email" type="email" class="mt-1 block w-full" />
                    <InputError class="mt-2" :message="form.errors.email" />
                </div>
            </div>
            <div>
                <InputLabel for="phone" value="Phone" class="text-gray-300" />
                <TextInput id="phone" v-model="form.phone" type="text" class="mt-1 block w-full" />
                <InputError class="mt-2" :message="form.errors.phone" />
            </div>
            <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                    <p class="font-medium text-white">Admin Access</p>
                    <p class="text-xs text-gray-400">Toggle if this account is an admin.</p>
                </div>
                <input v-model="form.is_admin" type="checkbox" class="h-5 w-5 rounded border-gray-500 bg-gray-900 text-red-600">
            </div>
            <div class="grid gap-5 md:grid-cols-2">
                <div>
                    <InputLabel for="password" value="New Password" class="text-gray-300" />
                    <TextInput id="password" v-model="form.password" type="password" class="mt-1 block w-full" />
                    <InputError class="mt-2" :message="form.errors.password" />
                </div>
                <div>
                    <InputLabel for="password_confirmation" value="Confirm Password" class="text-gray-300" />
                    <TextInput id="password_confirmation" v-model="form.password_confirmation" type="password" class="mt-1 block w-full" />
                </div>
            </div>
            <div class="flex justify-end gap-3">
                <a :href="route('admin.users.index')" class="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5">Cancel</a>
                <button type="submit" class="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500" :disabled="form.processing">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</template>
