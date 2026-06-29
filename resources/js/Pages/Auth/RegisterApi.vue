<script setup>
import { ref } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Register" />

        <!-- Wrapper to center the form on the page -->
       <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16 min-h-screen">
            <div class="w-full max-w-md p-6 md:p-8 space-y-4 bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <div class="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo class="w-20 h-20 fill-current text-gold-400" />
                    </Link>
                </div>

                <h1 class="text-2xl font-bold text-center text-gold-400">Create Your Account</h1>

                <form @submit.prevent="submit">
                    <div>
                        <InputLabel for="name" value="Full Name" class="text-white" />
                        <TextInput
                            id="name"
                            type="text"
                            class="mt-1 block w-full"
                            v-model="form.name"
                            required
                            autofocus
                            autocomplete="name"
                        />
                        <InputError class="mt-2" :message="form.errors.name" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="email" value="Email" class="text-white" />
                        <TextInput
                            id="email"
                            type="email"
                            class="mt-1 block w-full"
                            v-model="form.email"
                            required
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
                                autocomplete="new-password"
                            />
                            <button type="button" @click="passwordVisible = !passwordVisible" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gold-400">
                                <EyeSlashIcon v-if="passwordVisible" class="h-5 w-5" />
                                <EyeIcon v-else class="h-5 w-5" />
                            </button>
                        </div>
                        <InputError class="mt-2" :message="form.errors.password" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="password_confirmation" value="Confirm Password" class="text-white"/>
                        <div class="relative">
                            <TextInput
                                id="password_confirmation"
                                :type="confirmPasswordVisible ? 'text' : 'password'"
                                class="mt-1 block w-full"
                                v-model="form.password_confirmation"
                                required
                                autocomplete="new-password"
                            />
                            <button type="button" @click="confirmPasswordVisible = !confirmPasswordVisible" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gold-400">
                                <EyeSlashIcon v-if="confirmPasswordVisible" class="h-5 w-5" />
                                <EyeIcon v-else class="h-5 w-5" />
                            </button>
                        </div>
                        <InputError class="mt-2" :message="form.errors.password_confirmation" />
                    </div>

                    <div class="flex items-center justify-end mt-6">
                        <Link :href="route('login')" class="underline text-sm text-gray-400 hover:text-gold-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Already registered?
                        </Link>
                        <PrimaryButton class="ms-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </GuestLayout>
</template>