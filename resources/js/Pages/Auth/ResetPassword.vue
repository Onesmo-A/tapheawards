<script setup>
import { ref } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { Head, useForm, Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';

const props = defineProps({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const submit = () => {
    // BORESHO: Tumia 'password.store' kama ilivyo kwenye routes/auth.php
    form.post(route('password.store'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Reset Password" />

        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-md p-6 md:p-8 space-y-4 bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <div class="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo class="w-20 h-20 fill-current text-gold-400" />
                    </Link>
                </div>

                <h1 class="text-2xl font-bold text-center text-gold-400">Weka Nenosiri Jipya</h1>

                <form @submit.prevent="submit">
                    <div>
                        <InputLabel for="email" value="Barua Pepe (Email)" class="text-gray-300" />

                        <TextInput
                            id="email"
                            type="email"
                            class="mt-1 block w-full bg-gray-700/50 border-gray-600"
                            v-model="form.email"
                            required
                            autofocus
                            autocomplete="username"
                            disabled
                        />

                        <InputError class="mt-2" :message="form.errors.email" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="password" value="Nenosiri Jipya" class="text-gray-300"/>
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
                        <InputLabel for="password_confirmation" value="Thibitisha Nenosiri" class="text-gray-300"/>
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
                        <PrimaryButton class="w-full justify-center" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            Weka Nenosiri Jipya
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </GuestLayout>
</template>
