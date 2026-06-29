<script setup>
import { Head, useForm, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { computed } from 'vue';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    marathonFee: Number,
});

const form = useForm({
    full_name: '',
    email: '',
    phone_number: '',
    gender: 'male',
    date_of_birth: '',
    tshirt_size: 'M',
    race_type: '21km',
    country: 'Tanzania',
    region: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
});

const submit = () => {
    form.post(route('marathon.store'), {
        onError: (errors) => {
            console.error(errors);
        }
    });
};

const formattedMarathonFee = computed(() => {
    return new Intl.NumberFormat('en-US').format(props.marathonFee);
});

const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const raceTypes = ['21km', '10km', '5km'];
</script>

<template>
    <Head :title="title" />

    <main class="bg-background-section py-8 pt-24 min-h-screen">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="mb-6 text-center">
                    <!-- Banner Image -->
                    <div class="relative w-full h-32 md:h-40 lg:h-48 overflow-hidden rounded-t-xl">
                        <img 
                            src="/images/backgrounds/marathon-bg.jpg" 
                            alt="Marathon Header" 
                            class="w-full h-full object-cover"
                        />
                       
                    </div>

                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">{{ title }}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">
                        Ada ya usajili ni 
                        <span class="font-bold text-primary">{{ formattedMarathonFee }} TZS</span>.
                    </p>
                </div>


                <div class="text-center mb-6 text-sm text-gray-500 dark:text-gray-400">
                    Je! Umejisajili?
                    <Link 
                        :href="route('marathon.check-status-page')" 
                        class="font-semibold text-blue-600 dark:text-blue-500 hover:underline"
                    >
                        Check Status.
                    </Link>
                </div>

                <!-- Form -->
                <form @submit.prevent="submit" class="space-y-6">
                     <!-- Personal Information -->
                    <div>
                        <h4 class="text-lg font-semibold border-b pb-2 mb-4">Taarifa Binafsi</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel for="full_name" value="Jina Kamili" />
                                <TextInput id="full_name" v-model="form.full_name" type="text" class="mt-1 block w-full" required />
                                <InputError class="mt-2" :message="form.errors.full_name" />
                            </div>                            
                            <div>
                                <InputLabel for="phone_number" value="Namba ya Simu (kwa Malipo)" />
                                <TextInput id="phone_number" v-model="form.phone_number" type="text" class="mt-1 block w-full" required placeholder="07XX XXX XXX" />
                                <InputError class="mt-2" :message="form.errors.phone_number" />
                            </div>                            
                            <div>
                                <InputLabel for="email" value="Barua Pepe (Email)" />
                                <TextInput id="email" v-model="form.email" type="email" class="mt-1 block w-full" />
                                <InputError class="mt-2" :message="form.errors.email" />
                            </div>
                             <div>
                                <InputLabel for="date_of_birth" value="Tarehe ya Kuzaliwa" />
                                <TextInput id="date_of_birth" v-model="form.date_of_birth" type="date" class="mt-1 block w-full" required />
                                <InputError class="mt-2" :message="form.errors.date_of_birth" />
                            </div>
                            <div>
                                <InputLabel for="gender" value="Jinsia" />
                                <select id="gender" v-model="form.gender" class="form-select mt-1 block w-full">
                                    <option value="male">Mwanaume</option>
                                    <option value="female">Mwanamke</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.gender" />
                            </div>
                        </div>
                    </div>

                    <!-- Race Details -->
                    <div>
                        <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-4">Taarifa za Mbio</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <InputLabel for="race_type" value="Aina ya Mbio" />
                                <select id="race_type" v-model="form.race_type" class="form-select mt-1 block w-full">
                                    <option v-for="type in raceTypes" :key="type" :value="type">{{ type.toUpperCase() }}</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.race_type" />
                            </div>
                            <div>
                                <InputLabel for="tshirt_size" value="Ukubwa wa T-Shirt" />
                                <select id="tshirt_size" v-model="form.tshirt_size" class="form-select mt-1 block w-full">
                                    <option v-for="size in tshirtSizes" :key="size" :value="size">{{ size }}</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.tshirt_size" />
                            </div>
                             <div>
                                <InputLabel for="country" value="Nchi" />
                                <TextInput id="country" v-model="form.country" type="text" class="mt-1 block w-full" required />
                                <InputError class="mt-2" :message="form.errors.country" />
                            </div>
                            <div>
                                <InputLabel for="region" value="Mkoa" />
                                <TextInput id="region" v-model="form.region" type="text" class="mt-1 block w-full" required />
                                <InputError class="mt-2" :message="form.errors.region" />
                            </div>
                        </div>
                    </div>

                    <!-- Emergency Contact -->
                    <div>
                        <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-4">Mawasiliano ya Dharura</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel for="emergency_contact_name" value="Jina la Ndugu/Jamaa" />
                                <TextInput id="emergency_contact_name" v-model="form.emergency_contact_name" type="text" class="mt-1 block w-full" required />
                                <InputError class="mt-2" :message="form.errors.emergency_contact_name" />
                            </div>
                            <div>
                                <InputLabel for="emergency_contact_phone" value="Namba ya Simu ya Ndugu" />
                                <TextInput id="emergency_contact_phone" v-model="form.emergency_contact_phone" type="text" class="mt-1 block w-full" required />
                                <InputError class="mt-2" :message="form.errors.emergency_contact_phone" />
                            </div>
                             <div class="md:col-span-2">
                                <InputLabel for="emergency_contact_relationship" value="Uhusiano" />
                                <TextInput id="emergency_contact_relationship" v-model="form.emergency_contact_relationship" type="text" class="mt-1 block w-full" placeholder="e.g., Mzazi, Mke/Mume, Rafiki" />
                                <InputError class="mt-2" :message="form.errors.emergency_contact_relationship" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            <span v-if="form.processing">Inasubiri...</span>
                            <span v-else>Sajili na Lipa</span>
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<!--
[PROMPT_SUGGESTION]Naweza kubadilisha rangi ya background ya main section?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Naweza kuongeza link ya kurudi nyumbani?[/PROMPT_SUGGESTION]
-->
