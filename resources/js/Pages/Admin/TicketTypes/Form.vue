
<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import Textarea from '@/Components/Textarea.vue';
import Checkbox from '@/Components/Checkbox.vue';
import { PlusCircleIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    ticketType: Object,
});

const form = useForm({
    name: props.ticketType?.name ?? '',
    description: props.ticketType?.description ?? '',
    price: props.ticketType?.price ?? 0,
    quantity_available: props.ticketType?.quantity_available ?? null,
    is_active: props.ticketType?.is_active ?? true,
    features: props.ticketType?.features ?? [''],
});

const submit = () => {
    if (props.ticketType) {
        form.put(route('admin.ticket-types.update', props.ticketType.id));
    } else {
        form.post(route('admin.ticket-types.store'));
    }
};

const addFeature = () => {
    form.features.push('');
};

const removeFeature = (index) => {
    form.features.splice(index, 1);
};
</script>

<template>
    <Head :title="ticketType ? 'Hariri Aina ya Tiketi' : 'Ongeza Aina ya Tiketi'" />

    <PageHeader :title="ticketType ? 'Hariri Aina ya Tiketi' : 'Ongeza Aina ya Tiketi'" />

    <form @submit.prevent="submit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
                <div>
                    <InputLabel for="name" value="Jina la Aina ya Tiketi" />
                    <TextInput id="name" v-model="form.name" type="text" class="mt-1 block w-full" required />
                    <InputError class="mt-2" :message="form.errors.name" />
                </div>

                <div>
                    <InputLabel for="description" value="Maelezo Mafupi" />
                    <Textarea id="description" v-model="form.description" class="mt-1 block w-full" rows="4" />
                    <InputError class="mt-2" :message="form.errors.description" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel for="price" value="Bei (TZS)" />
                        <TextInput id="price" v-model="form.price" type="number" min="0" class="mt-1 block w-full" required />
                        <InputError class="mt-2" :message="form.errors.price" />
                    </div>
                    <div>
                        <InputLabel for="quantity_available" value="Idadi (Acha wazi kama hakuna ukomo)" />
                        <TextInput id="quantity_available" v-model="form.quantity_available" type="number" min="0" class="mt-1 block w-full" />
                        <InputError class="mt-2" :message="form.errors.quantity_available" />
                    </div>
                </div>

                <div class="flex items-center">
                    <Checkbox id="is_active" v-model:checked="form.is_active" />
                    <InputLabel for="is_active" value="Inaonekana kwa wateja?" class="ml-2" />
                    <InputError class="mt-2" :message="form.errors.is_active" />
                </div>
            </div>

            <!-- Right Column for Features -->
            <div>
                <InputLabel value="Sifa za Tiketi (Features)" class="mb-2" />
                <div class="space-y-3">
                    <div v-for="(feature, index) in form.features" :key="index" class="flex items-center space-x-2">
                        <TextInput
                            v-model="form.features[index]"
                            type="text"
                            class="block w-full"
                            placeholder="Mfano: Kinywaji cha Karibu"
                        />
                        <button
                            type="button"
                            @click="removeFeature(index)"
                            class="text-gray-400 hover:text-red-500 p-1"
                            title="Ondoa sifa"
                        >
                            <TrashIcon class="h-5 w-5" />
                        </button>
                    </div>

                    <InputError class="mt-2" :message="form.errors.features" />

                    <button
                        type="button"
                        @click="addFeature"
                        class="flex items-center space-x-2 text-sm text-gold-400 hover:text-gold-300"
                    >
                        <PlusCircleIcon class="h-5 w-5" />
                        <span>Ongeza Sifa Nyingine</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-end pt-6 border-t border-gray-700">
            <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                {{ ticketType ? 'Hifadhi Mabadiliko' : 'Tengeneza Tiketi' }}
            </PrimaryButton>
        </div>
    </form>
</template>
