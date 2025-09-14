<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import TextareaInput from '@/Components/TextareaInput.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const props = defineProps({
    title: String,
    description: String,
    categories: Array,
});

const form = useForm({
    suggested_nominee_name: '',
    suggested_nominee_phone: '',
    suggested_nominee_workplace: '',
    category_id: '',
    reason: '',
    suggester_name: '',
    suggester_phone: '',
    fingerprint_js: '', // Ongeza hapa
});

const submit = async () => {
    // Pata fingerprint kabla ya kutuma fomu
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    form.fingerprint_js = result.visitorId;
    form.post(route('nominees.suggestion.store'));
};

// URL ya site na Instagram kwa social sharing
const siteUrl = 'https://tapheawards.co.tz';
const instagramUrl = 'https://www.instagram.com/taphe_awards';
</script>
<template>

    <Head>
        <title>{{ title }}</title>
        <meta name="description"
            content="Pendekeza mtu, taasisi au kitengo kinachostahili kutambuliwa kupitia TAPHE Awards 2025. Toa nafasi ya kutambua juhudi na mafanikio katika sekta mbalimbali za afya nchini Tanzania." />
        <!-- Open Graph / Facebook -->
        <meta property="og:title" :content="title + ' | TAPHE Awards'" />
        <meta property="og:description" content="Pendekeza shujaa wa afya unayemjua. Jaza fomu na utambue mchango wao katika kuboresha sekta ya afya Tanzania." />
        <meta property="og:type" content="website" />
        <meta property="og:url" :content="siteUrl + '/suggest-nominee'" />
        <meta property="og:image" content="https://tapheawards.co.tz/images/share-thumbnail.png" /> <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="title + ' | TAPHE Awards 2025'" />
        <meta name="twitter:description" content="Pendekeza shujaa wa afya unayemjua. Jaza fomu na utambue mchango wao katika kuboresha sekta ya afya Tanzania." />
        <meta name="twitter:image" content="https://tapheawards.co.tz/images/share-thumbnail.png" />
    </Head>
    <GuestLayout>
        <div class="py-12 bg-background-section">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 md:p-8">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-accent drop-shadow-title">{{ title }}</h1>
                        <p class="mt-2 text-lg text-text-secondary">{{ description }}</p>
                    </div>
                    <FlashMessage />
                    <form @submit.prevent="submit">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Jina la Anayependekezwa -->
                            <div class="md:col-span-2">
                                <InputLabel for="suggested_nominee_name"
                                    value="Jina Kamili (Taasisi/Idara/Kitengo/Mtu) Unayempendekeza" />
                                <TextInput id="suggested_nominee_name" type="text" class="mt-1 block w-full"
                                    v-model="form.suggested_nominee_name" required autofocus />
                                <InputError class="mt-2" :message="form.errors.suggested_nominee_name" />
                            </div> <!-- Namba ya simu ya anayependekezwa -->
                            <div class="md:col-span-2">
                                <InputLabel for="suggested_nominee_phone" value="Namba yake ya Simu" />
                                <TextInput id="suggested_nominee_phone" type="text" class="mt-1 block w-full"
                                    v-model="form.suggested_nominee_phone" />
                                <InputError class="mt-2" :message="form.errors.suggested_nominee_phone" />
                            </div> <!-- Kategoria -->
                            <div class="md:col-span-2">
                                <InputLabel for="category_id" value="Pendekeza Katika Kategoria Gani?" /> <v-select
                                    id="category_id"
                                    class="mt-1 block w-full"
                                    v-model="form.category_id"
                                    :options="categories"
                                    label="name"
                                    :reduce="category => category.id"
                                    placeholder="-- Andika kutafuta au chagua kategoria --"
                                    required />
                                <InputError class="mt-2" :message="form.errors.category_id" />
                            </div> <!-- Sababu -->
                            <div class="md:col-span-2">
                                <InputLabel for="reason"
                                    value="Kwa Nini Unampendekeza? (Eleza kwa ufupi kazi zake na mafanikio)" />
                                <TextareaInput id="reason" class="mt-1 block w-full" v-model="form.reason" required
                                    rows="5" />
                                <InputError class="mt-2" :message="form.errors.reason" />
                            </div>
                            <div class="md:col-span-2 border-t pt-6">
                                <h3 class="text-lg font-medium text-text-primary">Taarifa Zako (Si Lazima)</h3>
                                <p class="text-sm text-text-secondary mb-4">Tunaweza kukutafuta kwa maelezo zaidi.</p>
                            </div> <!-- Jina la Mpendekezaji -->
                            <div>
                                <InputLabel for="suggester_name" value="Jina Lako" />
                                <TextInput id="suggester_name" type="text" class="mt-1 block w-full"
                                    v-model="form.suggester_name" />
                            </div> <!-- Namba ya simu ya Mpendekezaji -->
                            <div>
                                <InputLabel for="suggester_phone" value="Namba Yako ya Simu" />
                                <TextInput id="suggester_phone" type="text" class="mt-1 block w-full"
                                    v-model="form.suggester_phone" />
                            </div>
                        </div>
                        <div class="flex items-center justify-end mt-8">
                            <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing"> Tuma
                                Pendekezo </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>
<style>
/* Hii itahakikisha clear & dropdown icons ziko mwishoni kulia */
.v-select {
  position: relative;
}

.v-select .vs__dropdown-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-select .vs__actions {
  position: absolute;
  top: 50%;
  right: 0.5rem; /* nafasi kidogo kutoka kulia */
  transform: translateY(-50%);
  display: flex;
  gap: 0.25rem; /* nafasi kati ya 'x' na arrow */
}

.v-select .vs__selected-options {
  padding-right: 2.5rem; /* toa nafasi ya icons pembeni kulia */
}

</style>