<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';

defineProps({
    status: String,
});

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};
</script>

<template>
    <GuestLayout>
        <Head title="Forgot Password" />

        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-md p-6 md:p-8 space-y-4 bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <div class="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo class="w-20 h-20 fill-current text-gold-400" />
                    </Link>
                </div>

                <h1 class="text-2xl font-bold text-center text-gold-400">Umesahau Nenosiri?</h1>

                <div class="mb-4 text-sm text-gray-400">
                    Hakuna shida. Tuandikie barua pepe yako na tutakutumia kiungo cha kuweka upya nenosiri lako.
                </div>

                <div v-if="status" class="mb-4 font-medium text-sm text-green-400">
                    {{ status }}
                </div>

                <form @submit.prevent="submit">
                    <div>
                        <InputLabel for="email" value="Barua Pepe (Email)" class="text-gray-300" />

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

                    <div class="flex items-center justify-end mt-6">
                        <PrimaryButton class="w-full justify-center" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            Tuma Kiungo cha Nenosiri
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </GuestLayout>
</template>