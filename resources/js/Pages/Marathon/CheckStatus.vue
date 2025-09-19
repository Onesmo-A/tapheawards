<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import TextInput from '@/Components/TextInput.vue';
import InputLabel from '@/Components/InputLabel.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineOptions({
  layout: DefaultLayout,
});

const form = useForm({
    phone_number: '',
});

const submit = () => {
    form.post(route('marathon.find-registration'), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Angalia Usajili wa Marathon" />

    <PageHeader 
        title="Angalia Hali ya Usajili"
        subtitle="Weka namba ya simu uliyotumia kujisajili ili kuona hali ya usajili wako na namba yako ya ushiriki."
    class="py-8 pt-14 md:pt-16" />

    <main class="bg-background-section py-32 pt-14 md:pt-16">
        <div class="max-w-xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                
                <form @submit.prevent="submit" class="space-y-6">
                    <div>
                        <InputLabel for="phone_number" value="Namba ya Simu" />
                        <TextInput id="phone_number" v-model="form.phone_number" type="text" class="mt-1 block w-full" placeholder="07XX XXX XXX" required />
                        <InputError class="mt-2" :message="form.errors.phone_number" />
                    </div>

                    <div class="flex items-center justify-center pt-4">
                        <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            <span v-if="form.processing">Inatafuta...</span>
                            <span v-else>Angalia Sasa</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>