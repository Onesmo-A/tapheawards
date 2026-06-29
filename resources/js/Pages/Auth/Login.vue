<script setup>
import { ref } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Checkbox from '@/Components/Checkbox.vue';

defineOptions({ layout: GuestLayout });

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const passwordVisible = ref(false);

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <Head title="Log in" />

    <!-- Wrapper to center the form on the page -->
    <div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md p-6 md:p-8 space-y-4 bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
            <div class="flex justify-center">
                <Link href="/">
                    <ApplicationLogo class="w-20 h-20 fill-current text-gold-400" />
                </Link>
            </div>

            <h1 class="text-2xl font-bold text-center text-gold-400">Account Login</h1>

            <div v-if="status" class="mb-4 font-medium text-sm text-green-500">
                {{ status }}
            </div>

            <form @submit.prevent="submit">
                <div>
                    <InputLabel for="email" value="Email" class="text-white" />
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
                    <InputLabel for="password" value="Password" class="text-white"/>
                    <div class="relative">
                        <TextInput
                            id="password"
                            :type="passwordVisible ? 'text' : 'password'"
                            class="mt-1 block w-full"
                            v-model="form.password"
                            required
                            autocomplete="current-password"
                        />
                        <button type="button" @click="passwordVisible = !passwordVisible" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gold-400">
                            <EyeSlashIcon v-if="passwordVisible" class="h-5 w-5" />
                            <EyeIcon v-else class="h-5 w-5" />
                        </button>
                    </div>
                    <InputError class="mt-2" :message="form.errors.password" />
                </div>

                <div class="flex items-center justify-between mt-4">
                    <label class="flex items-center">
                        <Checkbox name="remember" v-model:checked="form.remember" />
                        <span class="ms-2 text-sm text-gray-400">Remember me</span>
                    </label>

                    <Link v-if="canResetPassword" :href="route('password.request')" class="underline text-sm text-gray-400 hover:text-gold-400">
                        Forgot password?
                    </Link>
                </div>

                <div class="mt-6">
                    <PrimaryButton class="w-full justify-center" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                        Log In
                    </PrimaryButton>
                </div>

                <div class="mt-6 text-center">
                    <Link :href="route('register')" class="underline text-sm text-gray-400 hover:text-gold-400">
                        Don't have an account? Register
                    </Link>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
</style>
