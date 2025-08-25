<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { defineProps, ref } from 'vue';

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

         <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-900">
       <div class="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo class="w-20 h-20 fill-current text-gold-400" />
                    </Link>
                </div>

 <div class="w-full sm:max-w-md mt-6 px-6 py-8 bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
            <h1 class="text-center text-2xl font-bold text-gold-gradient mb-4">Admin Portal</h1>


      <div v-if="status" class="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                {{ status }}
            </div>

              <form @submit.prevent="submit">
                <div>
                    <InputLabel for="email" value="Email Address" class="text-gray-300" />
                    <TextInput
                        id="email"
                        type="email"
                        class="mt-1 block w-full bg-gray-700 border-gray-600 text-gray-200 focus:border-gold-500 focus:ring-gold-500"
                        v-model="form.email"
                        required
                        autofocus
                        autocomplete="username"
                    />
                    <InputError class="mt-2" :message="form.errors.email" />
                </div>

            <div class="mt-4">
                    <InputLabel for="password" value="Password" class="text-gray-300" />
                    <TextInput
                        id="password"
                        type="password"
                        class="mt-1 block w-full bg-gray-700 border-gray-600 text-gray-200 focus:border-gold-500 focus:ring-gold-500"
                        v-model="form.password"
                        required
                        autocomplete="current-password"
                    />
                    <InputError class="mt-2" :message="form.errors.password" />
                </div>

               <div class="flex items-center justify-end mt-6">
                    <PrimaryButton class="w-full justify-center text-lg bg-gold-600 hover:bg-gold-700 focus:bg-gold-700 active:bg-gold-800 focus:ring-offset-gray-800" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                        Log In
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.text-gold-gradient {
    background: linear-gradient(to right, #D4AF37, #FFD700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>