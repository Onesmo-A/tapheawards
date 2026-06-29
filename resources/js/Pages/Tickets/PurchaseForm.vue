<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { ArrowLeftIcon, UserIcon, EnvelopeIcon, PhoneIcon, TicketIcon } from '@heroicons/vue/24/solid';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    ticketType: Object,
    auth: Object,
});

const form = useForm({
    ticket_type_id: props.ticketType.id,
    purchaser_name: props.auth.user?.name || '',
    purchaser_email: props.auth.user?.email || '',
    purchaser_phone: '',
    quantity: 1,
});

const totalAmount = computed(() => {
    const quantity = parseInt(form.quantity, 10);
    if (isNaN(quantity) || quantity < 1) return 0;
    return props.ticketType.price * quantity;
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(value);
};

const submit = () => {
    form.post(route('tickets.process'), {
        onFinish: () => form.reset('purchaser_phone'),
    });
};
</script>

<template>
  <Head :title="title" />

  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-28">
    <div class="w-full max-w-lg space-y-8">

      <!-- Form Card -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 transition-transform transform hover:-translate-y-1 hover:shadow-3xl">
        
        <!-- Back Link -->
        <div class="mb-6">
          <Link :href="route('tickets.index')" class="flex items-center text-sm text-gray-600 hover:text-red-600 font-medium transition-colors">
            <ArrowLeftIcon class="h-4 w-4 mr-1" />
            Rudi Kuchagua Tiketi
          </Link>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <TicketIcon class="mx-auto h-14 w-14 text-red-600" />
          <h1 class="mt-4 text-3xl font-extrabold text-gray-900">Kamilisha Ununuzi</h1>
          <p class="mt-2 text-gray-600">Unanunua tiketi ya: <span class="font-bold text-red-700">{{ ticketType.name }}</span></p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="space-y-6">

          <!-- Purchaser Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Jina Kamili</label>
            <div class="mt-1 relative rounded-xl shadow-sm">
              <UserIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="form.purchaser_name" type="text" class="form-input pl-12 py-3 rounded-xl border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="Juma Hamisi" required />
            </div>
            <p v-if="form.errors.purchaser_name" class="mt-2 text-sm text-red-600">{{ form.errors.purchaser_name }}</p>
          </div>

          <!-- Purchaser Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Barua Pepe</label>
            <div class="mt-1 relative rounded-xl shadow-sm">
              <EnvelopeIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="form.purchaser_email" type="email" class="form-input pl-12 py-3 rounded-xl border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="juma.hamisi@example.com" required />
            </div>
            <p v-if="form.errors.purchaser_email" class="mt-2 text-sm text-red-600">{{ form.errors.purchaser_email }}</p>
          </div>

          <!-- Purchaser Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Namba ya Simu ya Malipo</label>
            <div class="mt-1 relative rounded-xl shadow-sm">
              <PhoneIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="form.purchaser_phone" type="tel" class="form-input pl-12 py-3 rounded-xl border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="07XX XXX XXX" required />
            </div>
            <p class="mt-1 text-xs text-gray-500">Weka namba itakayotumika kufanya malipo.</p>
            <p v-if="form.errors.purchaser_phone" class="mt-2 text-sm text-red-600">{{ form.errors.purchaser_phone }}</p>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Idadi ya Tiketi</label>
            <input v-model="form.quantity" type="number" min="1" max="100" class="form-input pl-3 py-3 rounded-xl border-gray-300 focus:ring-red-500 focus:border-red-500 w-full" required />
            <p v-if="form.errors.quantity" class="mt-2 text-sm text-red-600">{{ form.errors.quantity }}</p>
          </div>

          <!-- Summary Card -->
          <div class="bg-red-50 rounded-xl p-4 shadow-inner border border-red-100">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Bei ya tiketi moja:</span>
              <span class="font-semibold text-gray-800">{{ formatCurrency(ticketType.price) }}</span>
            </div>
            <div class="flex justify-between items-center text-lg font-bold text-red-700 border-t border-red-100 pt-2 mt-2">
              <span>Jumla Kuu:</span>
              <span>{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="form.processing"
              class="w-full flex justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
              <span v-if="form.processing">Inashughulikia...</span>
              <span v-else>Endelea na Malipo</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  @apply block w-full border placeholder-gray-400 text-gray-900 shadow-sm focus:outline-none sm:text-sm;
}
</style>
