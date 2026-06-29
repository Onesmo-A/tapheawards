<script setup>
import { ref } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';


const form = useForm({
    password: '',
});

const submit = () => {
    form.post(route('password.confirm'), {
        onFinish: () => form.reset(),
    });
};

const passwordVisible = ref(false);
</script>

<template>
    <GuestLayout>
        <Head title="Confirm Password" />

        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-md p-6 md:p-8 space-y-4 bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <h1 class="text-2xl font-bold text-center text-gold-400">Confirm Password</h1>

                <div class="mb-4 text-sm text-gray-400">
                    This is a secure area of the application. Please confirm your password before continuing.
                </div>

                <form @submit.prevent="submit">
                    <div>
                        <InputLabel for="password" value="Password" class="text-gray-300" />
                        <div class="relative">
                            <TextInput
                                id="password"
                                :type="passwordVisible ? 'text' : 'password'"
                                class="mt-1 block w-full"
                                v-model="form.password"
                                required
                                autocomplete="current-password"
                                autofocus
                            />
                            <button type="button" @click="passwordVisible = !passwordVisible" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gold-400">
                                <EyeSlashIcon v-if="passwordVisible" class="h-5 w-5" />
                                <EyeIcon v-else class="h-5 w-5" />
                            </button>
                        </div>
                        <InputError class="mt-2" :message="form.errors.password" />
                    </div>

                    <div class="flex justify-end mt-6">
                        <PrimaryButton class="w-full justify-center" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            Confirm
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </GuestLayout>
</template>
