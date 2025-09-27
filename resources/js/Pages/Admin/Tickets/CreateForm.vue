<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import TextInput from '@/Components/TextInput.vue';
import InputLabel from '@/Components/InputLabel.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SelectInput from '@/Components/SelectInput.vue';
import TextareaInput from '@/Components/TextareaInput.vue';

const props = defineProps({
    title: String,
    ticketTypes: Array,
});

const form = useForm({
    ticket_type_id: '',
    purchaser_name: '',
    purchaser_email: '',
    purchaser_phone: '',
    quantity: 1,
    notes: '',
});

const submit = () => {
    form.post(route('admin.tickets.store'), {
        onSuccess: () => form.reset(),
    });
};

</script>

<template>
    <Head :title="title" />

    <AdminLayout>
        <template #header>
            <PageHeader>
                <template #title>{{ title }}</template>
                <template #description>
                    Use this form to manually create tickets for guests or offline payments. The tickets will be marked as 'completed' immediately.
                </template>
            </PageHeader>
        </template>

        <div class="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <form @submit.prevent="submit" class="space-y-6">
                <div>
                    <InputLabel for="ticket_type_id" value="Ticket Type" />
                    <SelectInput
                        id="ticket_type_id"
                        class="mt-1 block w-full"
                        v-model="form.ticket_type_id"
                        required
                    >
                        <option value="" disabled>Select a ticket type</option>
                        <option v-for="type in ticketTypes" :key="type.id" :value="type.id">
                            {{ type.name }} ({{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(type.price) }})
                        </option>
                    </SelectInput>
                    <InputError class="mt-2" :message="form.errors.ticket_type_id" />
                </div>

                <div>
                    <InputLabel for="purchaser_name" value="Buyer's Full Name" />
                    <TextInput id="purchaser_name" type="text" class="mt-1 block w-full" v-model="form.purchaser_name" required />
                    <InputError class="mt-2" :message="form.errors.purchaser_name" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel for="purchaser_email" value="Buyer's Email" />
                        <TextInput id="purchaser_email" type="email" class="mt-1 block w-full" v-model="form.purchaser_email" required />
                        <InputError class="mt-2" :message="form.errors.purchaser_email" />
                    </div>
                    <div>
                        <InputLabel for="purchaser_phone" value="Buyer's Phone" />
                        <TextInput id="purchaser_phone" type="tel" class="mt-1 block w-full" v-model="form.purchaser_phone" required />
                        <InputError class="mt-2" :message="form.errors.purchaser_phone" />
                    </div>
                </div>

                <div>
                    <InputLabel for="quantity" value="Quantity" />
                    <TextInput id="quantity" type="number" min="1" class="mt-1 block w-full" v-model="form.quantity" required />
                    <InputError class="mt-2" :message="form.errors.quantity" />
                </div>

                <div>
                    <InputLabel for="notes" value="Internal Notes (Optional)" />
                    <TextareaInput id="notes" class="mt-1 block w-full" v-model="form.notes" rows="3" placeholder="e.g., Paid via cash at the office." />
                    <InputError class="mt-2" :message="form.errors.notes" />
                </div>

                <div class="flex items-center justify-end pt-4">
                    <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                        Create and Generate Tickets
                    </PrimaryButton>
                </div>
            </form>
        </div>

    </AdminLayout>
</template>