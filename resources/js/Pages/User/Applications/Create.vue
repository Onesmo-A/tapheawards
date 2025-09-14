<script setup>
import { ref } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Stepper from '@/Components/Stepper.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextareaInput from '@/Components/TextareaInput.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import InputError from '@/Components/InputError.vue';
import TextInput from '@/Components/TextInput.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import FileInput from '@/Components/FileInput.vue';

const props = defineProps({
    selectedCategory: {
        type: Object,
        required: true,
    },
    nomination_fee: {
        type: Number,
        required: true,
    },
    errors: Object,
});

const steps = [
    { name: 'Chagua Tuzo', status: 'complete' },
    { name: 'Jaza Fomu', status: 'current' },
    { name: 'Malipo & Uthibitisho', status: 'upcoming' },
];

const confirmingSubmission = ref(false);

const form = useForm({
    category_id: props.selectedCategory.id,
    applicant_name: '',
    applicant_phone: '',
    applicant_email: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    bio: '',
    photo: null,
});

const photoPreview = ref(null);

function updatePhotoPreview(file) {
    if (!file) {
        photoPreview.value = null;
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

const confirmSubmission = () => {
    // Onyesha modal ya uthibitisho.
    // Uhakiki wa data (validation) utafanyika upande wa server
    // mtumiaji atakapobonyeza "Ndiyo, Lipa Sasa".
    confirmingSubmission.value = true;
};

const submit = () => {
    form.post(route('user.applications.store'), {
        preserveScroll: true,
        onSuccess: () => confirmingSubmission.value = false,
        onError: () => confirmingSubmission.value = false,
    });
};
</script>

<template>
    <Head :title="`Jaza Fomu - ${selectedCategory.name}`" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">Anzisha Maombi ya Tuzo</h2>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <Stepper :steps="steps" class="mb-8" />

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form @submit.prevent="confirmSubmission" class="p-6 space-y-6">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">2. Jaza Fomu ya Maombi</h3>
                        <p class="mt-1 text-sm text-gray-500">
                            Unatuma maombi kwa ajili ya tuzo ya:
                            <span class="font-semibold text-indigo-600">{{ selectedCategory.name }}</span>
                        </p>

                        <!-- Jina na Simu -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel for="applicant_name" value="Jina Kamili la Mshiriki/Biashara" />
                                <TextInput
                                    id="applicant_name"
                                    v-model="form.applicant_name"
                                    type="text"
                                    class="mt-1 block w-full"
                                    required
                                />
                                <InputError class="mt-2" :message="form.errors.applicant_name" />
                            </div>

                            <div>
                                <InputLabel for="applicant_phone" value="Namba ya Simu (kwa malipo)" />
                                <TextInput
                                    id="applicant_phone"
                                    v-model="form.applicant_phone"
                                    type="text"
                                    class="mt-1 block w-full"
                                    placeholder="07XX XXX XXX"
                                    required
                                />
                                <InputError class="mt-2" :message="form.errors.applicant_phone" />
                            </div>
                        </div>

                        <!-- Email -->
                        <div>
                            <InputLabel for="applicant_email" value="Barua Pepe (Email)" />
                            <TextInput
                                id="applicant_email"
                                v-model="form.applicant_email"
                                type="email"
                                class="mt-1 block w-full"
                                required
                            />
                            <InputError class="mt-2" :message="form.errors.applicant_email" />
                        </div>

                        <!-- Bio -->
                        <div>
                            <InputLabel for="bio" value="Wasifu / Maelezo ya Mshiriki/Biashara" />
                            <TextareaInput
                                id="bio"
                                v-model="form.bio"
                                class="mt-1 block w-full"
                                rows="5"
                                required
                            />
                            <InputError class="mt-2" :message="form.errors.bio" />
                        </div>

                        <!-- Picha -->
                        <div>
                            <InputLabel for="photo" value="Picha/Logo ya Biashara (itaonyeshwa kwenye ukurasa wa wapiga kura)" />
                            <FileInput
                                id="photo"
                                class="mt-1"
                                v-model="form.photo"
                                @update:modelValue="updatePhotoPreview"
                                accept="image/*"
                            />
                            <div v-if="photoPreview" class="mt-4">
                                <span class="block w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                                    <img :src="photoPreview" class="object-cover w-full h-full" alt="Preview" />
                                </span>
                            </div>
                            <InputError class="mt-2" :message="form.errors.photo" />
                        </div> 

                        <!-- Social Media Links -->
                        <div class="col-span-1 md:col-span-2 border-t pt-6">
                             <h4 class="text-base font-medium text-gray-800">Mitandao ya Kijamii (Si lazima)</h4>
                             <p class="text-sm text-gray-500">Weka viunga (links) kamili vya kurasa zako.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <InputLabel for="facebook_url" value="Facebook URL" />
                                <TextInput id="facebook_url" v-model="form.facebook_url" type="url" class="mt-1 block w-full" placeholder="https://facebook.com/yourpage" />
                                <InputError class="mt-2" :message="form.errors.facebook_url" />
                            </div>
                             <div>
                                <InputLabel for="instagram_url" value="Instagram URL" />
                                <TextInput id="instagram_url" v-model="form.instagram_url" type="url" class="mt-1 block w-full" placeholder="https://instagram.com/yourhandle" />
                                <InputError class="mt-2" :message="form.errors.instagram_url" />
                            </div>
                            <div>
                                <InputLabel for="tiktok_url" value="TikTok URL" />
                                <TextInput id="tiktok_url" v-model="form.tiktok_url" type="url" class="mt-1 block w-full" placeholder="https://tiktok.com/@yourhandle" />
                                <InputError class="mt-2" :message="form.errors.tiktok_url" />
                            </div>
                        </div>


                        <!-- Ada na Button -->
                        <div class="border-t pt-6 flex items-center justify-between">
                            <div class="text-sm text-gray-600">
                                Ada ya Maombi:
                                <span class="font-bold text-lg text-gray-800">
                                    TSh {{ new Intl.NumberFormat().format(nomination_fee) }}/=
                                </span>
                            </div>
                            <PrimaryButton type="submit" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                                Endelea na Malipo
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <ConfirmationModal :show="confirmingSubmission" @close="confirmingSubmission = false">
            <template #title>
                Thibitisha Malipo
            </template>

            <template #content>
                Utatumiwa ombi la kulipa <span class="font-bold">TSh {{ new Intl.NumberFormat().format(nomination_fee) }}/=</span> kwenye namba <strong class="text-gray-800">{{ form.applicant_phone }}</strong>.
                <br /><br />
                Tafadhali hakikisha simu yako iko karibu nawe ili kuthibitisha muamala.
            </template>

            <template #footer>
                <SecondaryButton @click="confirmingSubmission = false"> Ghairi </SecondaryButton>
                <PrimaryButton
                    class="ms-3"
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                    @click="submit"
                >
                    <span v-if="form.processing">Inasubiri...</span>
                    <span v-else>Ndiyo, Lipa Sasa</span>
                </PrimaryButton>
            </template>
        </ConfirmationModal>
    </AuthenticatedLayout>
</template>
