<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { defineProps, ref } from 'vue';

defineOptions({ layout: DefaultLayout });

defineProps({
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <Head title="Admin Log in" />

    <h1 class="text-center text-2xl font-bold text-text-accent mb-4">Admin Portal</h1>
    <div v-if="status" class="mb-4 font-medium text-sm text-green-600">
        {{ status }}
    </div>

    <form @submit.prevent="submit">
        <div>
            <InputLabel for="email" value="Email Address" />
            <TextInput
                id="email"
                type="email"
                class="mt-1 block w-full"
                v-model="form.email"
                required
                autofocus
                autocomplete="username"
            />
            <InputError class="mt-2" :message="form.errors.email" />
        </div>

        <div class="mt-4">
            <InputLabel for="password" value="Password" />
            <TextInput
                id="password"
                type="password"
                class="mt-1 block w-full"
                v-model="form.password"
                required
                autocomplete="current-password"
            />
            <InputError class="mt-2" :message="form.errors.password" />
        </div>

        <div class="flex items-center justify-end mt-6">
            <PrimaryButton class="w-full justify-center text-lg" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                Log In
            </PrimaryButton>
        </div>
    </form>
</template>

<style scoped>
</style>
