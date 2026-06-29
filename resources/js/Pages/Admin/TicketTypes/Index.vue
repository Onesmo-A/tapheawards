<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Pagination from '@/Components/Pagination.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import { ref } from 'vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    ticketTypes: Object,
});

const showConfirmDeleteModal = ref(false);
const ticketTypeToDelete = ref(null);

const confirmDelete = (ticketType) => {
    ticketTypeToDelete.value = ticketType;
    showConfirmDeleteModal.value = true;
};

const deleteTicketType = () => {
    if (ticketTypeToDelete.value) {
        router.delete(route('admin.ticket-types.destroy', ticketTypeToDelete.value.id), {
            onFinish: () => {
                showConfirmDeleteModal.value = false;
                ticketTypeToDelete.value = null;
            },
        });
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(value);
};
</script>



    <!-- REKEBISHO: Weka PageHeader ndani ya slot ya 'header' ya AdminLayout -->
    <template #header>
        <PageHeader title="Simamia Aina za Tiketi">
            
        </PageHeader>
        
   

                <Link :href="route('admin.ticket-types.create') " class="mt-4 md:mt-0">
                    <PrimaryButton>Ongeza Aina Mpya</PrimaryButton>
                </Link>
          
    <div class="overflow-x-auto bg-gray-800/50 border border-gray-700 rounded-2xl shadow-lg">
        <table class="min-w-full text-sm text-left text-gray-300 divide-y divide-gray-700">
            <thead class="text-xs text-gray-400 uppercase bg-gray-900/50">
                <tr>
                    <th scope="col" class="px-6 py-3">Jina</th>
                    <th scope="col" class="px-6 py-3">Bei</th>
                    <th scope="col" class="px-6 py-3">Idadi</th>
                    <th scope="col" class="px-6 py-3">Inaonekana</th>
                    <th scope="col" class="relative px-6 py-3"><span class="sr-only">Vitendo</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="ticketTypes.data.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-gray-400">Hakuna aina za tiketi zilizopatikana.</td>
                </tr>
                <tr v-else v-for="ticketType in ticketTypes.data" :key="ticketType.id" class="hover:bg-gray-800/50">
                        <td class="px-6 py-4 font-medium text-white whitespace-nowrap">{{ ticketType.name }}</td>
                        <td class="px-6 py-4">{{ formatCurrency(ticketType.price) }}</td>
                        <td class="px-6 py-4">{{ ticketType.quantity_available ?? 'Bila ukomo' }}</td>
                        <td class="px-6 py-4">
                            <CheckCircleIcon v-if="ticketType.is_active" class="h-6 w-6 text-green-500" />
                            <XCircleIcon v-else class="h-6 w-6 text-red-500" />
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex items-center justify-end space-x-4">
                                <Link :href="route('admin.ticket-types.edit', ticketType.id)" class="text-gold-400 hover:text-gold-300">
                                    <PencilSquareIcon class="h-5 w-5" />
                                </Link>
                                <button @click="confirmDelete(ticketType)" class="text-red-500 hover:text-red-400">
                                    <TrashIcon class="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                </tr>
            </tbody>
        </table>
    </div>

    <Pagination :links="ticketTypes.links" class="mt-6" />

    <ConfirmationModal :show="showConfirmDeleteModal" @close="showConfirmDeleteModal = false">
        <template #title>Futa Aina ya Tiketi</template>
        <template #content>
            Una uhakika unataka kufuta aina ya tiketi ya
            <span class="font-bold text-white">"{{ ticketTypeToDelete?.name }}"</span>?
            Kitendo hiki hakiwezi kutenduliwa.
        </template>
        <template #footer>
            <button @click="showConfirmDeleteModal = false" class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                Ghairi
            </button>
            <button @click="deleteTicketType" class="px-4 py-2 ml-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Futa
            </button>
        </template>
    </ConfirmationModal>
</template>